import { ConfirmPopup } from "./confirmPopup.js";
import { Button, copyText, Div } from "./functions.js";
import { restoreData, createEmptyCreator, apllyData } from "./Room_Event.js";
import { Sender } from "./sender.js";
const { body, infDiv, buttonSend, popup } = createPage();
let creator = restoreData(body);
let sender = new Sender(infDiv, buttonSend);
setInterval(saveData, 5000);
window.apllyData = (data) => {
    if (data == undefined) {
        console.error("apllyData: data is empty");
        return;
    }
    apllyData(creator, data, true);
};
window.getData = (full = true) => {
    const data = full ? sender.collectData(creator) : creator.getData();
    const dataStr = JSON.stringify(data);
    console.log("Data copied");
    copyText(dataStr);
};
function saveData() {
    const data = JSON.stringify(creator.getData());
    localStorage.setItem("contentCreatorData", data);
}
function createPage() {
    const body = Div("body");
    const popup = createPopup();
    document.body.appendChild(Div("main", [
        Div("header", [
            Div("title", "Cоздание событий"),
            Button("send-button", "Отправить", openSendPopup),
        ]),
        body,
        popup.popup,
    ]));
    return { body, infDiv: popup.infDiv, buttonSend: popup.buttonSend, popup: popup.popup };
}
function createPopup() {
    const infDiv = Div();
    const button = Button("popup-close", "×");
    const buttonSend = Button("popup-button-send", "Отправить", send);
    const popup = Div("popup", [
        Div("popup-container", [
            Div("popup-header", "Отправка нового события"),
            Div("popup-body", [infDiv]),
            Div("popup-footer", [
                Button("popup-button-clear", "Очистить", clear),
                buttonSend,
            ]),
            button,
        ]),
    ]);
    button.addEventListener("click", closeSendPopup);
    popup.addEventListener("click", (e) => {
        if (e.target == popup)
            closeSendPopup();
    });
    window.addEventListener("keyup", (e) => {
        if (e.key == "Escape")
            closeSendPopup();
    });
    // openSendPopup(popup);
    return { popup, infDiv, buttonSend };
}
function openSendPopup() {
    if (!creator.checkData())
        return;
    popup.classList.add("popup-show");
}
function closeSendPopup() {
    popup.classList.remove("popup-show");
    sender.onPopupClose();
    if (sender.sent)
        recreateAll();
}
function send() {
    if (sender.sent)
        recreateAll();
    else
        sender.send(creator);
}
async function clear() {
    if (sender.sent)
        return recreateAll();
    if (await new ConfirmPopup("удалить всё").ask()) {
        if (await new ConfirmPopup("удалить всё насовсем!", true).ask()) {
            recreateAll();
        }
    }
}
function recreateAll() {
    creator = createEmptyCreator(body);
    sender = new Sender(infDiv, buttonSend);
    closeSendPopup();
}
