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
function html(selector = 'div', ...children) {
    const parts = selector.split(/([#.])/);
    const tag = parts[0] || 'div';
    let id = '';
    const classes = [];
    const attrs = {};
    let style = '';
    for (let i = 1; i < parts.length; i += 2) {
        const type = parts[i];
        const value = parts[i + 1];
        if (!value)
            continue;
        if (type === '#')
            id = value;
        else if (type === '.')
            classes.push(value);
    }
    const innerHTML = [];
    for (const child of children) {
        if (child instanceof HTMLElement) {
            innerHTML.push(child.outerHTML);
        }
        else if (typeof child === 'string') {
            innerHTML.push(child);
        }
        else {
            const props = child;
            for (const [key, value] of Object.entries(props)) {
                if (key === 'style' && typeof value === 'object') {
                    style = Object.entries(value)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join('; ');
                }
                else if (key === 'class') {
                    classes.push(...value.split(/\s+/));
                }
                else {
                    attrs[key] = String(value);
                }
            }
        }
    }
    let attrString = '';
    if (id)
        attrString += ` id="${id}"`;
    if (classes.length)
        attrString += ` class="${classes.join(' ')}"`;
    if (style)
        attrString += ` style="${style}"`;
    for (const [k, v] of Object.entries(attrs)) {
        if (k === 'id' || k === 'class' || k === 'style')
            continue; // 이미 처리
        attrString += ` ${k}="${v}"`;
    }
    return `<${tag}${attrString}>${innerHTML.join('')}</${tag}>`;
}
export { el, html };
//# sourceMappingURL=index.js.map