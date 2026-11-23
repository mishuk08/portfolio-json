import { UniformNode, Vector2 } from 'three/webgpu';

export type TUFloat = UniformNode<'float', number>;

export type TFlowSettings = {
  radius: number;
  decay: number;
};

type TUniformsTypeMap = {
  float: UniformNode<'float', number>;
  vec2: UniformNode<'vec2', Vector2>;
};

export type TUniforms = {
  mouse: TUniformsTypeMap['vec2'];
  velocity: TUniformsTypeMap['vec2'];
  deltaTime: TUniformsTypeMap['float'];
} & Record<keyof TFlowSettings, TUniformsTypeMap['float']>;

export interface IFlowProps {
  name: string;
  resolution: number;
  uAspectRatio: TUniformsTypeMap['float'];
  uBlocks: TUniformsTypeMap['float'];
  settings: TFlowSettings;
}
