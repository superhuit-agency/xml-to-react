# XML-to-React

Converts an XML document into a React tree.

> ℹ️ Fork of the unmaintained Conde Nast implementation to support React 18, upgrade dependencies and convert to Typescript.

[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat)](LICENSE)

## Prerequisites

 This library may only be used in projects using React version 18 or greater.

## Installation

```sh
npm install --save @superhuit/xml-to-react
```

This assumes you are using [npm](https://www.npmjs.com/) as your package manager.

## Usage

```js
import XMLToReact from '@superhuit/xml-to-react';

const xmlToReact = new XMLToReact({/* converters */});
const reactTree = xmlToReact.convert(/* XML string */);
```

### Simple Example

Convert XML nodes into DOM elements with any provided attributes

```js
import ReactDOM from 'react-dom';
import XMLToReact from '@superhuit/xml-to-react';
import MyListItem from './MyListItem';

const xmlToReact = new XMLToReact({
  Example: (attrs) => ({ type: 'ul', props: attrs }),
  Item: (attrs) => ({ type: MyListItem, props: attrs })
});

const reactTree = xmlToReact.convert(`
  <Example name="simple">
    <Item i="1">one</Item>
    <Item>two</Item>
    <Item>three</Item>
  </Example>
`);

ReactDOM.render('app-container', reactTree);
```

```jsx
export default function MyListItem({ children, i }) {
  return <li data-i={i}>{children}</li>;
}
```

This example would render the following:

```html
<div id="app-container">
  <ul name="simple">
    <li data-i="1">one</li>
    <li>two</li>
    <li>three</li>
  </ul>
</div>
```

### Converters

Converters are required mapping functions that define how an XML node should be converted to React. A converter must return an object in the format `{ type, [props] }`, which is intended to be passed to [`React.createElement`](https://reactjs.org/docs/react-api.html#createelement).

- `type` - required tagName, React component, or React fragment
- `props` - (optional) props object

#### Example

```js
function myConverter(attributes) {
  return {
    type: 'div',
    props: {
      className: 'test'
    }
  }
}
```

### `XMLToReact` constructor

The `XMLToReact` class is instantiated with a map of converters.

```js
{
  nodeName: converterFunction
}
```

### `convert( xml, data )`

- `xml` `{string}` - xml node or document
- `data` `{Object}` - (optional) any data to be passed to all converters

## Prior Art

* [jsonmltoreact](https://github.com/diffcunha/jsonmltoreact) demonstrated this technique using JsonML, and serves as motivation for this project.

## Thanks

* [xml-to-react](https://github.com/CondeNast/xml-to-react).
* [xmldom](https://github.com/jindw/xmldom) for providing a solid XML parser.
* [Rollup](https://github.com/rollup/rollup) for simple and quick module bundling.
* [React](https://github.com/facebook/react) for the innovation.

## Contributors

See the list of [contributors](https://github.com/superhuit-agency/xml-to-react/contributors) who participated in writing this library.
## Maintainers

 * Daniel Taveras (@taveras)
