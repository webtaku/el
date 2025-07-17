function el(selector = 'div', ...children) {
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
    for (const child of children) {
        if (child instanceof HTMLElement)
            el.appendChild(child);
        else if (typeof child === 'string')
            el.appendChild(document.createTextNode(child));
        else {
            const attrs = child;
            for (const [key, value] of Object.entries(attrs)) {
                if (key === 'style' && typeof value === 'object') {
                    Object.assign(el.style, value);
                }
                else if (key === 'class') {
                    el.classList.add(...value.split(/\s+/));
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
    return el;
}
export { el };
//# sourceMappingURL=index.js.map