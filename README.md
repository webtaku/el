# @webtaku/el

A small, type-safe utility for creating **DOM elements** with a concise API in TypeScript.

## Features

* Type-safe `Selector` syntax (`div#id.class`)
* Create **HTMLElement** instances
* Supports DOM properties, attributes, and inline styles
* Simple and composable API

## Installation

```bash
yarn add @webtaku/el
```

or

```bash
npm install @webtaku/el
```

## API

### `el<S extends Selector>(selector?: S, ...args): ElementBySelector<S>`

Creates a **DOM element**.

#### Parameters

* `selector` (optional): A string selector such as `div`, `span#my-id`, `p.my-class`, `section#id.class`. Defaults to `div`.
* `...args`:

  * `HTMLElement` — appended as a child node
  * `string` — added as a text node
  * `ElementProps<S>` — sets properties, attributes, or styles

#### Returns

A type-safe `HTMLElement` instance.

## Example

```ts
import { el } from '@webtaku/el';

const button = el('button#myBtn.primary', 
  'Click me',
  { onclick: () => alert('Clicked!'), style: { color: 'red' } }
);

document.body.appendChild(button);
```

## Selector Syntax

| Selector String       | Output                             |
| --------------------- | ---------------------------------- |
| `''`                  | `<div>`                            |
| `'span'`              | `<span>`                           |
| `'div#app'`           | `<div id="app">`                   |
| `'p.text'`            | `<p class="text">`                 |
| `'section#main.hero'` | `<section id="main" class="hero">` |

## ElementProps

An object that specifies properties, attributes, or styles for the element.

```ts
{
  href?: string;
  style?: Partial<CSSStyleDeclaration>;
  [prop: string]: any;
}
```

## Example

```ts
document.body.appendChild(
  el('div#container.box', 
    el('h1', 'Hello World'),
    el('p', 'This is a paragraph.', { style: { color: 'blue' } })
  )
);
```

## License

MIT OR Apache-2.0

## Contributing

Contributions are welcome. Feel free to open issues or submit pull requests to improve the library.
