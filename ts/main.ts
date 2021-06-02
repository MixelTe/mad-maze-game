import { TextGameEngine, Titles } from "./TextGameEngine.js";
const Version = 0.1;

const tge = new TextGameEngine();
tge.init(new Titles("Безумный лабиринт", "Нажмите здесь для продолжения", `Версия: ${Version}`));
