type CustomTag = `${string}-${string}`;
type Tag = '' | keyof HTMLElementTagNameMap | CustomTag;
type Selector = Tag | `${Tag}#${string}` | `${Tag}.${string}` | `${Tag}#${string}.${string}`;
type ElementByTag<T extends Tag | string> = (T extends '' ? HTMLDivElement : (T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : HTMLElement));
type ElementBySelector<S extends Selector> = (S extends '' ? HTMLDivElement : (S extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[S] : (S extends `${infer T}#${string}` ? ElementByTag<T> : (S extends `${infer T}.${string}` ? ElementByTag<T> : HTMLElement))));
type ElementProps<S extends Selector> = Partial<Omit<ElementBySelector<S>, 'style'>> & {
    style?: Partial<CSSStyleDeclaration>;
    class?: string;
};
declare function el<S extends Selector>(selector?: S, ...args: (HTMLElement | string | ElementProps<S> | undefined)[]): ElementBySelector<S>;
export { el };
//# sourceMappingURL=index.d.ts.map