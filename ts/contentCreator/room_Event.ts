import { Creator, CreatorData, CreatorOptions } from "./creator.js";

export const Room_Event: CreatorOptions = {
	title: "Введите событие:",
	hint: "Например: В этой комнате крокодил! или По середине стоит стол, на нём лежит молоток",
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
			const parsedData = <CreatorData>JSON.parse(data);
			const creator = new Creator(Room_Event);
			body.appendChild(creator.getBody());
			setData(creator, parsedData);
			return creator;
		}
		catch (er)
		{
			console.error("Data load failed: ", er);
		}
	}
	body.innerHTML = "";
	const creator = new Creator(Room_Event);
	body.appendChild(creator.getBody());
	return creator;
}
export function setData(creator: Creator, data: CreatorData)
{
	creator.setValue(data.value);
	if (data.subData.length > 0)
	{
		for (let i = 0; i < data.subData.length; i++) {
			const subData = data.subData[i];
			if (i == 0)
			{
				const child = creator.getChild(0);
				if (child)
				{
					setData(child, subData);
					continue;
				}
			}
			const subCreator = creator.createChild();
			if (subCreator) setData(subCreator, subData);
		}
	}
}