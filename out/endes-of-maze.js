export const EndesOfMaze = [
    end1,
];
async function end1(tge) {
    tge.print('Вы заметили дверь с надписью "Выход"');
    tge.print('Вы решили в неё зайти');
    await tge.wait();
    tge.print("Вы вышли из лабиринта!");
}
