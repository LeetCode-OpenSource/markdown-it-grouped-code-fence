import { css } from 'emotion';
import styled from '@emotion/styled';
import {
  Bar as ResizerBar,
  Section as ResizerSection,
} from 'react-simple-resizer';

export const Editor = styled.div({
  fontSize: '16px',

  '.CodeMirror': {
    height: '100%',
  },
});

export const Bar = styled(ResizerBar)({
  zIndex: 1,
});

export const Section = styled(ResizerSection)({
  zIndex: 0,
  height: '100%',
  overflow: 'auto',
});

export const MarkDown = styled.div({
  padding: '20px',
});

export const GroupClassName = {
  container: css({
    margin: '20px',
    border: '1px solid #EEEEEE',
    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.04)',
    borderRadius: '3px',
  }),

  navigationBar: css({
    padding: 0,
    margin: 0,
    userSelect: 'none',
    borderBottom: '1px solid #EEEEEE',
    whiteSpace: 'nowrap',
    width: '100%',
    overflow: 'auto',

    li: {
      display: 'inline',
      lineHeight: '32px',
      padding: '0 10px',
      position: 'relative',

      '~ li::before': {
        content: '""',
        height: '12px',
        width: '1px',
        background: '#EEEEEE',
        position: 'absolute',
        left: '0px',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      },
    },
  }),

  fenceRadio: css({
    display: 'none',

    '&:not(:checked) + pre': {
      display: 'none',
    },
  }),

  labelRadio: css({
    display: 'none',

    ':not(:checked) + label': {
      opacity: 0.5,
    },
  }),
};
