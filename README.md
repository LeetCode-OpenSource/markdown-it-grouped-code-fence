# markdown-it-grouped-code-fence

_Grouped code fence_ is almost the same as [code fence](https://spec.commonmark.org/0.28/#code-fence). The only difference is that you can use a syntax, __`keyword-title` within a pair of brackets__ , in the [info string](https://spec.commonmark.org/0.28/#info-string) to combine multiple code fence into a single group. In a Markdown renderer that does not support this syntax, will ignore the syntax and render it as a normal code fence.


## Syntax
~~~
```language [keyword-title]
```
~~~

#### `keyword`
Optional, Used to distinguish between different groups. default will consider as a anonymous group.

#### `title`
Optional, Used to customize the title of each code fence. default will using the language name.


## Examples
Go to [Playground](https://leetcode-opensource.github.io/markdown-it-grouped-code-fence/) to see the output.

### Use keywords to distinguish between different groups
~~~
```ruby [printA]
  puts 'A'
```

```python [printA-python3]
  print('A')
```

```javascript [printB]
  console.log('B')
```
~~~

##### output:
```ruby [printA]
  puts 'A'
```

```python [printA-python3]
  print('A')
```

```javascript [printB]
  console.log('B')
```


### Anonymous group
~~~
```ruby []
  put 'Hello world!'
```

```python [-python3]
  print('Hello world!')
```

```javascript []
  console.log('Hello world!')
```
~~~

##### output:
```ruby []
  put 'Hello world!'
```

```python [-python3]
  print('Hello world!')
```

```javascript []
  console.log('Hello world!')
```


## Installation

Using [yarn](https://yarnpkg.com/):
```bash
yarn add markdown-it-grouped-code-fence
```

Or via [npm](https://docs.npmjs.com):
```bash
npm install markdown-it-grouped-code-fence
```

Then, to enable the feature:

```javascript
import MarkdownIt from 'markdown-it';
import { groupedCodeFencePlugin } from 'markdown-it-grouped-code-fence';

const md = new MarkdownIt();

md.use(
  groupedCodeFencePlugin({
    className: {
      container: 'class name here',
      navigationBar: 'class name here',
      fenceRadio: 'class name here',
      labelRadio: 'class name here',
    },
  }),
);
```
