import { Button, Div } from "./functions.js";
import { restoreData } from "./Room_Event.js";

const { body, infDiv } = createPage();
let creator = restoreData(body);
setInterval(saveData, 5000);


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
			Div("title", "Cоздание событий"),
			Button("send-button", "Отправить", openSendPopup.bind(undefined, popup.popup)),
		]),
		body,
		popup.popup,
	]));
	return { body, infDiv: popup.infDiv };
}
function createPopup()
{
	const infDiv = Div();
	const button = Button("popup-close", "×");
	const popup = Div("popup", [
		Div("popup-container", [
			Div("popup-header", "Отправка нового события"),
			Div("popup-body", [infDiv]),
			Div("popup-footer", "Отправить"),
			button,
		]),
	]);
	const closeSendPopup = (popup: HTMLDivElement) => popup.classList.remove("popup-show");
	const closePopup = closeSendPopup.bind(undefined, popup);
	button.addEventListener("click", closePopup);
	popup.addEventListener("click", (e) =>
	{
		if (e.target == popup) closePopup();
	});
	window.addEventListener("keyup", (e) =>
	{
		if (e.key == "Escape") closePopup();
	});
	// openSendPopup(popup);

	return { popup, infDiv };
}
function openSendPopup(popup: HTMLDivElement)
{
	if (!creator.checkData()) return;
	popup.classList.add("popup-show");
}
