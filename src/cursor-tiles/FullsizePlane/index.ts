import {
  Mesh,
  PlaneGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from 'three';
import {
  abs,
  float,
  floor,
  mix,
  mx_noise_float,
  step,
  texture,
  time,
  uniform,
  uv,
  vec2,
} from 'three/tsl';
import { MeshBasicNodeMaterial, UniformNode } from 'three/webgpu';

import { TProps } from './types';

const loader = new TextureLoader();

export class FullsizePlane {
  private get webgl() {
    return this._props.webgl;
  }

  private _initWidth: number;

  private _initHeight: number;

  private _mesh: Mesh;

  private _geometry: PlaneGeometry;

  private _material: MeshBasicNodeMaterial;

  private _texture: Texture;

  private _progress: UniformNode<'float', number> = uniform(0);

  private _amp: UniformNode<'float', number> = uniform(0);

  private _textureAspect: UniformNode<'float', number> = uniform(1);

  private _destructors: (() => void)[] = [];

  constructor(private _props: TProps) {
    const { webgl } = _props;

    // Save initial sizes
    this._initWidth = webgl.width;
    this._initHeight = webgl.height;

    // Create geometry
    this._geometry = new PlaneGeometry(this._initWidth, this._initHeight, 2, 2);

    // Create shader material
    this._material = new MeshBasicNodeMaterial({ transparent: true });

    // create mesh
    this._mesh = new Mesh(this._geometry, this._material);
    webgl.scene.add(this._mesh);

    // resize
    this._destructors.push(webgl.callbacks.on('resize', () => this._resize()));

    // load texture
    const resolvedSrc = _props.src.startsWith('/') || _props.src.startsWith('http') || _props.src.startsWith('data:')
      ? _props.src
      : `/${_props.src}`;
    this._texture = loader.load(resolvedSrc, (tex) => {
      const aspect = tex.image.width / tex.image.height;
      this._textureAspect.value = aspect;
    });
    this._texture.colorSpace = SRGBColorSpace;

    // Update material

    const localUV = uv();
    const grid = vec2(webgl.uAspectRatio.mul(_props.uBlocks), _props.uBlocks);
    const cell = floor(localUV.mul(grid));
    const cellUV = cell.add(0.5).div(grid);

    const noiseOffset = time.mul(0.1);
    const noise = mx_noise_float(cellUV.mul(100).add(noiseOffset), 1);
    const chunky = step(abs(noise), float(0.2));

    const amp = float(0.2).mul(this._amp);
    const cellShift = chunky.mul(amp);

    const bottom = this._progress.sub(amp).add(cellShift);
    const top = bottom.add(1);

    const planeAspect = webgl.uAspectRatio;
    const texAspect = this._textureAspect;
    const scaleY = planeAspect.div(texAspect);
    const scaleX = texAspect.div(planeAspect);
    const coverUV = mix(
      vec2(localUV.x.sub(0.5).div(scaleX).add(0.5), localUV.y),
      vec2(localUV.x, localUV.y.sub(0.5).div(scaleY).add(0.5)),
      step(texAspect, planeAspect),
    );

    const sampler = texture(this._texture, coverUV);

    const mask = step(bottom, cellUV.y).mul(step(cellUV.y, top));

    this._material.fragmentNode = sampler.mul(mask);
  }

  get material() {
    return this._material;
  }

  set progress(value: number) {
    this._progress.value = value;
  }

  get progress() {
    return this._progress.value;
  }

  get mesh() {
    return this._mesh;
  }

  get amp() {
    return this._amp.value;
  }

  set amp(value: number) {
    this._amp.value = value;
  }

  /** Resize the scene */
  private _resize() {
    const { width, height } = this.webgl;

    // calculate mesh scale
    const widthScale = width / this._initWidth;
    const heightScale = height / this._initHeight;

    // set mesh scale
    this._mesh.scale.set(widthScale, heightScale, 1);
  }

  /** Destroy the scene */
  public destroy() {
    this.webgl.scene.remove(this._mesh);
    this._material.dispose();
    this._geometry.dispose();
    this._texture.dispose();

    this._destructors.forEach((destruct) => destruct());
  }
}
