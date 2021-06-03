import { appendTo, Button, Div, Label, TextArea } from "./functions.js";

export class Creator
{
	protected title = "Введите текст:";
	protected subTitle = "Например: Это текст, или Отличный текст";
	protected placeholder = "Текст";
	protected subCreator = "Добавте ещё под-текст:";
	protected subCreatorTitle = "Например: Это под-текст, или Отличный под-текст";
	protected collapsible = false;
	protected lastEl = true;
	protected childClass = Creator;

	private level = 0;
	private remove: (creator: Creator) => void = (creator: Creator) => null;
	private input = TextArea();
	private titleEl = Label();
	private body = Div("creator-body");
	private creatorsDiv = Div("creators");
	private colapseButton = Button("button-colapse", "-", this.colapse.bind(this));
	private creators: Creator[] = [];

	private colapsed = false;

	public init(parent?: Creator)
	{
		if (parent)
		{
			this.level = parent.level + 1;
			this.remove = parent.removeChild;
		}
		this.creatorsDiv.classList.add(`creators-level${this.level}`);
		this.body.setAttribute("creator-level", `${this.level}`);
		const id = `colapse_${Math.random()}`;
		this.input = TextArea(this.placeholder);
		this.input.addEventListener("click", () => this.input.classList.remove("emptyfield"));
		this.titleEl = Label("text", this.title, id);
		if (this.collapsible)
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
			Div("sub-text", this.subTitle),
			Div("creator-input", [this.input]),
		]);
		if (this.level > 0)
		{
			appendTo(subBody, [
				Button("creator-button-remove", "Удалить", this.remove.bind(this, this)),
			]);
		}
		if (this.subCreator != "")
		{
			appendTo(subBody, [
				Div("text", this.subCreator),
				Div("sub-text", this.subCreatorTitle),
				Button("creator-button-add", "Добавить " + this.placeholder.toLowerCase(), this.addChild.bind(this, true)),
				this.creatorsDiv,
				Div("creator-botton-add", [
					Button("creator-button-add", "Добавить " + this.placeholder.toLowerCase(), this.addChild.bind(this, false)),
				]),
			]);
		}
		if (!this.lastEl) this.addChild();
		return this.body;
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
		const child = new this.childClass();
		child.init(this);
		if (toTop) this.creatorsDiv.prepend(child.body);
		else this.creatorsDiv.appendChild(child.body);
		this.creators.push(child);
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
			this.titleEl.innerText = this.input.value || this.placeholder;
		}
		else
		{
			this.colapseButton.innerText = "-";
			this.body.classList.remove("creator-colapsed");
			this.titleEl.innerText = this.title;
		}
	}
	public setValue(value: string)
	{
		this.input.value = value;
	}
	public appendChild(child: Creator)
	{
		this.creatorsDiv.appendChild(child.body);
		this.creators.push(child);
	}
	public getChild(index: number)
	{
		if (this.creators.length > index) return this.creators[index];
		return undefined;
	}
}

export interface CreatorData
{
	value: string,
	subData: CreatorData[]
}