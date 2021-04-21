export function emptyElement(elem) {
    while (elem.lastChild) {
        elem.lastChild.remove();
    }
}

export function addElement(addTo, type, className, content) {
    const elem = document.createElement(type);
    elem.className = className;
    elem.textContent = content;

    addTo.appendChild(elem);

    return elem;
}