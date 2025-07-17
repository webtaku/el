type Tag = '' | keyof HTMLElementTagNameMap;

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

type ElementProps<S extends Selector> =
  & Partial<Omit<ElementBySelector<S>, 'style'>>
  & { style?: Partial<CSSStyleDeclaration> };

function el<S extends Selector>(
  selector: S = 'div' as S,
  ...children: (HTMLElement | string | ElementProps<S>)[]
): ElementBySelector<S> {
  const parts = selector.split(/([#.])/);
  const tag = parts[0] || 'div';
  const el = document.createElement(tag);

  for (let i = 1; i < parts.length; i += 2) {
    const type = parts[i] as '#' | '.';
    const value = parts[i + 1];
    if (!value) continue;
    if (type === '#') el.id = value;
    else if (type === '.') el.classList.add(value);
  }

  for (const child of children) {
    if (child instanceof HTMLElement) el.appendChild(child);
    else if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else {
      const attrs = child as ElementProps<S>;
      for (const [key, value] of Object.entries(attrs)) {
        if (key === 'style' && typeof value === 'object') {
          Object.assign(el.style, value);
        } else if (key === 'class') {
          el.classList.add(...(value as string).split(/\s+/));
        } else if (key in el) {
          (el as any)[key] = value;
        } else {
          el.setAttribute(key, String(value));
        }
      }
    }
  }

  return el as ElementBySelector<S>;
}

export { el };
