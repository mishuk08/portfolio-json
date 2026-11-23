import {
  length,
  mix,
  negate,
  pass,
  texture,
  uniform,
  uv,
  vec3,
  vec4,
  clamp,
} from 'three/tsl';
import { RenderPipeline } from 'three/webgpu';
import { Snap, SnapSlide } from 'vevet';

import { Flow } from './Flow';
import { FullsizePlane } from './FullsizePlane';
import { createGUI } from './gui/createGUI';
import { Pointer } from './Pointer';
import { PRESETS } from './presets';
import { Webgl } from './webgl';

export interface CursorTilesOptions {
  images?: string[];
  inspector?: boolean;
  wheel?: boolean;
  grabCursor?: boolean;
  onSlideChange?: (index: number) => void;
}

export function initCursorTiles(container: HTMLElement, options: CursorTilesOptions = {}) {
  const images = options.images || ['/0.jpg', '/1.jpg', '/2.jpg'];
  const enableWheel = options.wheel !== undefined ? options.wheel : true;
  const grabCursor = options.grabCursor !== undefined ? options.grabCursor : true;

  // Initialize webgl manager
  const webgl = new Webgl(container, {
    near: 0.01,
    far: 5000,
    perspective: 10,
    render: false,
    inspector: options.inspector ?? false,
  });

  // Create settings
  const { settings, onChange } = createGUI({
    inspector: webgl.inspector,
    initials: PRESETS.DEFAULT,
    presets: PRESETS,
    settings: {
      pointer: {
        ease: { min: 0.05, max: 0.3, step: 0.00001 },
      },
      flow: {
        radius: { min: 0.0075, max: 0.06, step: 0.00001 },
        decay: { min: 0, max: 0.1, step: 0.00001 },
      },
      dye: {
        color: {},
        strength: { min: 0, max: 1, step: 0.00001 },
      },
      aberration: {
        strength: { min: 0, max: 1, step: 0.00001 },
      },
      scene: {
        distortion: { min: 0, max: 0.05, step: 0.00001 },
        blocks: { min: 5, max: 50, step: 1 },
      },
    },
  });

  webgl.inspector?.hide();

  const renderPipeline = new RenderPipeline(webgl.renderer);

  // Uniforms
  const uSceneDistortion = uniform(settings.scene.distortion);
  const uSceneBlocks = uniform(settings.scene.blocks);
  const uDyeColor = uniform(settings.dye.color);
  const uDyeStrength = uniform(settings.dye.strength);
  const uAberrationStrength = uniform(settings.aberration.strength);

  onChange(() => {
    uSceneDistortion.value = settings.scene.distortion;
    uSceneBlocks.value = settings.scene.blocks;
    uDyeColor.value = settings.dye.color;
    uDyeStrength.value = settings.dye.strength;
    uAberrationStrength.value = settings.aberration.strength;
  });

  // Create flow
  const flowInstance = new Flow({
    name: 'Flow',
    resolution: 256,
    uAspectRatio: webgl.uAspectRatio,
    uBlocks: uSceneBlocks,
    settings: settings.flow,
  });

  onChange(() => flowInstance.updateUniforms());

  // Create pointer
  const pointer = new Pointer(container);

  webgl.callbacks.on('render', () => {
    const width = Math.max(webgl.width, 1);
    const height = Math.max(webgl.height, 1);

    pointer.update(settings.pointer.ease);

    flowInstance.setPointer(
      pointer.coords.x / width,
      pointer.coords.y / height,
      pointer.velocity.x / width,
      pointer.velocity.y / height,
    );

    flowInstance.render(webgl.renderer);
    renderPipeline.render();
  });

  /// Shaders
  const flowSampler = flowInstance.texture;
  const scenePass = pass(webgl.scene, webgl.camera).getTextureNode();

  const flowDirection = texture(flowSampler, uv()).rg;
  const uvOffset = flowDirection.mul(negate(uSceneDistortion));
  const sceneUV = uv().add(uvOffset);
  const sceneColor = texture(scenePass, sceneUV);

  const clampedDirection = clamp(flowDirection, -1, 1);
  const dyeStrength = length(clampedDirection).mul(uDyeStrength);

  const caStrength = uAberrationStrength.mul(uSceneDistortion);
  const caOffset = flowDirection.mul(caStrength);

  const caR = texture(scenePass, sceneUV.add(caOffset)).r;
  const caG = texture(scenePass, sceneUV.sub(caOffset)).g;
  const caB = texture(scenePass, sceneUV.sub(caOffset)).b;
  const caColor = vec4(vec3(caR, caG, caB), sceneColor.a);

  const output = mix(caColor, vec4(uDyeColor, 1), dyeStrength);

  const flowPreviewColor = texture(flowSampler, uv()).rg.mul(0.5).add(0.5);
  void vec4(vec3(flowPreviewColor, 0), 1).toInspector('Flow');

  renderPipeline.outputNode = output;

  const planes = images.map(
    (src) => new FullsizePlane({ webgl, src, uBlocks: uSceneBlocks }),
  );

  const slides = planes.map(() => new SnapSlide(null, { size: 'stretch' }));

  const snap = new Snap({
    container,
    direction: 'vertical',
    slides,
    duration: 1000,
    loop: true,
    wheel: enableWheel,
    followWheel: false,
    grabCursor,
  });

  snap.on('update', () => {
    snap.slides.forEach((slide) => {
      const plane = planes[slide.index];

      const mod = Math.abs(slide.progress % 1);
      const amp = 1 - Math.abs(1 - 2 * mod);

      plane.amp = amp;
      plane.progress = slide.progress;

      plane.mesh.visible = slide.isVisible;
    });
    if (options.onSlideChange) {
      options.onSlideChange(snap.activeIndex ?? 0);
    }
  });

  return {
    webgl,
    snap,
    pointer,
    flowInstance,
    planes,
    settings,
    renderPipeline,
    destroy: () => {
      snap.destroy();
      pointer.destroy();
      flowInstance.destroy();
      planes.forEach((plane) => plane.destroy());
      webgl.destroy();
    },
  };
}
