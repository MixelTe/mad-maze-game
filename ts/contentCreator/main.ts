import { ConfirmPopup } from "./confirmPopup.js";
import { Button, copyText, Div } from "./functions.js";
import { restoreData, createEmptyCreator, apllyData } from "./Room_Event.js";
import { Sender } from "./sender.js";

const { body, infDiv, buttonSend, popup } = createPage();
let creator = restoreData(body);
let sender = new Sender(infDiv, buttonSend);
creator.focus();
restoreSenderData();
setInterval(saveAllData, 5000);

console.log("apllyData(data: string)");
console.log("getData(withAuthor = false) - json");
console.log("getData(actionIndex: number) - json");
console.log("getText() - text");

declare global
{
	export interface Window
	{
		apllyData: (data: string) => void;
		getData: (withAuthor_actionIndex?: boolean | number) => void;
		getText: () => void;
	}
}
window.apllyData = (data: string) =>
{
	if (data == undefined)
	{
		console.error("apllyData: data is empty");
		return;
	}
	creator = createEmptyCreator(body);
	apllyData(creator, data, true, sender);
}
window.getData = (withAuthor_actionIndex: boolean | number = false) =>
{
	let data = <any>sender.collectData(creator);
	if (typeof withAuthor_actionIndex == "boolean")
	{
		if (!withAuthor_actionIndex) data = data.data;
	}
	else if (typeof withAuthor_actionIndex == "number")
	{
		data = data.data.actions[withAuthor_actionIndex];
	}
	else
	{
		console.log(`${withAuthor_actionIndex} is't bool or number`);
		return;
	}
	let dataStr = JSON.stringify(data);
	if (withAuthor_actionIndex != false) dataStr = "\t" + dataStr + ",";
	console.log("Data copied");
	copyText(dataStr);
}
window.getText = () =>
{
	const data = creator.getData();
	const dataSender = sender.getInputsData();
	let str = "";
	str += "Name:\n\t" + dataSender.name + "\n";
	str += "Comment:\n\t" + dataSender.comment + "\n\n";
	str += data.value + "\n";
	for (let i = 0; i < data.subData.length; i++) {
		const el = data.subData[i];
		str += "\n\t" + el.value + "\n";
		for (let j = 0; j < el.subData.length; j++) {
			const el2 = el.subData[j];
			str += "\t\t" + el2.value + "\n";
		}
	}
	copyText(str);
	console.log("Data copied");
}

function saveData()
{
	const data = JSON.stringify(creator.getData());
	localStorage.setItem("contentCreatorData", data);
}
function createPage()
{
	const body = Div("body");
	const popup = createPopup();
	document.body.appendChild(Div("main", [
		Div("header", [
			Button("remove-button", "×", clear),
			Div("title", "Cоздание событий"),
			Button("send-button", "Отправить", openSendPopup),
		]),
		body,
		popup.popup,
	]));
	return { body, infDiv: popup.infDiv, buttonSend: popup.buttonSend, popup: popup.popup };
}
function createPopup()
{
	const infDiv = Div();
	const button = Button("popup-close", "×");
	const buttonSend = Button("popup-button-send", "Отправить", send);
	const popup = Div("popup", [
		Div("popup-container", [
			Div("popup-header", "Отправка нового события"),
			Div("popup-body", [infDiv]),
			Div("popup-footer", [
				buttonSend,
			]),
			button,
		]),
	]);
	button.addEventListener("click", closeSendPopup);
	popup.addEventListener("click", (e) =>
	{
		if (e.target == popup) closeSendPopup();
	});
	window.addEventListener("keyup", (e) =>
	{
		if (e.key == "Escape") closeSendPopup();
	});
	// openSendPopup(popup);

	return { popup, infDiv, buttonSend };
}
function openSendPopup()
{
	if (!creator.checkData()) return;
	popup.classList.add("popup-show");
}
function closeSendPopup()
{
	popup.classList.remove("popup-show");
	sender.onPopupClose();
	if (sender.sent) recreateAll();
}
function send()
{
	if (sender.sent) recreateAll();
	else sender.send(creator);
}
async function clear()
{
	if (sender.sent) return recreateAll();
	if (await new ConfirmPopup("удалить всё").ask())
	{
		if (await new ConfirmPopup("удалить всё насовсем!", true).ask())
		{
			recreateAll();
		}
	}
}
function recreateAll()
{
	creator = createEmptyCreator(body);
	sender = new Sender(infDiv, buttonSend);
	closeSendPopup();
	clearSenderData();
	restoreSenderData();
}
function saveAllData()
{
	const senderData = sender.getInputsData();
	localStorage.setItem("senderData", JSON.stringify(senderData));
	saveData();
}
function restoreSenderData()
{
	const senderData = localStorage.getItem("senderData");;
	if (senderData != null)
	{
		try
		{
			const data = <{ name: string; comment: string; }>JSON.parse(senderData);
			sender.setData(data);
		}
		catch
		{

		}
	}
}
function clearSenderData()
{
	const senderData = localStorage.getItem("senderData");;
	if (senderData != null)
	{
		try
		{
			const data = <{ name: string; comment: string; }>JSON.parse(senderData);
			data.comment = "";
			localStorage.setItem("senderData", JSON.stringify(data));
		}
		catch
		{
			localStorage.removeItem("senderData");
		}
	}
}