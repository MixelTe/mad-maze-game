export function randomInt(max: number): number;
export function randomInt(min: number, max: number): number;
export function randomInt(maxmin: number, max?: number)
{
	if (max != undefined)
		return Math.floor(Math.random() * (maxmin - max)) + max;
	return Math.floor(Math.random() * maxmin);
}
export function chooseRandom<T>(array: T[])
{
	return array[randomInt(0, array.length)];
}
export function shuffle<T>(array: T[])
{
	return array.sort(() => 0.5 - Math.random());
}

export function capitalize(text: string)
{
	return text.slice(0, 1).toUpperCase() + text.slice(1);
}

export function copyText(text: string)
{
	const el = document.createElement('textarea');
	el.value = text;
	el.setAttribute('readonly', '');
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	el.style.opacity = '0';
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}

export function openTextFile(accept = "*")
{
	return new Promise<string>((resolve, reject) =>
	{
		const input = document.createElement("input");
		input.type = "file";
		input.accept = accept;

		input.onchange = () =>
		{
			if (!input.files || !input.files[0])
			{
				reject()
				return;
			}
			const file = input.files[0];

			const reader = new FileReader();
			reader.readAsText(file, "UTF-8");
			reader.onload = readerEvent =>
			{
				if (!readerEvent.target)
				{
					reject()
					return;
				}
				const content = readerEvent.target.result;
				resolve(content as string);
			}
			reader.onerror = reject;
		}

		input.click();
	})
}

export function clamp(v: number, min: number, max: number)
{
	return Math.min(Math.max(v, min), max);
}


export function SetContent(parent: HTMLElement, children: ElChildren)
{
	parent.innerHTML = "";
	AppendContent(parent, children);
}
export function AppendContent(parent: HTMLElement, children: ElChildren)
{
	if (children instanceof Array)
		children.forEach(ch => AppendContent(parent, ch));
	else if (children)
		parent.append(children);
}

export function Div(classes?: ElClasses, children?: ElChildren, onCreate?: (el: HTMLDivElement) => void)
{
	return initEl("div", classes, children, onCreate);
}
export function Span(classes?: ElClasses, children?: ElChildren, onCreate?: (el: HTMLSpanElement) => void)
{
	return initEl("span", classes, children, onCreate);
}
export function H1(classes?: ElClasses, children?: ElChildren, onCreate?: (el: HTMLHeadingElement) => void)
{
	return initEl("h1", classes, children, onCreate);
}
export function Table(classes?: ElClasses, children?: ElChildren, onCreate?: (el: HTMLTableElement) => void)
{
	return initEl("table", classes, children, onCreate);
}
export function TR(classes?: ElClasses, children?: ElChildren, onCreate?: (el: HTMLTableRowElement) => void)
{
	return initEl("tr", classes, children, onCreate);
}
export function TD(classes?: ElClasses, children?: ElChildren, onCreate?: (el: HTMLTableCellElement) => void)
{
	return initEl("td", classes, children, onCreate);
}
export function Input(classes?: ElClasses, type?: string, placeholder?: string, onCreate?: (el: HTMLInputElement) => void)
{
	const input = initEl("input", classes, undefined);
	if (type) input.type = type;
	if (placeholder) input.placeholder = placeholder;
	onCreate?.(input);
	return input;
}
export function Button(classes?: ElClasses, children?: ElChildren, clickListener?: (btn: HTMLButtonElement) => void, onCreate?: (el: HTMLButtonElement) => void)
{
	const button = initEl("button", classes, children, onCreate);
	if (clickListener) button.addEventListener("click", clickListener.bind(button, button));
	return button;
}
export function A(classes?: ElClasses, children?: ElChildren, href?: string, clickListener?: (a: HTMLAnchorElement) => void, onCreate?: (el: HTMLAnchorElement) => void)
{
	const a = initEl("a", classes, children, onCreate);
	if (href)
	{
		a.href = href || "";
		a.target = "_blank";
	}
	if (clickListener) a.addEventListener("click", e =>
	{
		e.preventDefault();
		clickListener.bind(a, a)();
	});
	return a;
}

type ElClass = string | undefined | null | false;
export type ElClasses = ElClass[] | ElClass;
export type ElChildren = Node | string | undefined | null | false | ElChildren[];
export function initEl<K extends keyof HTMLElementTagNameMap>(tagName: K, classes?: ElClasses, children?: ElChildren, onCreate?: (el: HTMLElementTagNameMap[K]) => void)
{
	const el = document.createElement(tagName);
	if (classes)
	{
		if (typeof classes == "string") el.classList.add(classes);
		else classes.forEach(cs => cs && el.classList.add(cs));
	}
	if (children)
	{
		function appendChildren(children: ElChildren)
		{
			if (children instanceof Array)
				children.forEach(appendChildren);
			else if (children)
				el.append(children);
		}
		appendChildren(children);
	}
	onCreate?.(el);

	return el;
}

export function createSvgEl<K extends keyof SVGElementTagNameMap>(qualifiedName: K, parent?: Node): SVGElementTagNameMap[K]
{
	const el = document.createElementNS("http://www.w3.org/2000/svg", qualifiedName);
	if (parent)
		parent.appendChild(el);
	return el;
}

export class FetchError extends Error { }
async function fetchWithJson(method: "GET" | "POST" | "DELETE", input: RequestInfo | URL, body?: any)
{
	const res = await fetch(input, {
		method,
		headers: body === undefined ? {} : {
			"Content-Type": "application/json"
		},
		body: body === undefined ? null : JSON.stringify(body),
	});
	if (!res.ok)
		throw new FetchError((await res.json() as { msg: string }).msg)
	return res;
}

export function fetchGet(input: RequestInfo | URL)
{
	return fetchWithJson("GET", input);
}

export function fetchPost(input: RequestInfo | URL, body?: any)
{
	return fetchWithJson("POST", input, body);
}

export function fetchDelete(input: RequestInfo | URL, body?: any)
{
	return fetchWithJson("DELETE", input, body);
}

async function fetchJson<T>(method: "GET" | "POST" | "DELETE", input: RequestInfo | URL, body?: any)
{
	const res = await fetchWithJson(method, input, body);
	const data = await res.json();
	return data as T;
}

export function fetchJsonGet<T>(input: RequestInfo | URL)
{
	return fetchJson<T>("GET", input);
}

export function fetchJsonPost<T>(input: RequestInfo | URL, body?: any)
{
	return fetchJson<T>("POST", input, body);
}

export function fetchJsonDelete<T>(input: RequestInfo | URL, body?: any)
{
	return fetchJson<T>("DELETE", input, body);
}
