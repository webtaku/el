function el(selector = '', ...args) {
    const parts = selector.split(/([#.])/);
    const tag = parts[0] || 'div';
    const el = document.createElement(tag);
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
    const fragment = document.createDocumentFragment();
    for (const arg of args) {
        if (arg instanceof HTMLElement) {
            fragment.appendChild(arg);
        }
        else if (typeof arg === 'string') {
            const lines = arg.split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (i > 0)
                    fragment.appendChild(document.createElement('br'));
                const line = lines[i];
                if (line)
                    fragment.appendChild(document.createTextNode(line));
            }
        }
        else if (arg) {
            const attrs = arg;
            for (const key in attrs) {
                if (!Object.prototype.hasOwnProperty.call(attrs, key))
                    continue;
                const value = attrs[key];
                if (key === 'style' && typeof value === 'object') {
                    Object.assign(el.style, value);
                }
                else if (key === 'dataset' && typeof value === 'object') {
                    Object.assign(el.dataset, value);
                }
                else if (key === 'id') {
                    el.id = value;
                }
                else if (key === 'class' || key === 'className') {
                    const classNames = value.split(/\s+/);
                    for (const className of classNames) {
                        if (!className)
                            continue;
                        el.classList.add(className);
                    }
                }
                else if (key in el) {
                    el[key] = value;
                }
                else {
                    el.setAttribute(key, String(value));
                }
            }
        }
    }
    el.appendChild(fragment);
    return el;
}
export { el };
//# sourceMappingURL=index.js.map