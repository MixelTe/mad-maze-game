import { Creator } from "./creator.js";
export const Room_Event = {
    title: "Введите событие:",
    hint: "Например: В этой комнате крокодил! или По середине стоит стол, на нём лежит молоток",
    placeholder: "Событие",
    subTitle: "Добавьте возможные действия:",
    subTitleHint: "Например: Погладить крокодила или Взять молоток",
    addText: "действие",
    collapsible: false,
    child: {
        title: "Введите действие:",
        hint: "",
        placeholder: "Действие",
        subTitle: "Добавьте возможные результаты действия:",
        subTitleHint: "Например: Крокодил уснул и вы спокойно прошли мимо или Вы уронили молоток на ногу, теперь вы хромаете",
        addText: "результат действия",
        collapsible: true,
        child: {
            title: "",
            hint: "",
            placeholder: "Результат действия",
            subTitle: "",
            subTitleHint: "",
            addText: "",
            collapsible: false,
            child: null,
        },
    },
};
export function restoreData(body) {
    const data = localStorage.getItem("contentCreatorData");
    if (data != null) {
        try {
            const creator = new Creator(Room_Event);
            body.appendChild(creator.getBody());
            apllyData(creator, data);
            return creator;
        }
        catch (er) {
            console.error("Data load failed: ", er);
        }
    }
    return createEmptyCreator(body);
}
export function apllyData(creator, data) {
    const parsedData = JSON.parse(data);
    setData(creator, parsedData);
}
function setData(creator, data) {
    creator.setValue(data.value);
    if (data.subData.length > 0) {
        for (let i = 0; i < data.subData.length; i++) {
            const subData = data.subData[i];
            if (i == 0) {
                const child = creator.getChild(0);
                if (child) {
                    setData(child, subData);
                    continue;
                }
            }
            const subCreator = creator.createChild();
            if (subCreator)
                setData(subCreator, subData);
        }
    }
}
export function createEmptyCreator(body) {
    body.innerHTML = "";
    const creator = new Creator(Room_Event);
    body.appendChild(creator.getBody());
    return creator;
}
