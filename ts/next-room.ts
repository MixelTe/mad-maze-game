import { TextGameEngine } from "./TextGameEngine";

export const NextRoom: ((tge: TextGameEngine) => Promise<void>)[] = [
	nxRoom1, nxRoom2,
]
const strongDoor = [
	"Дверь оказалась крепче, чем вы думали",
	"Сколько вы не бились, дверь не поддалась",
	"Вы потратили немало сил, но безрезультатно",
	"Кажется, дверь подвинулась, нет, только кажется",
	'Способность "&bМощный Удар По Двери&c" ещё не восстановлена',
	"Удар головой об дверь не помог",
	"Вас отбросило от двери с той же силой, что вы ударили",
	"На двери осталась небольшая вмятина",
	"Вас ударило током, но дверь всё ещё стоит",
	"Дверь покачнулась и упала, вам так показалось, лёжа на полу",
]
const words = [
	"Корабль", "Зелёный", "Слон", "Бумага", "Перец", "Жёлтый", "Фиолетовый", "Губка", "Мандарин", "Волшебная палочка",
	"Крокодил", "Шлем", "Кольчуга", "Бутерброд", "Хлеб", "Молоко", "Масло", "Сиреневый", "Свет", "Тьма",
	"Тень", "Солнце", "Луна", "Звезда", "Сова", "Две совы", "Три совы", "Пять сов", "Куб", "Шар",
	"Выход", "Вход", "Тупик", "Спасение", "Надежда", "Мгла", "Совесть", "Помощь", "Подсказка", "Кощей",
	"Колобок", "Вода", "Лава", "Огонь", "Сыр", "Пирог", "Мыло", "Ягода", "Малина", "Арбуз",
	"Монета", "Золото", "Сокровище", "Ловушка", "Принцесса", "Король", "Принц", "Яга", "Волк", "Заяц",
	"Медведь", "Холод", "Тепло", "Вентилятор", "Холодильник", "Синий", "Красный", "Море", "Пляж", "Берег",
]
const questions = [
	{ q: "В каком слове три буквы 'о'?", a: "трио" },
	{ q: "Какого цвета солнце?", a: ["желтый", "желтого", "жёлтый", "жёлтого"] },
	{ q: "Где живёт крипер?", a: ["в майнкравте", "майнкравте", "майнкравт"] },
	{ q: "В какое время года начинается новый?", a: ["зима", "зимой"] },
	{ q: "Что тяжелее килограмм золота или пуха?", a: ["одинакого", "равны"] },
	{ q: "Сколько букв в слове кристаллизовывать", a: "17" },
	{ q: "Что нельзя съесть на завтрак?", a: ["обед", "ужин", "полдник"] },
	{ q: "Какое слово в словаре записано неправильно?", a: "неправильно" },
	{ q: "Каких камней не бывает в речке?", a: "сухих" },
	{ q: "Сколько будет 2 + 2 * 2?", a: "6" },
	{ q: "Три слона в воде, сколько ног?", a: "6" },
	{ q: "Три, три, три, что получится?", a: "дырка" },
	// { q: "", a: "" },
]

async function nxRoom1(tge: TextGameEngine)
{
	let count = Math.floor(Math.random() * 16);
	if (count == 0)
	{
		if (Math.random() < 0.5) await zeroDoors1(tge);
		else await zeroDoors2(tge);
		return;
	}
	if (count == 1)
	{
		ladder(tge);
		return;
	}
	const doors = count >= 5 ? "дверей" : "двери";
	while (true)
	{
		tge.print(`Перед вами ${count} ${doors}`);
		tge.print("В какую вы зайдёте?");
		const chosen = await tge.num(1, count);
		if (Math.random() < 0.4)
		{
			tge.print(`Вы зашли в ${chosen}-ю дверь`);
			break;
		}
		else
		{
			const doorsAct = [questionDoor, askDoor, passwordDoor, lockedDoor, lockedDoor];
			const action = doorsAct[Math.floor(Math.random() * doorsAct.length)];
			if (await action(tge)) break;
		}
		tge.clear();
	}
}
async function ladder(tge: TextGameEngine)
{
	tge.print("Перед вами две лестницы: вверх и вниз")
	tge.print("Куда вы пойдёте?")
	await tge.choose(["Вверх", "Вниз"]);
	tge.print("Когда вы прошли пару ступенек, проход за вами закрылся");
}
async function questionDoor(tge: TextGameEngine)
{
	const question = questions[Math.floor(Math.random() * questions.length)];
	tge.print("В этой комнате дверь с загадкой:");
	tge.print("&i" + question.q);
	const ans = (await tge.text(1, -1, false)).toLowerCase();
	if (typeof question.a == "string") question.a = [question.a];
	question.a.forEach(a =>
	{
		if (ans == a)
		{
			tge.print("Дверь открылась, и вы прошли дальше");
			return true;
		}
	});
	tge.print("Дверь не открылась, но вас это не остановило, и вы пошли дальше");
	await tge.wait();
	tge.print("Вы вернулись и, на всякий случай, аккуратно повесили дверь обратно на петли");
	return true;
}
async function askDoor(tge: TextGameEngine)
{
	tge.print("Подойдя к двери вы услышали вопрос:");
	tge.print('- Вам кого?');
	tge.print("Что вы ответите?");
	await tge.text(1);
	tge.print("Голос из-за двери что-от недовольно бробурчал, и дверь открылась");
	return true;
}
async function passwordDoor(tge: TextGameEngine)
{
	tge.print("Перед вами дверь с кодовым замком");
	while (true)
	{
		tge.print("Введите стойкий пароль:");
		await tge.text(1);
		if (Math.random() < 0.4)
		{
			tge.print("Дверь открылась и вы пошли дальше");
			return true;
		}
		tge.print("Неправильный пароль!");
		const chosen = await tge.choose(["Попробовать ещё раз", "Выломать дверь", "Открыть другую дверь"]);
		tge.clear();
		if (chosen == 0) continue;
		if (chosen == 2) return false;
		while (true)
		{
			if (Math.random() < 0.3)
			{
				tge.print("Вы выломали дверь и прошли в следующую комнату");
				return true;
			}
			tge.print(strongDoor[Math.floor(Math.random() * strongDoor.length)]);
			const chosen = await tge.choose(["Попробовать ещё раз", "Ввести пароль", "Открыть другую дверь"]);
			tge.clear();
			if (chosen == 1) break;
			if (chosen == 2) return false;
		}
	}
}
async function lockedDoor(tge: TextGameEngine)
{
	tge.print("Дверь оказалась заперта, а ключа у вас нет");
	return false;
}
async function zeroDoors1(tge: TextGameEngine)
{
	tge.print(`Перед вами 0 дверей`);
	const noDoor = [
		"Такой двери нет",
		"Такой тоже нет",
		"И такой тоже нет",
		"Даже такой нет",
	];
	let i = 0;
	do
	{
		tge.print("В какую вы зайдёте?", true);
		await tge.num();
		tge.clear();
		tge.print(noDoor[i]);
		i++;
	} while (Math.random() < 0.5 && i < noDoor.length);
	tge.print(`Вы отчаились и облокотились на стену`);
	tge.print("Стена покачнулась и вы оказались в другой комнате");
}
async function zeroDoors2(tge: TextGameEngine)
{
	tge.print("В этой комнате нет дверей")
	tge.print("&iКонец путешествия");
	await tge.wait();
	tge.print("Вы нашли люк, приключение продолжается");
	tge.print("Вы спустились в люк");
}

async function nxRoom2(tge: TextGameEngine)
{
	const doors = getRandoms(words, 2);
	tge.print("В этой комнате две двери");
	tge.print(`На одной написано: "${doors[0]}", а на другой "${doors[1]}"`);
	tge.print('В какую вы зайдёте?');
	const i = await tge.choose(doors);
	tge.print(`Вы зашли в дверь с надписью "${doors[i]}"`);
}

function getRandoms<T>(array: T[], count = 1)
{
	const l = array.length;
	if (count > l) count = l;
	for (let i = 0; i < count; i++)
	{
		const j = Math.floor(Math.random() * (l - i));
		const t = array[i];
		array[i] = array[j];
		array[j] = t;
	}
	return array.slice(0, count);
}