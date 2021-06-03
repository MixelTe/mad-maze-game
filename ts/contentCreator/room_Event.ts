import { Creator } from "./creator.js";

export class Room_Event extends Creator
{
	protected title = "Введите событие:";
	protected subTitle = "Например: В этой комнате крокодил! или По середине стоит стол, на нём лежит молоток";
	protected placeholder = "Событие";
	protected subCreator = "Добавьте возможные действия:";
	protected subCreatorTitle = "Например: Погладить крокодила или Взять молоток";

	constructor()
	{
		super(() => null, Action, 0);
		this.addChild();
	}
}
class Action extends Creator
{
	protected title = "Введите действие:";
	protected subTitle = "";
	protected placeholder = "Действие";
	protected subCreator = "Добавьте возможные результаты действия:";
	protected subCreatorTitle = "Например: Крокодил уснул и вы спокойно прошли мимо или Вы уронили молоток на ногу, теперь вы хромаете";
	protected collapsible = true;

	constructor(remove: (creator: Creator) => void, childClass: typeof Creator, level: number)
	{
		super(remove, Result, level);
		this.addChild();
	}
}
class Result extends Creator
{
	protected title = "";
	protected subTitle = "";
	protected placeholder = "Результат действия";
	protected subCreator = "";
	protected subCreatorTitle = "";
}