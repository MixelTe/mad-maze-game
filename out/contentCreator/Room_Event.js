import { Creator } from "./creator.js";
export const Room_Event = {
    title: "Введите событие:",
    hint: "Например: В этой комнате крокодил! или Посередине стоит стол, на нём лежит молоток",
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
        childrenCount: 2,
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
export function apllyData(creator, data, trySendData = false, sender) {
    if (trySendData) {
        const parsedData = JSON.parse(data);
        if (parsedData.author != undefined) {
            setData(creator, sendDataToCreatorData(parsedData));
            if (sender)
                sender.setData(parsedData.author);
        }
        else {
            const parsedData2 = parsedData;
            setData(creator, parsedData2);
        }
    }
    else {
        const parsedData = JSON.parse(data);
        setData(creator, parsedData);
    }
}
function sendDataToCreatorData(data) {
    const actions = [];
    for (let i = 0; i < data.data.actions.length; i++) {
        const el = data.data.actions[i];
        const results = [];
        for (let j = 0; j < el.results.length; j++) {
            results.push({ value: el.results[j], subData: [] });
        }
        actions.push({ value: el.action, subData: results });
    }
    return { value: data.data.event, subData: actions };
}
function setData(creator, data) {
    creator.setValue(data.value);
    if (data.subData.length > 0) {
        for (let i = 0; i < data.subData.length; i++) {
            const subData = data.subData[i];
            const child = creator.getChild(i);
            if (child) {
                setData(child, subData);
            }
            else {
                const subCreator = creator.createChild();
                if (subCreator)
                    setData(subCreator, subData);
            }
        }
    }
}
export function createEmptyCreator(body) {
    body.innerHTML = "";
    const creator = new Creator(Room_Event);
    body.appendChild(creator.getBody());
    return creator;
}
