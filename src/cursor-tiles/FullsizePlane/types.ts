import { UniformNode } from 'three/webgpu';

import { Webgl } from '../webgl';

export type TProps = {
  webgl: Webgl;
  src: string;
  uBlocks: UniformNode<'float', number>;
};
