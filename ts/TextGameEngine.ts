const version = "1.3.1";
/** Engine for text games*/
export class TextGameEngine
{
	private linesHolder: HTMLDivElement = Div("TextGameEngine-lines");
	private waitDiv: HTMLDivElement = Div("TextGameEngine-wait");
	private mainDiv: HTMLDivElement = Div("TextGameEngine-window");
	private infDiv: HTMLDivElement = Div();
	private popup: HTMLDivElement = Div();
	private styles = new TextStyles();
	private lines: Line[] = [];
	private tapToCon = "Tap here to continue";

	/**
	 * Creates all elements
	 * @param appendToBody append main HTMLDivElement to body
	 * @returns Main HTMLDivElement of game
	 */
	public init(titles = new Titles(), appendToBody = true): HTMLDivElement
	{
		log("TextGameEngine: init");
		this.tapToCon = titles.tapToCon;
		const themeDiv = Div("TextGameEngine-theme");
		this.mainDiv = Div("TextGameEngine-window", [
			Div("TextGameEngine-main", [
				Div("TextGameEngine-header", [
					this.createInfEl(),
					Div("TextGameEngine-title", [this.styles.style(titles.title)]),
					themeDiv,
				]),
				Div("TextGameEngine-console", [
					this.linesHolder,
				]),
				this.waitDiv,
			]),
			this.createPopup(titles),
		]);
		themeDiv.appendChild(this.createThemeSwitch());
		for (let i = 0; i < 3; i++) this.waitDiv.appendChild(Div("TextGameEngine-wait-bubble"));

		if (appendToBody) document.body.appendChild(this.mainDiv);
		return this.mainDiv;
	}
	private createThemeSwitch()
	{
		const label = document.createElement("label");
		label.classList.add("TextGameEngine-switch");
		const input = document.createElement("input");
		input.type = "checkbox"
		const span = document.createElement("span");
		span.classList.add("TextGameEngine-slider");
		label.appendChild(input);
		label.appendChild(span);
		let nightTheme = localStorage.getItem("nightTheme") != "true";
		const setTheme = () =>
		{
			input.checked = nightTheme;
			nightTheme = !nightTheme;
			if (nightTheme)
			{
				localStorage.setItem("nightTheme", "true");
				this.mainDiv.classList.remove("theme-light");
				this.mainDiv.classList.add("theme-dark");
			}
			else
			{
				localStorage.setItem("nightTheme", "false");
				this.mainDiv.classList.add("theme-light");
				this.mainDiv.classList.remove("theme-dark");
			}
		}
		input.addEventListener("change", setTheme);
		setTheme();
		return label;
	}
	private createSourceCodeEl()
	{
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		svg.appendChild(path);
		svg.setAttribute("viewBox", "0 0 16 16");
		path.setAttribute("d", "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z");
		svg.classList.add("TextGameEngine-sourceCode");
		svg.addEventListener("click", () =>
		{
			open("https://github.com/MixelTe/TextGameEngine", "_blank");
		});
		return svg;
	}
	private createInfEl()
	{
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
		const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		svg.appendChild(path1);
		svg.appendChild(path2);
		svg.appendChild(circle);
		svg.setAttribute("viewBox", "0 0 512 512");
		path1.setAttribute("d", "M256,0C114.497,0,0,114.507,0,256c0,141.503,114.507,256,256,256c141.503,0,256-114.507,256-256 C512,114.497,397.492,0,256,0z M256,472c-119.393,0-216-96.615-216-216c0-119.393,96.615-216,216-216 c119.393,0,216,96.615,216,216C472,375.393,375.384,472,256,472z");
		path2.setAttribute("d", "M256,214.33c-11.046,0-20,8.954-20,20v128.793c0,11.046,8.954,20,20,20s20-8.955,20-20.001V234.33 C276,223.284,267.046,214.33,256,214.33z");
		circle.setAttribute("cx", "256");
		circle.setAttribute("cy", "162.84");
		circle.setAttribute("r", "27");
		svg.classList.add("TextGameEngine-inf");
		svg.addEventListener("click", this.openInf.bind(this));
		return svg;
	}
	private createPopup(titles: Titles)
	{
		const close = Div("TextGameEngine-popup-close", [], "×");
		this.popup = Div("TextGameEngine-popup", [
			Div("TextGameEngine-popup-container", [
				Div("TextGameEngine-popup-title", [this.styles.style(titles.title)]),
				Div("TextGameEngine-popup-version", [this.styles.style(titles.version)]),
				Div("TextGameEngine-popup-inf", [
					this.infDiv,
				]),
				Div("TextGameEngine-popup-engine", [
					this.createSourceCodeEl(),
					Div([], [], `Text Game Engine: version ${version}`),
				]),
				close,
			]),
		]);
		close.addEventListener("click", this.closeInf.bind(this));
		this.popup.addEventListener("click", (e) =>
		{
			if (e.target == this.popup) this.closeInf();
		});
		window.addEventListener("keyup", (e) =>
		{
			if (e.key == "Escape") this.closeInf();
		});

		return this.popup;
	}
	/**Open information pop-up*/
	public openInf()
	{
		this.popup.classList.add("TextGameEngine-popup-show");
	}
	private closeInf()
	{
		this.popup.classList.remove("TextGameEngine-popup-show");
	}
	/**
	 * HTMLDivElement where you can add any information
	 */
	public getInfDiv()
	{
		return this.infDiv;
	}
	/**
	 * Set styles that wil be used with &digit or ^number^
	 * @param useStyles Set to false to disable text formating
	 */
	public setStyles(styles: string[], useStyles = true)
	{
		this.styles.setStyles(styles);
		this.styles.useStyles = useStyles;
	}
	/**
	 * Print text to console
	 * @param newParagraph Add space after previous text
	 */
	public print(text: string = "", newParagraph = false)
	{
		log("TextGameEngine: print:", text, "newParagraph:", newParagraph);
		const line = new LineText(text, newParagraph, this.styles);
		this.addLine(line);
	}
	/**
	 * Ask player for a number
	 * @param min Min number, null - no limit
	 * @param max Max number, null - no limit
	 * @param useChoose Use choose if there are less then 16 int options
	 */
	public async num(min: number | null = null, max: number | null = null, useChoose = true)
	{
		if (useChoose && typeof max == "number" && typeof min == "number" && max - min < 16)
		{
			min = Math.ceil(min);
			max = Math.floor(max);
			log("TextGameEngine: num (select)", "min:", min, "max:", max);
			const options = [];
			for (let i = min; i <= max; i++) options.push(i);
			const line = new LineChoose(options, false, true, this.styles);
			this.addLine(line);
			const result = await line.ask();
			return options[result];
		}
		else
		{
			log("TextGameEngine: num: min:", min, "max:", max);
			const line = new LineGetNum(min, max);
			this.addLine(line);
			const result = await line.ask();
			return result;
		}
	}
	/**
	 * Ask player for a text
	 * @param min Min text length
	 * @param max Max text length, -1 - no limit
	 */
	public async text(min = 0, max = -1, allowSpaces = true, trimSpaces = true)
	{
		log("TextGameEngine: text: max:", max, "min:", min, "trimSpaces:", trimSpaces, "allowSpaces:", allowSpaces);
		const line = new LineGetText(min, max, trimSpaces, allowSpaces);
		this.addLine(line);
		const result = await line.ask();
		return result;
	}
	/**
	 * Ask the player to choose one of the options
	 * @param removeNotChosen Remove not chosen options after choice
	 * @returns Index of chosen option
	 */
	public async choose(options: string[], everyAtNewLine = false, removeNotChosen = false)
	{
		log("TextGameEngine: choose: newLine:", everyAtNewLine, "options:", options);
		const line = new LineChoose(options, everyAtNewLine, removeNotChosen, this.styles);
		this.addLine(line);
		const result = await line.ask();
		return result;
	}
	/**
	 * @param seconds Seconds to wait, -1 - until player tap continue button
	 */
	public async wait(seconds = -1)
	{
		if (seconds < 0)
		{
			log("TextGameEngine: wait-inf");
			await this.choose([this.tapToCon]);
			this.clear(1);
			log("TextGameEngine: wait-inf-%cresolve%c", "color:lime", "");
		}
		else if (seconds > 0)
		{
			log(`TextGameEngine: wait - %c${seconds}%csec`, "color:#9881f6", "");
			this.waitDiv.classList.add("TextGameEngine-wait-time");
			let promiseResolve: () => void;
			const onTime = () =>
			{
				this.waitDiv.classList.remove("TextGameEngine-wait-time");
				log(`TextGameEngine: wait - %c${seconds}%csec-%cresolve%c`, "color:#9881f6", "", "color:lime", "");
				promiseResolve();
			}
			return new Promise<void>((resolve, reject) =>
			{
				promiseResolve = resolve;
				setTimeout(onTime, seconds * 1000);
			});
		}
	}
	/**
	 * @param lineCount Line count to remove, -1 to remove all lines
	 */
	public clear(lineCount = -1)
	{
		const count = lineCount >= 0 ? lineCount : this.lines.length;
		log(`TextGameEngine: clear - %c${count}%c (%c${lineCount}%c)`, "color:#9881f6", "", "color:#9881f6", "");
		for (let i = 0; i < count; i++) {
			const line = this.lines.pop();
			if (line == undefined)
			{
				log(`TextGameEngine: clear - %cUnexpected break!%c`, "color: red", "");
				break;
			}

			line.rejectPromise();
			this.linesHolder.removeChild(line.mainEl);
		}
	}

	private addLine(line: Line)
	{
		this.linesHolder.appendChild(line.mainEl);
		this.lines.push(line);
		this.linesHolder.parentElement?.scroll(0, this.linesHolder.clientHeight);
		line.focus();
	}
}

/**
 * All texts used in TextGameEngine
 */
export class Titles
{
	/**
	 * All texts used in TextGameEngine
	 *
	 * @param titles Titles in order: title, tapToCon, version
	 */
	constructor(...titles: string[])
	{
		const len = titles.length;
		if (len > 0) this.title = titles[0];
		if (len > 1) this.tapToCon = titles[1];
		if (len > 2) this.version = titles[2];
	}

	/**Title of game*/
	public title = "Text Game Engine";
	/**Text "Tap here to continue" when called TextGameEngine.wait with -1*/
	public tapToCon = "Tap here to continue";
	/**Game version, displayed in information pop-up.*/
	public version = `Version: ${version}`;
}

class Line
{
	public mainEl: HTMLDivElement = Div("TextGameEngine-line");
	private resolve: ((result: any) => void) | undefined = undefined;
	private reject: ((reason?: any) => void) | undefined = undefined;
	public focus() { };

	public ask(): Promise<any>
	{
		return <Promise<any>>this.createPromise();
	}
	public rejectPromise()
	{
		if (this.reject != null && this.resolve != null)
        {
            this.reject("TextGameEngine: Line removed before resolve");
            this.reject = undefined;
            this.resolve = undefined;
        }
	}
	protected setPromiseResult(result: any)
	{
		if (this.resolve != null)
        {
			log(`Line (${Object.getPrototypeOf(this).constructor.name}): setPromiseResult:`, result);
            this.resolve(result);
            this.reject = undefined;
            this.resolve = undefined;
		}
		else
		{
			log(`Line (${Object.getPrototypeOf(this).constructor.name}): %cUnexpected setPromiseResult!%c`, "color: red", "");
		}
	}
	protected createPromise()
	{
        return new Promise<any>((resolve, reject) =>
        {
            this.resolve = resolve;
            this.reject = reject;
        });
	}
}
class LineText extends Line
{
	constructor(text: string, newParagraph: boolean, styles: TextStyles)
	{
		super();
		const className = newParagraph ? "TextGameEngine-line-text-margin" : "TextGameEngine-line-text";
		this.mainEl.appendChild(Div(className, [styles.style(text)]));
	}
}
class LineGetNum extends Line
{
	constructor(min: number | null, max: number | null)
	{
		super();
		const input = document.createElement("input");
		const okButton = document.createElement("button");
		const errorDiv = Div("TextGameEngine-line-error");
		this.mainEl.appendChild(Div([], [
			Div("TextGameEngine-line-arrowIn"), input, okButton, errorDiv,
		]));
		input.type = "number";
		input.classList.add("TextGameEngine-line-input");
		okButton.classList.add("TextGameEngine-line-okButton");
		okButton.innerText = "OK";

		this.focus = () => { input.focus(); };
		input.addEventListener("keyup", (e) =>
		{
			if (e.key == "Enter") okButton.click();
		});
		okButton.addEventListener("click", () =>
		{
			if (isNaN(input.valueAsNumber))
			{
				errorDiv.innerText = "";
				input.focus();
				return;
			}
			if (min != null && input.valueAsNumber < min)
			{
				errorDiv.innerText = `${input.valueAsNumber} < ${min}`;
				input.focus();
				return;
			}
			if (max != null && input.valueAsNumber > max)
			{
				errorDiv.innerText = `${input.valueAsNumber} > ${max}`;
				input.focus();
				return;
			}
			input.disabled = true;
			errorDiv.innerText = "";
			this.setPromiseResult(input.valueAsNumber);
		});
	}

	public ask(): Promise<number>
	{
		return <Promise<number>>this.createPromise();
	}
}
class LineGetText extends Line
{
	constructor(min: number, max: number, trimSpaces: boolean, allowSpaces: boolean)
	{
		super();
		const input = document.createElement("input");
		const okButton = document.createElement("button");
		const errorDiv = Div("TextGameEngine-line-error");
		this.mainEl.appendChild(Div([], [
			Div("TextGameEngine-line-arrowIn"), input, okButton, errorDiv,
		]));
		input.spellcheck = false;
		input.classList.add("TextGameEngine-line-input");
		okButton.classList.add("TextGameEngine-line-okButton");
		okButton.innerText = "OK";

		this.focus = () => { input.focus(); };
		input.addEventListener("input", () =>
		{
			if (!allowSpaces) input.value = input.value.replaceAll(" ", "");
			if (max > 0) input.value = input.value.substring(0, max + 1);
		});
		input.addEventListener("change", () =>
		{
			if (trimSpaces) input.value = input.value.trim();
		});
		input.addEventListener("keyup", (e) =>
		{
			if (e.key == "Enter") okButton.click();
		});
		okButton.addEventListener("click", () =>
		{
			if (input.value.length < min)
			{
				errorDiv.innerText = `${input.value.length} < ${min}`;
				input.focus();
				return;
			}
			input.disabled = true;
			errorDiv.innerText = "";
			this.setPromiseResult(input.value);
		});
	}

	public ask(): Promise<string>
	{
		return <Promise<string>>this.createPromise();
	}
}
class LineChoose extends Line
{
	constructor(options: (string | number)[], newLine: boolean, removeNotChosen: boolean, styles: TextStyles)
	{
		super();
		const optionsDiv = Div("TextGameEngine-line-choose");
		const optionEls: HTMLElement[] = [];
		let chosen = false;
		for (let i = 0; i < options.length; i++) {
			const option = options[i];
			const optionEl = Div("TextGameEngine-line-option", [styles.style(`${option}`)]);
			optionEls.push(optionEl);
			if (newLine) optionEls.push(Div("TextGameEngine-line-break"));
			optionEl.addEventListener("click", () =>
			{
				if (chosen) return;
				chosen = true;
				optionEls.forEach(el =>
				{
					if (el != optionEl)
					{
						el.classList.add("TextGameEngine-line-option-disabled");
						if (removeNotChosen) optionsDiv.removeChild(el);
					}
				});
				optionEl.classList.add("TextGameEngine-line-option-chosen");
				if (removeNotChosen) optionEl.style.flex = "0 0 auto";
				this.setPromiseResult(i);
			});
		}
		optionEls.forEach(el => optionsDiv.appendChild(el));
		this.mainEl.appendChild(optionsDiv);
	}

	public ask(): Promise<number>
	{
		return <Promise<number>>this.createPromise();
	}
}

class TextStyles
{
	public useStyles = true;
	public styles: StyledText[] = [];

	public style(text: string)
	{
		const mainDiv = Div();
		if (!this.useStyles)
		{
			mainDiv.innerText = text;
			return mainDiv;
		}
		const splited = this.splitText(text);
		const els = this.createHtml(splited);

		els.forEach(el => mainDiv.appendChild(el));
		return mainDiv;
	}
	public removeFormatting(text: string)
	{
		const splited = this.splitText(text);
		let clearText = "";
		splited.forEach(part => clearText += part.text);
		return clearText;
	}
	public setStyles(styles: string[])
	{
		for (let i = 0; i < styles.length; i++) {
			const style = styles[i];
			const textStyle = new StyledText();
			let color = "";
			let colorNow = false;
			for (let j = 0; j < style.length; j++) {
				const ch = style[j];
				if (colorNow)
				{
					if (ch == "'") colorNow = false;
					else color += ch;
				}
				else
				{
					if (ch == "'") colorNow = true;
					else
					{
						if (ch == "i") textStyle.italic = true;
						else if (ch == "b") textStyle.bold = true;
						else if (ch == "u") textStyle.underline = true;
						else if (ch == "c") textStyle.clearPrev = true;
						else log(`TextStyles-setStyles: %cunexpected symbol: ${ch}`, "color: red");
					}
				}
			}
			textStyle.color = color;
			this.styles[i] = textStyle;
		}
	}
	private splitText(text: string)
	{
		const spSymbol = "&";
		const spSymbol2 = "^";
		const result: StyledText[] = [];
		let styles = new StyledText();
		let textPart = "";
		let spSymb = false;
		let spSymb2 = false;
		let spText = "";
		let escapeCh = false;
		let link = 0;
		let linkText = ["", ""];
		let returnPoint = -1;
		const addPart = (text: string) =>
		{
			const part = styles.copy();
			part.text = text;
			result.push(part);
		}
		const applyStyle = (styleI: number) =>
		{
			const newStyles = this.styles[styleI];
			if (newStyles != undefined)
			{
				if (newStyles.clearPrev) styles = this.styles[styleI];
				else
				{
					styles.bold = styles.bold || newStyles.bold;
					styles.italic = styles.italic || newStyles.italic;
					styles.underline = styles.underline || newStyles.underline;
					if (newStyles.color != "") styles.color = newStyles.color;
				}
			}
		}
		for (let i = 0; i < text.length; i++) {
			const ch = text[i];
			if (spSymb)
			{
				const num = parseInt(ch, 10);
				if (textPart != "") addPart(textPart);
				textPart = "";
				if (ch == "i") styles.italic = true;
				else if (ch == "b") styles.bold = true;
				else if (ch == "u") styles.underline = true;
				else if (ch == "c") styles = new StyledText();
				else if (!isNaN(num)) applyStyle(num);
				else { textPart += spSymbol; i -= 1; };
				spSymb = false;
			}
			else if (spSymb2)
			{
				if (ch == spSymbol2 && spText.length == 0)
				{
					i -= 1;
					spSymb2 = false;
				}
				if (escapeCh)
				{
					spText += ch;
					escapeCh = false;
					continue
				}
				if (ch == "\\") escapeCh = true;
				else if (ch == spSymbol2)
				{
					if (textPart != "") addPart(textPart);
					textPart = "";
					const num = parseInt(spText, 10);
					if (!isNaN(num)) applyStyle(num)
					else styles.color = spText;
					spSymb2 = false;
					spText = "";
					returnPoint = -1;
				}
				else
				{
					spText += ch;
				}
			}
			else if (link)
			{
				if (escapeCh)
				{
					linkText[0] += ch;
					escapeCh = false;
					continue
				}
				if (ch == "\\") escapeCh = true;
				else if (link == 1)
				{
					if (ch == ":") link = 2;
					else linkText[0] += ch;
				}
				else if (link == 2)
				{
					if (ch == "]")
					{
						if (textPart != "") addPart(textPart);
						textPart = "";
						styles.link = linkText[1];
						addPart(linkText[0]);
						styles.link = "";
						linkText = ["", ""];
						link = 0;
						returnPoint = -1;
					}
					else linkText[1] += ch;
				}
			}
			else
			{
				if (escapeCh)
				{
					textPart += ch;
					escapeCh = false;
					continue
				}
				if (ch == "\\") escapeCh = true;
				else if (ch == "[") { link = 1; returnPoint = i; }
				else if (ch == spSymbol) spSymb = true;
				else if (ch == spSymbol2) { spSymb2 = true; returnPoint = i; }
				else textPart += ch;
			}
			if (returnPoint != -1 && i == text.length - 1)
			{
				i = returnPoint;
				textPart += text[i];
				returnPoint = -1;
				spSymb = false;
				spSymb2 = false;
				link = 0;
				linkText = ["", ""];
				spText = "";
			}
		}
		if (textPart != "") addPart(textPart);
		return result;
	}
	private createHtml(parts: StyledText[])
	{
		const els: HTMLSpanElement[] = [];

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			if (part.link == "")
			{
				const span = document.createElement("span");
				els.push(span);
				span.innerText = part.text;
				if (part.bold) span.style.fontWeight = "bolder";
				if (part.italic) span.style.fontStyle = "italic";
				if (part.underline) span.style.textDecoration = "underline";
				if (part.color != "") span.style.color = part.color;
			}
			else
			{
				const a = document.createElement("a");
				els.push(a);
				a.innerText = part.text;
				a.href = part.link;
				a.target = "_blank";
				a.title = part.link;
				a.classList.add("TextGameEngine-link");
			}
		}

		return els;
	}
}
class StyledText
{
	public italic = false;
	public bold = false;
	public underline = false;
	public color = "";
	public text = "";
	public clearPrev = false;
	public link = "";

	public copy()
	{
		const newText = new StyledText();
		newText.italic = this.italic;
		newText.bold = this.bold;
		newText.underline = this.underline;
		newText.color = this.color;
		newText.text = this.text;
		newText.link = this.link;
		return newText;
	}
}

function Div(classes: string | string[] = [], children: Element[] = [], text: string = "")
{
	const div = document.createElement("div");
	if (typeof classes == "string") div.classList.add(classes);
	else classes.forEach(cls => div.classList.add(cls));
	div.innerText = text;
	children.forEach(child => div.appendChild(child));
	return div;
}

const DEBUG = false;
function log(...data: any[])
{
	if (DEBUG) console.log(...data);
}