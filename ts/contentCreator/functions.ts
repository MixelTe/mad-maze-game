export function Div(classes: string | string[] = [], childrenOrText: Element[] | string = [], text: string = "")
{
	const div = document.createElement("div");
	if (typeof classes == "string") div.classList.add(classes);
	else classes.forEach(cls => div.classList.add(cls));
	div.innerText = text;
	if (typeof childrenOrText == "string") div.innerText = childrenOrText;
	else childrenOrText.forEach(child => div.appendChild(child));
	return div;
}
export function Button(classes: string | string[] = [], text: string = "", onclick: (this: HTMLButtonElement) => void = () => {})
{
	const button = document.createElement("button");
	if (typeof classes == "string") button.classList.add(classes);
	else classes.forEach(cls => button.classList.add(cls));
	button.innerText = text;
	button.addEventListener("click", onclick);
	return button;
}
