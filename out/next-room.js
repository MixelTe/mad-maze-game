export const NextRoom = [
    nxRoom1,
];
async function nxRoom1(tge) {
    const count = Math.floor(Math.random() * 14) + 2;
    const doors = count >= 5 ? "дверей" : "двери";
    tge.print(`Перед вами ${count} ${doors}`, true);
    tge.print("В какую вы зайдёте?");
    const chosen = await tge.num(1, count);
    tge.print(`Вы зашли в ${chosen}-ю дверь`);
}