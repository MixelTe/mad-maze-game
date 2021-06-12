import { TextGameEngine } from "./TextGameEngine";

export const EndesOfMaze: ((tge: TextGameEngine) => Promise<void | number>)[] = [
	end1, end2, end3, end4, end5, end6, end7, end8,
]

async function end1(tge: TextGameEngine)
{
	tge.print('Вы заметили дверь с надписью "Выход"');
	tge.print('Вы решили в неё зайти');
	await tge.wait();
	tge.print("Вы вышли из лабиринта!");
}
async function end2(tge: TextGameEngine)
{
	tge.print('Вы заметили дверь с надписью "Выход"');
	tge.print('Вы решили в неё зайти');
	await tge.wait();
	tge.print("Вы вышли из лабиринта!");
	await tge.wait();
	tge.print('Голос из ниоткуда: "Пол это ^red^&bлава&c!"');
	tge.print("Земля под ногами превратилась в лаву, вы не успели залезть на дерево.");
	tge.print("Конец!");
}
async function end3(tge: TextGameEngine)
{
	tge.print('Внезапно под ногами пропал пол!');
	tge.print('Вы стали падать в бездну');
	await tge.wait();
	tge.print('Вы замедлились и плавно преземлились на мягкую травку');
	await tge.wait();
	tge.clear();
	await farmerEnd(tge);
}
async function end4(tge: TextGameEngine)
{
	tge.print('Внезапно под ногами пропал пол!');
	tge.print('Вы стали падать в бездну');
	await tge.wait();
	tge.print('Вы замедлились и плавно преземлились на мягкую травку');
	await tge.wait();
	tge.clear();
	tge.print('Внезапно вы услышали чей-то злобный смех');
	await tge.wait();
	tge.print('Со всех сторон к вам стал приближался огонь!');
	tge.print('Вы взяли огнетушитель и стали тушить всё вокруг');
	await tge.wait();
	tge.print('Но огонь было не остановить');
	tge.print('Повезёт в другой раз');
	tge.print('Конец!');
}
async function end5(tge: TextGameEngine)
{
	tge.print('Внезапно под ногами пропал пол!');
	tge.print('Вы стали падать в бездну');
	await tge.wait();
	tge.print('Вы замедлились и плавно преземлились на мягкую травку');
	await tge.wait();
	tge.clear();
	tge.print('Внезапно вы услышали чей-то смех');
	await tge.wait();
	tge.print('Со всех сторон к вам приближался огонь!');
	tge.print('Вы взяли огнетушитель и стали тушить всё вокруг');
	await tge.wait();
	tge.print('Теперь вы стоите в темноте, среди сгоревшей травы');
	tge.print('Из-за дыма вы потеряли сознание');
	await tge.wait();
	tge.clear();
	await farmerEnd(tge);
}
async function farmerEnd(tge: TextGameEngine)
{
	tge.print('Вы очнулись в кровате');
	tge.print('Рядом ходил счастливый фермер:');
	tge.print('- Он выжил, он выжил! Теперь мне есть, что рассказать внукам!');
	tge.print('- Пойду к летописцу, он должен записать это событие');
	tge.print('Он ушёл');
	await tge.wait();
	tge.clear();
	tge.print("Через несколько дней вы оправились после лабиринта и вернулись домой");
}
async function end6(tge: TextGameEngine)
{
	tge.print("Вы прочитали на табличке:");
	tge.print("&iКупить:");
	tge.print("&i* Молоко");
	tge.print("&i* Масло");
	tge.print("&i* Хлеб");
	await tge.wait();
	tge.clear();
	tge.print("Эта надпись показалась вам знакомой");
	tge.print("Вы же у себя дома!");
}
async function end7(tge: TextGameEngine)
{
	tge.print("Вы прочитали на табличке:");
	tge.print("Джин");
	tge.print("&i&bНе беспокоить в обеденное время");

	tge.print("В комнате сидит Джин", true);
	tge.print("Что вы будете делать?");
	const chosen = await tge.choose(["Загадать желание", "Обнять Джина", "Потребовать золото"]);
	tge.clear();
	if (chosen == 0)
	{
		while (true)
		{
			tge.print('"Чего ты хочешь?", - спросил Джин');
			await tge.text(2);
			tge.print('- Ты уверен, что хочешь именно этого?');
			const chosen = await tge.choose(["Да", "Нет"]);
			tge.clear();
			if (chosen == 0) break;
		}
		tge.print("- Я знаю, что ты хочешь не этого");
		while (true)
		{
			tge.print('- Так чего ты действительно хочешь?', true);
			await tge.text(2);
			tge.print('- Ты уверен, что хочешь именно этого?');
			const chosen = await tge.choose(["Да", "Нет"]);
			if (chosen == 0) break;
			tge.clear();
		}
		tge.print("- Хорошо, я исполню твоё &bистинное&c желание!");
		await tge.wait();
		tge.clear();
		await farmerEnd(tge);
		return 0;
	}
	else if (chosen == 1)
	{
		tge.print("Джин удивился и обнял вас тоже");
		await tge.wait();
		tge.print("Через час Джин так подобрел, что решил вернуть вас домой");
		tge.print('"До встречи", - сказал он и хлопнул в ладоши');
		await tge.wait();
		tge.clear();
		tge.print("Вы очнулись дома в своей кровати");
		return 1;
	}
	else
	{
		tge.print("Джин рассердился, но все-таки пообещал исполнить желание");
		tge.print("Он указал на стену, и там появилась дверь");
		tge.print("- За этой дверью бесчисленное количесто золота, бери сколько хочешь");
		await tge.wait();
		tge.clear();
		tge.print("Вы зашли в дверь и стали набивать карманы золотом");
		tge.print("С каждой секундой ваше богатство приумножалось");
		await tge.wait();
		tge.print("Через час, когда вы опомнились, вы решили вернутся домой", true);
		await tge.wait();
		tge.print("Но были так увлечены золотом, что не следили куда идёте", true);
		tge.print("Вы заблудились среди бесчисленых гор золота");
		tge.print("Конец!");
		return 2;
	}
}
async function end8(tge: TextGameEngine)
{
	tge.print("Вы прочитали на табличке:");
	tge.print("Джин");
	tge.print("&i&bНе беспокоить в обеденное время");

	tge.print("В комнате сидит Джин", true);
	tge.print("Что вы будете делать?");
	const chosen = await tge.choose(["Загадать желание", "Поймать Джина в лампу", "Обокрасть Джина"]);
	tge.clear();
	if (chosen == 0)
	{
		if (Math.random() < 0.5)
		{
			tge.print("Джин указал на табличку:")
			tge.print("&i&bНе беспокоить в обеденное время");
			await tge.wait();
			tge.print("После чего хлопнул в ладоши, и...");
			await tge.wait();
			tge.clear();
			await farmerEnd(tge);
			return 0
		}
		else
		{
			tge.print("Джин отказался выполнять ваше желание, но предложил:");
			tge.print("- Хочешь исполнить любые желания?");
			await tge.wait();
			tge.print("Вы согласились, и он сказал:");
			tge.print("- Займи моё место и сможешь выполнить любое желание");
			tge.print("Вы хотите стать Джином?");
			const chosen = await tge.choose(["Да", "Нет"]);
			tge.clear();
			if (chosen == 0)
			{
				tge.print("Джин хлопнул в ладоши и исчез");
				tge.print("Теперь вы джин, и вам придётся сидеть в этой комнате вечность");
				tge.print("Возможно вы найдёте того, кто согласиться вас заменить");
				return 1;
			}
			else
			{
				tge.print("Джин расстроился и куда-то ушёл");
				tge.print("Вы застряли в его комнате");
				tge.print("Он не вернулся в ближайшие сто лет, возможно он обустроился в другой комнате");
				tge.print("Конец...");
				return 2;
			}
		}
	}
	else if (chosen == 1)
	{
		tge.print("Вы подкрались к Джину и открыли лампу");
		await tge.wait();
		if (Math.random() < 0.5)
		{
			tge.print("Джин застрял в лампе");
			tge.print("Вы решили пойти дальше");
			await tge.wait();
			tge.print("Дверь из комнаты оказалась запертой");
			tge.print("А ключ у Джина!");
			await tge.wait();
			tge.print("Вы провели остаток жизни, пытаясь освободить Джина");
			tge.print("Конец...");
			return 3;
		}
		else
		{
			tge.print("Джин рассмеялся и забрал у вас лампу");
			tge.print("Он стал крутить её в руках, и...");
			await tge.wait();
			tge.print("Вы очутились в лампе!");
			tge.print("^gray^Так себе концовка...");
			return 4;
		}
	}
	else
	{
		if (Math.random() < 0.5)
		{
			tge.print("Пока Джин спал, вы забрали много драгоценностей и всякой всячины");
			tge.print("Среди разных предметов вы заметили куб");
			tge.print("Куб был черный с вертикальными полосками");
			tge.print("Возмёте этот куб?");
			const chosen = await tge.choose(["Конечно, да", "Пожалуй, нет"]);
			tge.clear();
			if (chosen == 0)
			{
				tge.print("Когда вы дотронулися до куба, у вас потемнело в глазах");
				await tge.wait();
				tge.print("Очнувшись, вы поняли, что находитесь внутри этого куба");
				tge.print("Конец.");
				return 5;
			}
			else
			{
				tge.print("Вы оставили этот куб и пошли дальше");
				tge.print("В конце комнаты была дверь");
				tge.print("Вы открыли дверь, и...");
				await tge.wait();
				tge.print("Оказалось, что дверь вела к вам домой");
				tge.print("Вы закрыли за собой дверь и спокойно легли спать");
				return 6;
			}
		}
		else
		{
			tge.print("Джин заметил вас");
			tge.print("Он рассердился и хлопнул в ладоши");
			await tge.wait();
			if (Math.random() < 0.5)
			{
				tge.print("Вы оказались дома, но без денег");
				return 7;
			}
			else
			{
				tge.print("Вы оказались в комнате из хлеба");
				tge.print("Всю оставшеюся жизнь вы ели хлеб, пытаясь выбраться");
				tge.print("Конец.");
				return 8;
			}
		}
	}
}