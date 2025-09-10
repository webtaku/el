type CustomTag = `${string}-${string}`;
type Tag = '' | keyof HTMLElementTagNameMap | CustomTag;

type Selector =
  | Tag
  | `${Tag}#${string}`
  | `${Tag}.${string}`
  | `${Tag}#${string}.${string}`;

type ElementByTag<T extends Tag | string> = (
  T extends '' ? HTMLDivElement
  : (
    T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T]
    : HTMLElement
  )
);

type ElementBySelector<S extends Selector> = (
  S extends '' ? HTMLDivElement
  : (
    S extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[S]
    : (
      S extends `${infer T}#${string}` ? ElementByTag<T>
      : (
        S extends `${infer T}.${string}` ? ElementByTag<T>
        : HTMLElement
      )
    )
  )
);

// Data / ARIA attribute support
type DataAttributes = { [K in `data-${string}`]?: string | number | boolean | null | undefined };
type AriaAttributes = { [K in `aria-${string}`]?: string | number | boolean | null | undefined };

type ElementProps<S extends Selector> =
  & Partial<Omit<ElementBySelector<S>, 'style'>>
  & {
    // Allow both CSS object and raw cssText string
    style?: Partial<CSSStyleDeclaration> | string;
    class?: string;
    dataset?: Record<string, string | number | boolean | null | undefined>;
    role?: string;
  }
  & DataAttributes
  & AriaAttributes;

function el<S extends Selector>(
  selector: S = '' as S,
  ...args: (HTMLElement | string | ElementProps<S> | null | undefined)[]
): ElementBySelector<S> {
  const parts = selector.split(/([#.])/);
  const tag = parts[0] || 'div';
  const el = document.createElement(tag);

  // id/class from selector
  for (let i = 1; i < parts.length; i += 2) {
    const type = parts[i] as '#' | '.';
    const value = parts[i + 1];
    if (!value) continue;
    if (type === '#') el.id = value;
    else if (type === '.') el.classList.add(value);
  }

  const toCamel = (s: string) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

  const fragment = document.createDocumentFragment();

  for (const arg of args) {
    if (arg instanceof HTMLElement) {
      fragment.appendChild(arg);
      continue;
    }

    if (typeof arg === 'string') {
      const lines = arg.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (i > 0) fragment.appendChild(document.createElement('br'));
        const line = lines[i];
        if (line) fragment.appendChild(document.createTextNode(line));
      }
      continue;
    }

    if (!arg) continue;

    const attrs = arg as ElementProps<S>;
    for (const key in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, key)) continue;
      const value = (attrs as any)[key];
      if (value == null) continue;

      // style: object or string
      if (key === 'style') {
        if (typeof value === 'string') {
          const css = value.trim();
          if (css) {
            // add a semicolon if needed when appending
            const hasExisting = (el as HTMLElement).style.cssText.trim().length > 0;
            if (hasExisting && !css.startsWith(';')) {
              (el as HTMLElement).style.cssText += ';';
            }
            (el as HTMLElement).style.cssText += css;
          }
        } else if (typeof value === 'object') {
          Object.assign((el as HTMLElement).style, value);
        }
        continue;
      }

      // dataset object
      if (key === 'dataset' && typeof value === 'object') {
        for (const dk in value) {
          const dv = (value as any)[dk];
          if (dv == null) continue;
          (el as HTMLElement).dataset[toCamel(dk)] = String(dv);
        }
        continue;
      }

      if (key === 'id') {
        el.id = value as any;
        continue;
      }

      // class / className
      if (key === 'class' || key === 'className') {
        const classNames = String(value).split(/\s+/);
        for (const cn of classNames) if (cn) el.classList.add(cn);
        continue;
      }

      // direct data-* mapping (attribute + dataset)
      if (key.startsWith('data-')) {
        const dsKey = toCamel(key.slice(5));
        (el as HTMLElement).dataset[dsKey] = String(value);
        el.setAttribute(key, String(value));
        continue;
      }

      // aria-* attributes
      if (key.startsWith('aria-')) {
        el.setAttribute(key, String(value));
        continue;
      }

      // If the property exists on the element, set it directly
      if (key in el) {
        (el as any)[key] = value;
        continue;
      }

      // Fallback: set as an attribute
      el.setAttribute(key, String(value));
    }
  }

  el.appendChild(fragment);
  return el as ElementBySelector<S>;
}

export { el };
