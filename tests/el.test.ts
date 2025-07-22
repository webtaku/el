import { el } from '../src';

// Jest provides jsdom environment by default for TypeScript projects once configured with ts-jest.
// These unit tests verify that the `el` helper correctly parses the selector and constructs the DOM element.

describe('el()', () => {
  it('creates a div element by default', () => {
    const element = el();
    expect(element.tagName).toBe('DIV');
  });

  it('creates the specified tag', () => {
    const element = el('span');
    expect(element.tagName).toBe('SPAN');
  });

  it('assigns an id when # is present', () => {
    const element = el('div#foo');
    expect(element.id).toBe('foo');
  });

  it('assigns multiple classes when .class is present', () => {
    const element = el('div.bar.baz');
    expect(element.classList.contains('bar')).toBe(true);
    expect(element.classList.contains('baz')).toBe(true);
  });

  it('appends children to the created element', () => {
    const child = document.createElement('p');
    const parent = el('div', child);
    expect(parent.children.length).toBe(1);
    expect(parent.firstElementChild).toBe(child);
  });

  it('creates a div by default', () => {
    const element = el('');
    expect(element.tagName).toBe('DIV');
  });

  it('creates specified tag', () => {
    const element = el('span');
    expect(element.tagName).toBe('SPAN');
  });

  it('adds id correctly', () => {
    const element = el('#myid');
    expect(element.id).toBe('myid');
  });

  it('adds classes correctly', () => {
    const element = el('.foo.bar');
    expect(element.classList.contains('foo')).toBe(true);
    expect(element.classList.contains('bar')).toBe(true);
  });

  it('combines tag, id and classes', () => {
    const element = el('section#myid.foo.bar');
    expect(element.tagName).toBe('SECTION');
    expect(element.id).toBe('myid');
    expect(element.classList.contains('foo')).toBe(true);
    expect(element.classList.contains('bar')).toBe(true);
  });

  it('appends children', () => {
    const child1 = document.createElement('p');
    const child2 = document.createElement('span');
    const element = el('div', child1, child2);
    expect(element.children.length).toBe(2);
    expect(element.children[0]).toBe(child1);
    expect(element.children[1]).toBe(child2);
  });

  describe('custom tag', () => {
    it('creates a custom tag element', () => {
      const element = el('my-component');
      expect(element.tagName).toBe('MY-COMPONENT');
    });

    it('creates a custom tag with id and class', () => {
      const element = el('my-widget#custom-id.foo.bar');
      expect(element.tagName).toBe('MY-WIDGET');
      expect(element.id).toBe('custom-id');
      expect(element.classList.contains('foo')).toBe(true);
      expect(element.classList.contains('bar')).toBe(true);
    });
  });

  describe('dataset', () => {
    it('assigns dataset properties correctly', () => {
      const element = el('div', {
        dataset: {
          foo: 'bar',
          answer: '42'
        }
      });

      expect(element.dataset.foo).toBe('bar');
      expect(element.dataset.answer).toBe('42');
    });

    it('assigns dataset together with other attributes', () => {
      const element = el('span#myid.foo', {
        className: 'bar',
        dataset: { hello: 'world' },
        title: 'my title'
      });

      expect(element.id).toBe('myid');
      expect(element.classList.contains('foo')).toBe(true);
      expect(element.dataset.hello).toBe('world');
      expect(element.title).toBe('my title');
    });
  });

  describe('handling \\n in strings', () => {
    it('inserts <br> elements for each \\n in text content', () => {
      const element = el('div', 'hello\nworld\nhere');
      expect(element.childNodes.length).toBe(5);

      expect(element.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
      expect(element.childNodes[0].textContent).toBe('hello');

      expect(element.childNodes[1].nodeName).toBe('BR');

      expect(element.childNodes[2].nodeType).toBe(Node.TEXT_NODE);
      expect(element.childNodes[2].textContent).toBe('world');

      expect(element.childNodes[3].nodeName).toBe('BR');

      expect(element.childNodes[4].nodeType).toBe(Node.TEXT_NODE);
      expect(element.childNodes[4].textContent).toBe('here');
    });

    it('works when \\n is at the start or end', () => {
      const element = el('div', '\nstart\nend\n');
      // childNodes: [BR, text:start, BR, text:end, BR]
      expect(element.childNodes.length).toBe(5);

      expect(element.childNodes[0].nodeName).toBe('BR');
      expect(element.childNodes[1].textContent).toBe('start');
      expect(element.childNodes[2].nodeName).toBe('BR');
      expect(element.childNodes[3].textContent).toBe('end');
      expect(element.childNodes[4].nodeName).toBe('BR');
    });
  });
});
