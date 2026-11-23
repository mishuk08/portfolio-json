import { OrthographicCamera, Vector2 } from 'three';
import {
  add,
  distance,
  floor,
  texture,
  uniform,
  vec2,
  screenUV,
  exp,
  negate,
  vec4,
} from 'three/tsl';
import { WebGPURenderer } from 'three/webgpu';

import { DoubleFBO } from './DoubleFBO';
import { Quad } from './Quad';
import { IFlowProps, TFlowSettings, TUniforms } from './types';

const TARGET_FPS = 165;
const FLOW_FIXED_MS = 1000 / TARGET_FPS;
const FLOW_MAX_SUBSTEPS = 5;

export class Flow {
  private _camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  private _quad: Quad;

  private _velocityPass: DoubleFBO;

  private _uniforms: TUniforms;

  private _accumMs = 0;
  private _lastTime?: number;

  constructor(private _props: IFlowProps) {
    const { resolution } = _props;

    // Uniforms
    this._uniforms = {
      mouse: uniform(new Vector2(0, 0)),
      velocity: uniform(new Vector2(0, 0)),
      deltaTime: uniform(0),
    } as TUniforms;

    // Update uniforms
    this.updateUniforms();

    // Create Quad
    this._quad = new Quad();

    // Create passes
    this._velocityPass = new DoubleFBO(resolution);

    // Init materials
    this._initVelocityPass();
  }

  /** Final Texture */
  get texture() {
    return this._velocityPass.sampler;
  }

  /** Uniforms */
  get uniforms() {
    return this._uniforms;
  }

  /** Update uniforms */
  public updateUniforms() {
    const { settings } = this._props;

    const keys = Object.keys(settings) as (keyof TFlowSettings)[];
    keys.forEach((key) => {
      if (key in this._uniforms) {
        this._uniforms[key].value = settings[key];
      } else {
        this._uniforms[key] = uniform(settings[key]);
      }
    });
  }

  /** Update pointer state */
  public setPointer(x: number, y: number, velX: number, velY: number) {
    this._uniforms.mouse.value.set(x, y);
    this._uniforms.velocity.value.set(velX, velY);
  }

  /** Initialize velocity pass material */
  private _initVelocityPass() {
    const u = this._uniforms;
    const { uAspectRatio, uBlocks } = this._props;
    const velocitySampler = this._velocityPass.sampler;
    const ratio = vec2(uAspectRatio, 1);
    const fpsScale = u.deltaTime.mul(60 / 1000);

    const grid = vec2(uAspectRatio.mul(uBlocks), uBlocks);
    const cell = floor(screenUV.mul(grid));
    const cellUV = cell.add(0.5).div(grid);

    const localUV = cellUV.mul(ratio);
    const localMouse = u.mouse.mul(ratio);
    const dist = distance(localUV, localMouse);
    const mask = exp(negate(dist).div(u.radius));
    const color = vec2(u.velocity.x, u.velocity.y);
    const splat = color.mul(mask);

    const base = texture(velocitySampler, cellUV).rg;

    const decayFactor = exp(negate(u.decay).mul(fpsScale));
    const mixed = base.mul(decayFactor);

    const outputVelocity = add(mixed, splat);

    this._velocityPass.material.fragmentNode = vec4(outputVelocity, 0, 1);
  }

  /** Render scene with substepping */
  public render(renderer: WebGPURenderer) {
    const u = this._uniforms;
    const now = performance.now();

    if (this._lastTime === undefined) {
      this._lastTime = now;
      u.deltaTime.value = FLOW_FIXED_MS;

      return;
    }

    const rawDtMs = now - this._lastTime;
    this._lastTime = now;

    const frameDtMs = Number.isFinite(rawDtMs)
      ? Math.min(Math.max(rawDtMs, 0), 100)
      : FLOW_FIXED_MS;

    this._accumMs += frameDtMs;

    let steps = 0;
    while (this._accumMs >= FLOW_FIXED_MS && steps < FLOW_MAX_SUBSTEPS) {
      u.deltaTime.value = FLOW_FIXED_MS;
      this._render(renderer);
      this._accumMs -= FLOW_FIXED_MS;
      steps += 1;
    }

    if (steps === FLOW_MAX_SUBSTEPS) {
      this._accumMs = 0;
    }
  }

  private _render(renderer: WebGPURenderer) {
    this._quad.material = this._velocityPass.material;
    this._velocityPass.render(renderer, this._quad.scene, this._camera);
  }

  public destroy() {
    this._velocityPass.destroy();
    this._quad.destroy();
  }
}
