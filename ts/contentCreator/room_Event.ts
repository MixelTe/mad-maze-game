import { Creator, CreatorData, CreatorOptions } from "./creator.js";
import { SendData, Sender } from "./sender.js";

export const Room_Event: CreatorOptions = {
	title: "Введите событие:",
	hint: "Например: В этой комнате крокодил! или Посередине стоит стол, на нём лежит молоток",
	placeholder: "Событие",
	subTitle: "Добавьте возможные действия:",
	subTitleHint: "Например: Погладить крокодила или Взять молоток",
	addText: "действие",
	collapsible: false,
	child: {
		title: "Введите действие:",
		hint: "",
		placeholder: "Действие",
		subTitle: "Добавьте возможные результаты действия:",
		subTitleHint: "Например: Крокодил уснул и вы спокойно прошли мимо или Вы уронили молоток на ногу, теперь вы хромаете",
		addText: "результат действия",
		collapsible: true,
		childrenCount: 2,
		child: {
			title: "",
			hint: "",
			placeholder: "Результат действия",
			subTitle: "",
			subTitleHint: "",
			addText: "",
			collapsible: false,
			child: null,
		},
	},
};
export function restoreData(body: HTMLDivElement)
{
	const data = localStorage.getItem("contentCreatorData");
	if (data != null)
	{
		try
		{
			const creator = createEmptyCreator(body);
			applyData(creator, data);
			return creator;
		}
		catch (er)
		{
			console.error("Data load failed: ", er);
		}
	}
	return createEmptyCreator(body);
}
export function applyData(creator: Creator, data: string, trySendData = false, sender?: Sender)
{
	if (trySendData)
	{
		const parsedData = <SendData>JSON.parse(data);
		if (parsedData.author != undefined)
		{
			setData(creator, sendDataToCreatorData(parsedData));
			if (sender) sender.setData(parsedData.author);
		}
		else
		{
			const parsedData2 = <CreatorData><any>parsedData;
			setData(creator, parsedData2);
		}
	}
	else
	{
		const parsedData = <CreatorData>JSON.parse(data);
		setData(creator, parsedData);
	}
}
function sendDataToCreatorData(data: SendData)
{
	const actions: CreatorData[] = [];
	for (let i = 0; i < data.data.actions.length; i++)
	{
		const el = data.data.actions[i];
		const results: CreatorData[] = [];
		for (let j = 0; j < el.results.length; j++)
		{
			results.push({ value: el.results[j], subData: [] });
		}
		actions.push({ value: el.text, subData: results });
	}
	return { value: data.data.text, subData: actions };
}
function setData(creator: Creator, data: CreatorData)
{
	creator.setValue(data.value);
	if (data.subData.length > 0)
	{
		for (let i = 0; i < data.subData.length; i++)
		{
			const subData = data.subData[i];
			const child = creator.getChild(i);
			if (child)
			{
				setData(child, subData);
			}
			else
			{
				const subCreator = creator.createChild();
				if (subCreator) setData(subCreator, subData);
			}
		}
	}
}
export function createEmptyCreator(body: HTMLDivElement)
{
	body.innerHTML = "";
	const creator = new Creator(Room_Event);
	body.appendChild(creator.getBody());
	return creator;
}