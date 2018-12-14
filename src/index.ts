import * as MarkdownIt from 'markdown-it';
import StateCore from 'markdown-it/lib/rules_core/state_core';

import { RULE_NAME, Config } from './types';
import { TokenCollector } from './TokenCollector';
import { filterTokenInfo } from './utils';

function groupedCodeFence(config: Config, state: StateCore) {
  const tokenCollector = new TokenCollector(config);
  const maxIndex = state.tokens.length - 1;
  let prevGroupScope: string | null = null;

  state.tokens.forEach((token, index) => {
    const isEnd = index === maxIndex;
    const { scope: currentGroupScope, language } = filterTokenInfo(token.info);

    if (prevGroupScope === currentGroupScope) {
      const isInCurrentGroup = currentGroupScope !== null;

      if (isInCurrentGroup) {
        tokenCollector.addTokenIntoCurrentGroup(token, language, isEnd);
      } else {
        tokenCollector.addToken(token);
      }
    } else {
      // below condition means that prevGroupScope not equal to null. so previous token must be a Group
      const currentTokenIsNotGroup = currentGroupScope === null;

      if (currentTokenIsNotGroup) {
        tokenCollector.closeCurrentGroup(token.level);
        tokenCollector.addToken(token);
      } else {
        const prevGroupNeedToBeClosed = prevGroupScope !== null;
        tokenCollector.startNewGroup(token.level, prevGroupNeedToBeClosed);
        tokenCollector.addTokenIntoCurrentGroup(token, language, isEnd);
      }
    }

    prevGroupScope = currentGroupScope;
  });

  state.tokens = tokenCollector.getTokens();
}

export function groupedCodeFencePlugin(config: Config) {
  return (md: MarkdownIt) =>
    md.core.ruler.push(RULE_NAME, groupedCodeFence.bind(null, config));
}
