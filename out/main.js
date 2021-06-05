import { NextRoom } from "./next-room.js";
import { EventsScripts } from "./events-scripts.js";
import { Actions, Events } from "./events.js";
import { TextGameEngine, Titles } from "./TextGameEngine.js";
const Version = "0.3.1";
const ExitChance = 0.03;
const ExitMinRoom = 30;
const ExitMaxRoom = 100;
const MaxRoom = 100000;
let runCount = 0;
let agreeCount = 0;
let roomCount = 0;
const tge = new TextGameEngine();
tge.init(new Titles("Безумный лабиринт", "Нажмите сюда для продолжения", `Версия: ${Version}`));
createDescription();
// labyrinth();
main();
async function main() {
    runCount += 1;
    tge.clear();
    if (runCount > 1) {
        tge.print("Добро пожаловать снова в &bБезумный лабиринт&c!");
        tge.print(`Уже ${runCount}-й раз`);
    }
    else
        tge.print("Добро пожаловать в &bБезумный лабиринт&c!");
    tge.print("По легенде в нём спрятаны несметные богатства, а также джин, который исполнит любые желания");
    tge.print("Те немногие, кто всё-таки отважился зайти в лабиринт, так и не вернулись...");
    await tge.wait();
    if (runCount > 1)
        tge.print("Решитесь ли вы теперь войти в лабиринт?", true);
    else
        tge.print("Решитесь ли вы войти в лабиринт?", true);
    const chosen = await tge.choose(["&bКонечно да!", "Пожалуй, нет"]);
    if (chosen != 0) {
        tge.print("Мудрое решение", true);
        if (runCount > 1)
            tge.print('"Пусть гибнут безумцы", - как вы знаете, говорят местные, когда приключенцы просят провести их через лабиринт');
        else
            tge.print('"Пусть гибнут безумцы", - говорят местные, когда приключенцы просят провести их через лабиринт');
        await tge.wait();
        await reRun();
    }
    else {
        agreeCount += 1;
        if (runCount > 1)
            tge.print('Всё-таки вы решились!', true);
        else
            tge.print('Тогда начнём!', true);
        tge.print("");
        tge.print("");
        tge.print("");
        tge.print("Вы приехали в небольшую деревеньку возле лабиринта и остановились на ночь у местного фермера");
        tge.print("Весь вечер фермер отговаривал вас от похода в лабиринт");
        tge.print("Вы попросили его показать путь к лабиринту, на что он ответил:");
        tge.print('- Если вам дорога жизнь &bпоезжайте обратно&c, а в лабиринте пусть гибнут безумцы');
        await tge.wait();
        tge.print("Весь вечер вы думали над его словами");
        tge.print("Настало утро. У вас есть последний шанс отказаться от этой безумной идеи", true);
        tge.print("Вы уверены, что готовы зайти в лабиринт?");
        const chosen = await tge.choose(["&bКонечно да, вперёд!", "Пожалуй, всё-таки нет"]);
        if (chosen != 0) {
            if (agreeCount > 1)
                tge.print(`Уже ${agreeCount}-й раз вы отказываетесь в последний момент`, true);
            else
                tge.print("Вы осознали безумность этой затеи, и решили отказаться от неё", true);
            await tge.wait();
            await reRun();
        }
        else {
            if (agreeCount > 1)
                tge.print("Неужели вы всё-таки решились", true);
            else
                tge.print("Вы не отступили от своей затеи", true);
            tge.print("Прощаясь, фермер спросил:");
            tge.print("- Как вас записать на доске приключенцев?");
            const name = await tge.text(2);
            addName(name);
            tge.print(`Вы ответили: "${name}"`);
            tge.print("Фермер попрощался с вами, и вы пошли к лабиринту");
            await tge.wait();
            tge.print("У входа в лабиринт вы увидели камень, на нём что-то написанно:", true);
            tge.print("&iВ память о зашедших:");
            const names = getNames();
            tge.print(names);
            tge.print("Дальше было ещё несколько имён ваших предшественников");
            await tge.wait();
            await labyrinth();
        }
    }
    await reRun();
}
async function labyrinth() {
    tge.print();
    tge.print("Вы зашли в лабиринт", true);
    tge.print("Дверь за вами сразу же захлопнулась");
    tge.print("Вы оглянулись и увидили как дверь постепенно сливается со стеной");
    tge.print("Итак начнём!", true);
    await tge.wait();
    while (continueAdventure()) {
        for (let i = 0; i < 6; i++)
            tge.print();
        tge.print("Вы прочитали на стене:");
        tge.print(`Комната №${rndInt(MaxRoom)}`);
        const event = getRandom(Events);
        if (event.type == "text")
            await event_text(event);
        else if (event.type == "script")
            await event_script(event);
        else
            console.error(`Unexpected event type: ${event.type}`);
        await tge.wait();
        await toNextRoom();
    }
}
async function toNextRoom() {
    const nextRoom = getRandom(NextRoom);
    await nextRoom(tge);
}
async function event_text(event) {
    tge.print(event.event, true);
    tge.print("Что вы будете делать?");
    const actions = getRandoms(event.actions, 2);
    actions.push(getRandom(Actions));
    const actionsStr = [];
    actions.forEach(action => actionsStr.push(action.action));
    const chosen = await tge.choose(actionsStr);
    const results = actions[chosen].results;
    const result = getRandom(results);
    tge.print(result, true);
}
async function event_script(event) {
    const script = EventsScripts.get(event.event);
    if (script == undefined) {
        tge.print("В этой комнате нет ничего интересного");
        console.error(`Unexpected event: ${event.event}`);
    }
    else {
        await script(tge);
    }
}
function continueAdventure() {
    if (roomCount < ExitMinRoom)
        return true;
    if (roomCount >= ExitMaxRoom)
        return false;
    return Math.random() > ExitChance;
}
async function reRun() {
    tge.print();
    tge.print("Спасибо, что играли в &bБезумный лабиринт&c", true);
    if (runCount <= 1) {
        tge.print("В левом верхнем углу есть кнопка &bi&c, возможно, когда-нибудь там будут ссылки на другие игры автора");
        tge.print("Так же там есть ссылка на страницу, где можно добавить новые события в лабиринт.");
    }
    await tge.choose(["Перезапустить игру"]);
    setTimeout(main, 100);
}
function createDescription() {
    const infDiv = tge.getInfDiv();
    const div1 = document.createElement("div");
    infDiv.appendChild(div1);
    div1.innerText = "Лабиринт, в котором порой происходят необъяснимые вещи. Он может казаться бесконечным, но не отчаивайтесь! Хоть вы и будете ходить кругами - выход где-то есть.";
    const div2 = document.createElement("div");
    infDiv.appendChild(div2);
    div2.style.marginTop = "20px";
    const span1 = document.createElement("span");
    div2.appendChild(span1);
    span1.innerText = "Вы можете добавить дополнительные события в лабиринте, для этого нажмите ";
    const a1 = document.createElement("a");
    a1.style.color = "var(--color-link--)";
    a1.href = "./contentCreator";
    a1.target = "_blank";
    div2.appendChild(a1);
    a1.innerText = "сюда";
    const span2 = document.createElement("span");
    div2.appendChild(span2);
    span2.innerText = ", то что вы напишете может быть добавленно в следующей вирсии игры";
    const a = document.createElement("a");
    infDiv.appendChild(a);
    a.href = "https://github.com/MixelTe/mad-maze-game";
    a.target = "_blank";
    a.style.textAlign = "center";
    a.style.width = "100%";
    a.style.display = "block";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    a.appendChild(svg);
    svg.appendChild(path);
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("fill", "var(--color-text--)");
    path.setAttribute("d", "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z");
    svg.style.height = "1.5em";
    svg.style.marginTop = "10px";
}
function addName(name) {
    const namesStr = localStorage.getItem("names") || "[]";
    const names = JSON.parse(namesStr);
    names.push([name, getDate()]);
    const namesStrNew = JSON.stringify(names);
    localStorage.setItem("names", namesStrNew);
}
function getNames() {
    const namesStr = localStorage.getItem("names") || "[]";
    const names = JSON.parse(namesStr);
    const namesStrs = [];
    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        namesStrs[i] = `&i${name[0]} - ${name[1]}`;
    }
    return namesStrs.join("\n");
}
function getDate() {
    const d = new Date();
    const v = [d.getHours(), d.getMinutes(), d.getDate(), d.getMonth(), d.getFullYear()];
    for (let i = 0; i < v.length; i++) {
        const el = `${v[i]}`;
        if (el.length == 1)
            v[i] = "0" + el;
    }
    return `${v[2]}.${v[3]}.${v[4]}, ${v[0]}:${v[1]}`;
}
function rndInt(max) {
    return Math.floor(Math.random() * max);
}
function getRandom(array) {
    return array[rndInt(array.length)];
}
function getRandoms(array, count = 1) {
    const l = array.length;
    if (count > l)
        count = l;
    for (let i = 0; i < count; i++) {
        const j = rndInt(l - i);
        const t = array[i];
        array[i] = array[j];
        array[j] = t;
    }
    return array.slice(-count);
}
