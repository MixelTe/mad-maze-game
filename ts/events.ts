export interface Room_event
{
	event: string,
	type: "text" | "script",
	actions: Action[],
}
interface Action
{
	action: string,
	results: string[],
}

export const Events: Room_event[] = [
	{ event: "potions", type: "script", actions: [] },
	{ event: "Что-то случилось", type: "text", actions: [{ action: "Топнуть", results: ["Потолок обрушился"] }, { action: "Присесть", results: ["Заиграла музыка"] }] },

];

export const Actions: Action[] = [
	{ action: "Поднять руку", results: ["Вас вызвали к доске"] },

];