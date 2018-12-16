import React from 'react';
import ReactDOM from 'react-dom';
import { Container } from 'react-simple-resizer';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import MD from 'markdown-it';
import 'codemirror/mode/markdown/markdown.js';

import { groupedCodeFencePlugin } from '../src';
import { Editor, Section, Bar, MarkDown, GroupClassName } from './styled';
import README from '../README.md';

const md = new MD();

md.use(
  groupedCodeFencePlugin({
    className: GroupClassName,
  }),
);

interface State {
  value: string;
}

class Edit extends React.PureComponent<{}, State> {
  state: State = {
    value: README,
  };

  render() {
    return (
      <Container>
        <Section minSize={300}>
          <Editor>
            <CodeMirror
              options={{
                mode: 'text/x-markdown',
                theme: 'dracula',
                autoCloseBrackets: true,
                styleActiveLine: true,
                foldGutter: true,
                lineNumbers: true,
                lineWrapping: true,
                indentWithTabs: false,
              }}
              value={README}
              onChange={this.onChange}
            />
          </Editor>
        </Section>
        <Bar size={0} expandInteractiveArea={{ left: 10, right: 10 }} />
        <Section minSize={300}>
          <MarkDown
            dangerouslySetInnerHTML={{ __html: md.render(this.state.value) }}
          />
        </Section>
      </Container>
    );
  }

  private onChange = (_: any, __: any, value: string) => {
    this.setState({ value });
  };
}

ReactDOM.render(<Edit />, document.getElementById('app'));
