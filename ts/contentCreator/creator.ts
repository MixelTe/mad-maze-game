import { appendTo, Button, Div, Label, TextArea } from "./functions.js";

export class Creator
{
	private readonly options: CreatorOptions;
	private readonly level: number = 0;
	private readonly remove: () => void = () => null;
	private readonly input = TextArea();
	private readonly titleEl = Label();
	private readonly body = Div("creator-body");
	private readonly creatorsDiv = Div("creators");
	private readonly colapseButton = Button("button-colapse", "-", this.colapse.bind(this));
	private readonly creators: Creator[] = [];
	private colapsed = false;

	constructor(options: CreatorOptions, parent?: Creator)
	{
		this.options = options;
		if (parent)
		{
			this.level = parent.level + 1;
			this.remove = parent.removeChild.bind(parent, this);
		}
		this.creatorsDiv.classList.add(`creators-level${this.level}`);
		this.body.setAttribute("creator-level", `${this.level}`);
		const id = `colapse_${Math.random()}`;
		this.input = TextArea(options.placeholder);
		this.input.addEventListener("click", () => this.input.classList.remove("emptyfield"));
		this.titleEl = Label("text", options.title, id);
		if (options.collapsible)
		{
			this.colapseButton.id = id;
			appendTo(this.body, [
				Div("creator-titlediv", [
					this.colapseButton,
					this.titleEl,
				]),
			]);
		}
		else
		{
			appendTo(this.body, [
				Div("creator-titlediv", [
					this.titleEl,
				]),
			]);
		}
		const subBody = Div("creator-subBody");
		this.body.appendChild(subBody);
		appendTo(subBody, [
			Div("sub-text", options.hint),
		]);
		if (this.level > 0)
		{
			appendTo(subBody, [
				Div("creator-removeDiv", [
					Button("creator-button-remove", "Удалить", this.remove),
				]),
			]);
		}
		appendTo(subBody, [
			Div("creator-input", [this.input]),
		]);
		if (options.child != null)
		{
			appendTo(subBody, [
				Div("text", options.subTitle),
				Div("sub-text", options.subTitleHint),
				Button("creator-button-add", "Добавить " + options.addText, this.addChild.bind(this, true)),
				this.creatorsDiv,
				Div("creator-botton-add", [
					Button("creator-button-add", "Добавить " + options.addText.toLowerCase(), this.addChild.bind(this, false)),
				]),
			]);
			this.addChild();
		}
	}
	public getData()
	{
		const subData: CreatorData[] = [];
		this.creators.forEach(creator => subData.push(creator.getData()));
		const data: CreatorData = { value: this.input.value, subData };
		return data;
	}
	public checkData()
	{
		if (this.input.value == "")
		{
			if (this.colapsed) this.colapse();
			this.input.scrollIntoView({ behavior: "smooth", block: "center" });
			setTimeout(() =>
			{
				this.input.scrollIntoView({ behavior: "smooth", block: "center" });
			}, 50);
			this.input.classList.add("emptyfield");
			return false;
		}
		if (this.creators.length == 0) return true;
		for (let i = 0; i < this.creators.length; i++)
		{
			const creator = this.creators[i];
			const res = creator.checkData();
			if (!res)
			{
				if (this.colapsed) this.colapse();
				return false;
			}
		}
		return true;
	}
	protected addChild(toTop = false)
	{
		if (this.options.child)
		{
			const child = new Creator(this.options.child, this);
			if (toTop) this.creatorsDiv.prepend(child.body);
			else this.creatorsDiv.appendChild(child.body);
			this.creators.push(child);
			return child;
		}
		return null;
	}
	private removeChild(creator: Creator)
	{
		if (this.creators.length > 1)
		{
			this.creatorsDiv.removeChild(creator.body);
			const i = this.creators.indexOf(creator);
			if (i >= 0) this.creators.splice(i, 1);
		}
	}
	private colapse()
	{
		this.colapsed = !this.colapsed;
		if (this.colapsed)
		{
			this.colapseButton.innerText = "+";
			this.body.classList.add("creator-colapsed");
			this.titleEl.innerText = this.input.value || this.options.placeholder;
		}
		else
		{
			this.colapseButton.innerText = "-";
			this.body.classList.remove("creator-colapsed");
			this.titleEl.innerText = this.options.title;
		}
	}
	public setValue(value: string)
	{
		this.input.value = value;
	}
	public createChild()
	{
		return this.addChild();
	}
	public getChild(index: number)
	{
		if (this.creators.length > index) return this.creators[index];
		return undefined;
	}
	public getBody()
	{
		return this.body;
	}
}

export interface CreatorData
{
	value: string,
	subData: CreatorData[]
}
export interface CreatorOptions
{
	title: string,
	hint: string,
	placeholder: string,
	subTitle: string,
	subTitleHint: string,
	addText: string,
	collapsible: boolean,
	child: CreatorOptions | null,
}