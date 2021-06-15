import { TextGameEngine } from "./TextGameEngine";

export const EventsScripts = new Map<string, (tge: TextGameEngine) => Promise<void>>();
EventsScripts.set("potions", potions);

async function potions(tge: TextGameEngine)
{
	const ingredients = ["Сахар", "Кроличья лапка", "Огненный порошок", "Сверкающий арбуз", "Паучий глаз", "Слеза гаста", "Золотая морковь"];
	const ingredientsAdded = ["Сахар", "Кроличью лапку", "Огненный порошок", "Сверкающий арбуз", "Паучий глаз", "Слезу гаста", "Золотую морковь"];
	const s_glow = "Светящийся порошок";
	const s_red = "Красный порошок";
	const s_eye = "Маринованный паучий глаз";
	const drink = async (res: string) =>
	{
		tge.clear();
		tge.print("Зелье забурлило и на зельеварке зажглась зелёная лампочка");
		tge.print("Вы решили, что это хороший знак и взяли бутылёк с зельем");
		await tge.wait();
		tge.print("Вы залпом выпили зелье и...");
		await tge.wait(2.5);
		tge.print(res, true);
	};
	const potion_slowness = async () =>
	{
		tge.clear();
		tge.print(`Вы добавили ${s_eye}`);
		tge.print("Зелье стало серого цвета", true);
		tge.print("Что вы добавите дальше?");
		const chosen = await tge.choose([s_glow, s_red], false, true);
		switch (chosen) {
			case 0: await drink("Вы попытались сделать шаг... На это у вас ушло 5 минут!"); break;
			case 1: await drink("Вы стали двигаться намного медленней!"); break;
			default: await drink("У вас закружилась голова... и всё"); break;
		}
	}

	tge.print("Перед вами стол, на нём стоит зельеварка и несколько ингредиентов для зелий", true);
	tge.print("Из чего вы сварите зелье?");
	tge.print("Выбирите первый реагент:");
	const chosen = await tge.choose(ingredients, false, true);
	tge.clear();
	tge.print(`Вы добавили ${ingredientsAdded[chosen]}`);
	switch (chosen) {
		case 0:
			tge.print("Зелье приобрело голубоватый оттенок", true);
			tge.print("Что вы добавите дальше?");
			const chosen0 = await tge.choose([s_glow, s_red, s_eye], false, true);
			switch (chosen0) {
				case 0: await drink("Сделав шаг, вы пронеслись через всю комнату с огромной скоростью!"); break;
				case 1: await drink("Вы стали двигаться намного быстрее!"); break;
				case 2: await potion_slowness(); break;
				default: await drink("У вас закружилась голова... и всё"); break;
			}
			break;
		case 1:
			tge.print("Зелье приобрело яркий зелёный цвет", true);
			tge.print("Что вы добавите дальше?");
			const chosen1 = await tge.choose([s_glow, s_red, s_eye], false, true);
			switch (chosen1) {
				case 0: await drink("Вы почувствовали легкость во всём теле и прыгнули... Теперь у вас болит голова от столкновения с потолком"); break;
				case 1: await drink("Вы стали прыгать намного выше!"); break;
				case 2: await potion_slowness(); break;
				default: await drink("У вас закружилась голова... и всё"); break;
			}
			break;
		case 2:
			tge.print("Зелье стало бордового цвета", true);
			tge.print("Что вы добавите дальше?");
			const chosen2 = await tge.choose([s_glow, s_red], false, true);
			switch (chosen2) {
				case 0: await drink("Вы почувствовали небывалую силу и ударили стену... В ней теперь дыра"); break;
				case 1: await drink("Вы почувствовали, что ваш рюкзак стал легче, странно..."); break;
				default: await drink("У вас закружилась голова... и всё"); break;
			}
			break;
		case 3:
			tge.print("Зелье стало ярко-красного цвета", true);
			tge.print("Что вы добавите дальше?");
			const chosen3 = await tge.choose([s_glow, s_eye], false, true);
			switch (chosen3) {
				case 0: await drink("Все ваши раны залечились"); break;
				case 1: await drink("Очнувшись, вы чувствуете себя так, как если бы вас ударили лопатой"); break;
				default: await drink("У вас закружилась голова... и всё"); break;
			}
			break;
		case 4:
			tge.print("Зелье окрасилось в болотный цвет", true);
			tge.print("Что вы добавите дальше?");
			const chosen4 = await tge.choose([s_glow, s_red, s_eye], false, true);
			switch (chosen4) {
				case 0: await drink("Вас стало сильно качать, у вас поднялась температура и вы уснули"); break;
				case 1: await drink("Теперь у вас кружится голова и болит горло"); break;
				case 2: await drink("Очнувшись, вы чувствуете себя так, как если бы вас ударили лопатой"); break;
				default: await drink("У вас закружилась голова... и всё"); break;
			}
			break;
		case 5:
			tge.print("Зелье окрасилось в розовый цвет", true);
			tge.print("Что вы добавите дальше?");
			const chosen5 = await tge.choose([s_glow, s_red], false, true);
			switch (chosen5) {
				case 0: await drink("Вы чувствуете как с каждой секундой вам становится всё лучше и лучше"); break;
				case 1: await drink("Вы заметили, что раны стали потихоньку затягиваться"); break;
				default: await drink("У вас закружилась голова... и всё"); break;
			}
			break;
		case 6:
			tge.print("Зелье стало тёмно-синего цвета");
			tge.print("Что вы добавите дальше?");
			const chosen6 = await tge.choose([s_red, s_eye], false, true);
			switch (chosen6) {
				case 0: await drink("Теперь вы можете разглядеть даже самые тёмне углы комнаты &i^gray^'кто-то включил свет?'"); break;
				case 1: await drink("Вы положили бутылёк обратно на стол. Стоп! А где ваши руки? А вы сами? Вы тут?"); break;
				default: await drink("У вас закружилась голова... и всё"); break;
			}
			break;
		default: await drink("У вас закружилась голова... и всё"); break;
	}
}