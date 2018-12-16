import Token from 'markdown-it/lib/token';

import { Config, Nesting } from './types';
import { makeLabelTokens, makeToken, tokenMaker } from './utils';

export class List {
  private readonly listChildLevel = this.level + 2;

  private readonly listLevel = this.level + 1;

  private readonly openToken = makeToken({
    type: 'bullet_list_open',
    tag: 'ul',
    nesting: Nesting.open,
    level: this.level,
    attrs: [['class', this.className.navigationBar]],
  });

  private readonly closeToken = makeToken({
    type: 'bullet_list_close',
    tag: 'ul',
    nesting: Nesting.close,
    level: this.level,
  });

  private readonly makeListToken = tokenMaker({
    type: 'list_item',
    nesting: Nesting.selfClose,
    tag: 'li',
    level: this.listLevel,
  });

  private readonly listTokens: Token[] = [];

  get isEmptyList() {
    return this.count === 0;
  }

  get count() {
    return this.listTokens.length;
  }

  constructor(
    private readonly className: Config['className'],
    private readonly level: number,
  ) {}

  add({
    inputID,
    inputName,
    title,
  }: {
    title: string;
    inputID: string;
    inputName: string;
  }) {
    this.listTokens.push(
      this.makeListToken({ nesting: Nesting.open }),
      ...makeLabelTokens({
        inputID,
        inputName,
        labelText: title,
        level: this.listChildLevel,
        radioClassName: this.className.labelRadio,
        isCheckedByDefault: this.isEmptyList,
      }),
      this.makeListToken({ nesting: Nesting.close }),
    );
  }

  get tokens() {
    return [this.openToken, ...this.listTokens, this.closeToken];
  }
}
