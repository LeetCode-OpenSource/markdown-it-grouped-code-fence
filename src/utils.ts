import Token from 'markdown-it/lib/token';
import { Nesting, TokenObject, TokenInfo, Attrs } from './types';

const GROUP_SCOPE_REGEX = / \[([^\[\]]*)]/; // group can not be language, so there have a space before `group`
const LANGUAGE_REGEX = /^[^ ]+/;

export const filterTokenInfo = (info: string): TokenInfo => {
  const scopeResult = GROUP_SCOPE_REGEX.exec(info);
  const languageResult = LANGUAGE_REGEX.exec(info);

  const scope = scopeResult && (scopeResult[1] || '');
  const language = (languageResult && languageResult[0]) || '';

  return { scope, language };
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

export const getID = (function() {
  let id = 0;

  return () => {
    id += 1;
    return id;
  };
})();
