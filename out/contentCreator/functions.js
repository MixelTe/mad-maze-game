export function Div(classes = [], childrenOrText = [], text = "") {
    const div = document.createElement("div");
    if (typeof classes == "string")
        div.classList.add(classes);
    else
        classes.forEach(cls => div.classList.add(cls));
    div.innerText = text;
    if (typeof childrenOrText == "string")
        div.innerText = childrenOrText;
    else
        childrenOrText.forEach(child => div.appendChild(child));
    return div;
}
export function Span(classes = [], childrenOrText = [], text = "") {
    const span = document.createElement("span");
    if (typeof classes == "string")
        span.classList.add(classes);
    else
        classes.forEach(cls => span.classList.add(cls));
    span.innerText = text;
    if (typeof childrenOrText == "string")
        span.innerText = childrenOrText;
    else
        childrenOrText.forEach(child => span.appendChild(child));
    return span;
}
export function Label(classes = [], text = "", htmlFor = "") {
    const label = document.createElement("label");
    if (typeof classes == "string")
        label.classList.add(classes);
    else
        classes.forEach(cls => label.classList.add(cls));
    label.innerText = text;
    label.htmlFor = htmlFor;
    return label;
}
export function Button(classes = [], text = "", onclick = () => { }) {
    const button = document.createElement("button");
    if (typeof classes == "string")
        button.classList.add(classes);
    else
        classes.forEach(cls => button.classList.add(cls));
    button.innerText = text;
    button.addEventListener("click", onclick.bind(button, button));
    return button;
}
export function appendTo(el, newEls) {
    newEls.forEach(nel => el.appendChild(nel));
}
export function TextArea(placeholder = "", classes = []) {
    const textarea = document.createElement("textarea");
    if (typeof classes == "string")
        textarea.classList.add(classes);
    else
        classes.forEach(cls => textarea.classList.add(cls));
    textarea.placeholder = placeholder;
    function autoResize() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }
    textarea.addEventListener('input', autoResize);
    textarea.spellcheck = true;
    return textarea;
}
export function capitalize(text) {
    return text.slice(0, 1).toUpperCase() + text.slice(1);
}
export function copyText(text) {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}
