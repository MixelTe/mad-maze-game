import { Room_event } from "../events.js";
import { Creator, CreatorData } from "./creator.js";
import { appendTo, Div, TextArea, Span, Button } from "./functions.js";

export class Sender
{
	private readonly mainPage: HTMLDivElement;
	private readonly infDiv: HTMLDivElement;
	private readonly buttonSend: HTMLButtonElement;
	private readonly waitDiv = Div(["popup", "popup-show"]);
	private readonly name = TextArea();
	private readonly comment = TextArea();
	public sent = false;

	constructor(infDiv: HTMLDivElement, buttonSend: HTMLButtonElement)
	{
		this.infDiv = infDiv;
		this.buttonSend = buttonSend;
		buttonSend.innerText = "Отправить";
		infDiv.innerHTML = "";
		this.mainPage = Div([], [
			Div("text", "Введите ваше имя (если хотите):"),
			this.name,
			Div("text", "Сюда можно написать коментарий к событию:"),
			this.comment,
		]);
		infDiv.appendChild(this.mainPage);
		this.waitDiv.appendChild(this.createSpinner());
	}

	public async send(creator: Creator)
	{
		if (this.sent) return;
		const data: sendData = {
			author: {
				name: this.name.value,
				comment: this.comment.value,
			},
			data: this.getData(creator),
		}
		// console.log(data);
		this.showWait();
		const json = JSON.stringify(data);
		let r;
		try
		{
			r = await fetch("URL_OF_SERVER", {
				method: "POST",
				headers: {
					"Content-Type": "text/json",
				},
				body: json,
			});
			if (!r.ok)
			{
				throw new Error(`service api call failed (text) status: ${r.status}`);
			}
			this.showOnSentPage();
		}
		catch {
			this.showOnErrorPage(json);
		}
		finally
		{
			this.hideWait();
		}
	}
	private showWait()
	{
		document.body.appendChild(this.waitDiv);
	}
	private hideWait()
	{
		document.body.removeChild(this.waitDiv);
	}
	private getData(creator: Creator)
	{
		const creatorData = creator.getData();
		const data: Room_event = {
			type: "text",
			event: creatorData.value,
			actions: this.convertToAction(creatorData.subData),
		}
		return data;
	}
	private convertToAction(data: CreatorData[])
	{
		const converted = [];
		for (let i = 0; i < data.length; i++) {
			const el = data[i];
			const results = [];
			for (let j = 0; j < el.subData.length; j++) {
				const el2 = el.subData[j];
				results.push(el2.value);
			}
			converted.push({ action: el.value, results });
		}
		return converted;
	}
	private showOnErrorPage(data: string)
	{
		this.infDiv.innerHTML = "";
		const a = document.createElement("a");
		a.innerText = "Отправить через github";
		a.href = this.createLinkToIssue(data);
		a.target = "_blank";
		appendTo(this.infDiv, [
			Div("text", "К сожалению не удалось отправить данные на сервер :("),
			Div(["text", "marginTop"], [
				Span([], "Можете попробовать ещё раз или самостоятельно отправить данные автору: "),
				Button(["sender-copybutton"], "Копировать данные", this.copyData.bind(this, data)),
			]),
			Div(["text", "marginTop"], [
				a,
				Span([], " достаточно будет нажать только зелёную кнопку"),
			])
		]);
		this.buttonSend.innerText = "Отправить ещё раз";
	}
	private showOnSentPage()
	{
		this.infDiv.innerHTML = "";
		appendTo(this.infDiv, [
			Div("text", "Новое событие отправленно!"),
			Div(["text", "marginTop"], "Возможно оно будет добавленно в следующей версии игры"),
		]);
		this.sent = true;
		this.buttonSend.innerText = "Создать ещё одно событие";
	}
	private createLinkToIssue(data: string)
	{
		const mainLink = "https://github.com/MixelTe/mad-maze-game/issues/new";
		const title = encodeURIComponent("New event for game");
		const text = encodeURIComponent(data);
		const link = `${mainLink}?title=${title}&body=${text}`;
		return link;
	}
	private copyData(data: string)
	{
		const el = document.createElement('textarea');
		el.value = data;
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	}
	private createSpinner()
	{
		const parts = 13;
		const spinner = Div("spinner");
		const angleStep = 360 / parts;
		const delayStep = 1 / parts;
		for (let i = 0; i < 13; i++)
		{
			const subpart = Div();
			const part = Div([], [subpart]);
			spinner.appendChild(part);
			part.style.transform = `rotate(${angleStep * i}deg) translateX(var(--trx--))`;
			subpart.style.animationDelay = `${delayStep * i}s`;
		}
		return spinner;
	}
	public onPopupClose()
	{
		this.buttonSend.innerText = "Отправить";
		this.infDiv.innerHTML = "";
		this.infDiv.appendChild(this.mainPage);
	}
}
interface sendData
{
	author: {
		name: string,
		comment: string,
	},
	data: Room_event,
}