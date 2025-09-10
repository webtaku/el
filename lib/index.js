function el(selector = '', ...args) {
    const parts = selector.split(/([#.])/);
    const tag = parts[0] || 'div';
    const el = document.createElement(tag);
    // id/class from selector
    for (let i = 1; i < parts.length; i += 2) {
        const type = parts[i];
        const value = parts[i + 1];
        if (!value)
            continue;
        if (type === '#')
            el.id = value;
        else if (type === '.')
            el.classList.add(value);
    }
    const toCamel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
    const fragment = document.createDocumentFragment();
    for (const arg of args) {
        if (arg instanceof HTMLElement) {
            fragment.appendChild(arg);
            continue;
        }
        if (typeof arg === 'string') {
            const lines = arg.split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (i > 0)
                    fragment.appendChild(document.createElement('br'));
                const line = lines[i];
                if (line)
                    fragment.appendChild(document.createTextNode(line));
            }
            continue;
        }
        if (!arg)
            continue;
        const attrs = arg;
        for (const key in attrs) {
            if (!Object.prototype.hasOwnProperty.call(attrs, key))
                continue;
            const value = attrs[key];
            if (value == null)
                continue;
            // style: object or string
            if (key === 'style') {
                if (typeof value === 'string') {
                    const css = value.trim();
                    if (css) {
                        // add a semicolon if needed when appending
                        const hasExisting = el.style.cssText.trim().length > 0;
                        if (hasExisting && !css.startsWith(';')) {
                            el.style.cssText += ';';
                        }
                        el.style.cssText += css;
                    }
                }
                else if (typeof value === 'object') {
                    Object.assign(el.style, value);
                }
                continue;
            }
            // dataset object
            if (key === 'dataset' && typeof value === 'object') {
                for (const dk in value) {
                    const dv = value[dk];
                    if (dv == null)
                        continue;
                    el.dataset[toCamel(dk)] = String(dv);
                }
                continue;
            }
            if (key === 'id') {
                el.id = value;
                continue;
            }
            // class / className
            if (key === 'class' || key === 'className') {
                const classNames = String(value).split(/\s+/);
                for (const cn of classNames)
                    if (cn)
                        el.classList.add(cn);
                continue;
            }
            // direct data-* mapping (attribute + dataset)
            if (key.startsWith('data-')) {
                const dsKey = toCamel(key.slice(5));
                el.dataset[dsKey] = String(value);
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
                el[key] = value;
                continue;
            }
            // Fallback: set as an attribute
            el.setAttribute(key, String(value));
        }
    }
    el.appendChild(fragment);
    return el;
}
export { el };
//# sourceMappingURL=index.js.map