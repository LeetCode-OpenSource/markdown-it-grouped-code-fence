import Token = require('markdown-it/lib/token');

import { Nesting, TokenObject, TokenInfo, Attrs } from './types';

const GROUP_REGEX = / \[([^\[\]]*)]/; // group can not be language, so there have a space before `group`
const LANGUAGE_REGEX = /^[^ ]+/;

function filterGroupResult(
  info: string,
): { scope: string | null; title: string | null } {
  const regexResult = GROUP_REGEX.exec(info);

  if (regexResult) {
    const [scope, title] = (regexResult[1] || '').split('-');
    return { scope, title };
  } else {
    return {
      scope: null,
      title: null,
    };
  }
}

export const filterTokenInfo = (info: string): TokenInfo => {
  const languageResult = LANGUAGE_REGEX.exec(info);
  const language = (languageResult && languageResult[0]) || '';

  const { scope, title } = filterGroupResult(info);

  return { scope, title: title || language };
};

export function makeToken({ type, tag, nesting, ...restValue }: TokenObject) {
  return Object.assign(new Token(type, tag, nesting), restValue);
}

export function makeNestedToken({
  token,
  nestLevel,
}: {
  token: Token;
  nestLevel: number;
}) {
  return Object.assign(Object.create(Token.prototype), token, {
    level: token.level + nestLevel,
  });
}

export function tokenMaker(defaultTokenValue: TokenObject) {
  return (tokenValue: Partial<TokenObject>) =>
    makeToken({ ...defaultTokenValue, ...tokenValue });
}

export function getInputID(groupID: number, listCount: number) {
  return `group-${groupID}-${listCount}`;
}

export function getInputName(groupID: number) {
  return `group-${groupID}`;
}

export function makeRadioToken({
  level,
  attrs: { id, name, className, checked },
}: {
  level: number;
  attrs: { id: string; name: string; className: string; checked?: boolean };
}) {
  const attrs: Attrs = [
    ['type', 'radio'],
    ['style', 'display: none;'],
    ['class', className],
    ['id', id],
    ['name', name],
  ];

  if (checked) {
    attrs.push(['checked', '']);
  }

  return makeToken({
    level,
    attrs,
    type: 'radio_input',
    tag: 'input',
    nesting: Nesting.selfClose,
  });
}

export function makeLabelTokens({
  inputID,
  inputName,
  labelText,
  level,
  radioClassName,
  isCheckedByDefault,
}: {
  inputID: string;
  inputName: string;
  labelText: string;
  level: number;
  radioClassName: string;
  isCheckedByDefault?: boolean;
}): Token[] {
  return [
    makeRadioToken({
      level,
      attrs: {
        id: `label-${inputID}`,
        name: `label-${inputName}`,
        className: radioClassName,
        checked: isCheckedByDefault,
      },
    }),
    makeToken({
      type: 'label_item_open',
      tag: 'label',
      nesting: Nesting.open,
      level,
      attrs: [
        ['for', inputID],
        ['onclick', 'this.previousElementSibling.click()'],
      ],
    }),
    makeToken({
      type: 'text',
      tag: '',
      nesting: Nesting.selfClose,
      content: labelText,
      level: level + 1,
    }),
    makeToken({
      type: 'label_item_close',
      tag: 'label',
      level,
      nesting: Nesting.close,
    }),
  ];
}
