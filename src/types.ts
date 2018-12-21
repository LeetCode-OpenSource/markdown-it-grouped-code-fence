import Token = require('markdown-it/lib/token');

export const RULE_NAME = 'GROUPED_CODE_FENCE';
export const TOKEN_TYPE = `${RULE_NAME}_TYPE`;

export enum Nesting {
  open = 1,
  close = -1,
  selfClose = 0,
}

export type Attrs = [string, string][]; // [ [ name, value ] ]

export type TokenObject = {
  [K in keyof Token]?: Token[K] extends Function ? never : Token[K]
} & {
  type: string;
  tag: string;
  nesting: Nesting;
  attrs?: Attrs;
};

export interface TokenInfo {
  scope: string | null;
  title: string;
}

export interface Config {
  className: {
    container: string;
    navigationBar: string;
    labelRadio: string;
    fenceRadio: string;
  };
}
