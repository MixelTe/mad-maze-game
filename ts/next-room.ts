import { TextGameEngine } from "./TextGameEngine";

export const NextRoom: ((tge: TextGameEngine) => Promise<void>)[] = [
	nxRoom1, nxRoom2, nxRoom3, nxRoom4, nxRoom5, nxRoom6, nxRoom7, nxRoom8,
]
const strongDoor = [
	"Дверь оказалась крепче, чем вы думали",
	"Сколько вы не бились, дверь не поддалась",
	"Вы потратили не мало сил, но безрезультатно",
	"Кажется, дверь подвинулась, нет только кажется",
	'Способность "&bМощный Удар По Двери&c" ещё не восстановлена',
	"Удар головой об дверь не помог",
	"Вас отбросило от двери с той же силой, что вы ударили",
	"На двери осталась небольшая вмятина",
	"Вас ударило током, но дверь всё ещё стоит",
	"Дверь покачнулась и упала, вам так показалось, лёжа на полу",
]

async function nxRoom1(tge: TextGameEngine)
{
	const count = Math.floor(Math.random() * 14) + 2;
	const doors = count >= 5 ? "дверей" : "двери";
	tge.print(`Перед вами ${count} ${doors}`);
	tge.print("В какую вы зайдёте?");
	const chosen = await tge.num(1, count);
	tge.print(`Вы зашли в ${chosen}-ю дверь`);
}
async function nxRoom2(tge: TextGameEngine)
{
	tge.print("В этой комнате две двери");
	tge.print('На одной написано: "Зелёный", а на другой "Корабль"');
	tge.print('В какую вы зайдёте?');
	const doors = ["Зелёный", "Корабль"];
	const i = await tge.choose(doors);
	tge.print(`Вы зашли в дверь с надписью "${doors[i]}"`);
}
async function nxRoom3(tge: TextGameEngine)
{
	tge.print("Перед вами две лестницы: вверх и вниз")
	tge.print("Куда вы пойдёте?")
	await tge.choose(["Вверх", "Вниз"]);
	tge.print("Когда вы прошли пару ступенек, проход за вами закрылся");
}
async function nxRoom4(tge: TextGameEngine)
{
	tge.print("В этой комнате дверь с загадкой:");
	tge.print("&iВ каком слове три буквы 'о'?");
	tge.print("Под загадкой было четыре квадрата для букв");
	const ans = await tge.text(4, 4, false);
	if (ans.toLowerCase() == "трио")
	{
		tge.print("Дверь открылась, и вы прошли дальше");
	}
	else
	{
		tge.print("Дверь не открылась, но вас это не остановило, и вы пошли дальше");
		await tge.wait();
		tge.print("Вы вернулись и, на всякий случай, аккуратно повесили дверь обратно на петли");
	}
}
async function nxRoom5(tge: TextGameEngine)
{
	tge.print("Подойдя к двери вы услышали вопрос:");
	tge.print('- Вам кого?');
	tge.print("Что вы ответите?");
	await tge.text(1);
	tge.print("Голос из-за двери что-от недовольно бробурчал, и дверь открылась");
}
async function nxRoom6(tge: TextGameEngine)
{
	tge.print("В этой комнате нет дверей")
	tge.print("&iКонец путешествия");
	await tge.wait();
	tge.print("Вы нашли люк, приключение продолжается");
	tge.print("Вы спустились в люк");
}
async function nxRoom7(tge: TextGameEngine)
{
	tge.print("Перед вами дверь с кодовым замком");
	while (true)
	{
		tge.print("Введите стойкий пароль:");
		await tge.text(1);
		if (Math.random() < 0.5) return tge.print("Дверь открылась и вы пошли дальше");
		tge.print("Неправильный пароль!");
		const chosen = await tge.choose(["Попробовать ещё раз", "Выломать дверь"]);
		tge.clear();
		if (chosen == 0) continue;
		while (true)
		{
			if (Math.random() < 0.3) return tge.print("Вы выломали дверь и прошли в следующую комнату");
			tge.print(strongDoor[Math.floor(Math.random() * strongDoor.length)]);
			const chosen = await tge.choose(["Попробовать ещё раз", "Ввести пароль"]);
			tge.clear();
			if (chosen == 1) break;
		}
	}
}
async function nxRoom8(tge: TextGameEngine)
{
	tge.print(`Перед вами 0 дверей`);
	do
	{
		tge.print("В какую вы зайдёте?", true);
		const chosen = await tge.num();
		tge.clear();
		tge.print("Такой двери нет");
	} while (Math.random() < 0.5);
	tge.print(`Вы отчаились и облокатились на стену`);
	tge.print("Стена покачнулась и вы оказались в другой комнате");
}
