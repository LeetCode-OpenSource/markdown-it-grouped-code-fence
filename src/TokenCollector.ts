import Token = require('markdown-it/lib/token');

import { List } from './List';
import {
  getID,
  getInputID,
  getInputName,
  makeNestedToken,
  makeRadioToken,
  tokenMaker,
} from './utils';
import { Config, Nesting, TOKEN_TYPE } from './types';

const makeOpenToken = tokenMaker({
  type: TOKEN_TYPE,
  tag: 'div',
  nesting: Nesting.open,
});

const makeCloseToken = tokenMaker({
  type: TOKEN_TYPE,
  tag: 'div',
  nesting: Nesting.close,
});

export class TokenCollector {
  private tokens: Token[] = [];

  private currentGroupID: number = -1;

  private currentGroupIndex: number = -1;

  private list: List | null = null;

  private get isGroupClosed() {
    const isGroupClosed = this.currentGroupIndex === -1 || this.list === null;

    if (
      isGroupClosed &&
      (this.currentGroupIndex !== -1 || this.list !== null)
    ) {
      throw new Error(
        'if Group is closed, currentGroupIndex must be `-1` and list must be `null`.',
      );
    }

    return isGroupClosed;
  }

  constructor(private readonly config: Config) {}

  addToken(token: Token) {
    this.tokens.push(token);
  }

  addTokenIntoCurrentGroup(
    token: Token,
    title: string,
    closeGroupAfterAddingToken: boolean,
  ) {
    if (this.isGroupClosed) {
      throw new Error('Current is no Group exist.');
    }

    const inputID = getInputID(this.currentGroupID, this.list!.count);
    const inputName = getInputName(this.currentGroupID);

    const fenceRadioToken = makeRadioToken({
      level: token.level + 1,
      attrs: {
        id: getInputID(this.currentGroupID, this.list!.count),
        name: getInputName(this.currentGroupID),
        checked: this.list!.isEmptyList,
        className: this.config.className.fenceRadio,
      },
    });

    const fenceToken = makeNestedToken({ token, nestLevel: 1 });

    this.list!.add({ title, inputID, inputName });
    this.tokens.push(fenceRadioToken, fenceToken);

    if (closeGroupAfterAddingToken) {
      this.closeCurrentGroup(token.level);
    }
  }

  startNewGroup(level: number, closePreviousBeforeStartANewOne: boolean) {
    if (closePreviousBeforeStartANewOne) {
      this.closeCurrentGroup(level);
    }

    if (!this.isGroupClosed) {
      throw new Error(
        'Start a new Group before close the previous one is invalid',
      );
    }

    this.currentGroupID = getID();
    this.currentGroupIndex = this.tokens.length;

    this.list = new List(this.config.className, level + 1);
    this.tokens.push(
      makeOpenToken({
        level,
        attrs: [['class', this.config.className.container]],
      }),
    );
  }

  closeCurrentGroup(level: number) {
    if (this.isGroupClosed) {
      throw new Error('Closing a non-existing Group is invalid.');
    }

    this.tokens.splice(this.currentGroupIndex + 1, 0, ...this.list!.tokens);

    this.list = null;
    this.currentGroupIndex = -1;
    this.tokens.push(makeCloseToken({ level }));
  }

  getTokens(): Token[] {
    if (this.isGroupClosed) {
      return this.tokens.slice(0);
    } else {
      throw new Error(
        'You can not get the tokens, because current Group is not closed.',
      );
    }
  }
}
