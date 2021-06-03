import { Button, Div } from "./functions.js";
import { CreatorsList, Room_Event } from "./room_Event.js";
import { Creator, CreatorData } from "./creator.js";

const { body, infDiv } = createPage();
let creator = restoreData();
setInterval(saveData, 5000);

function restoreData()
{
	const data = localStorage.getItem("contentCreatorData");
	if (data == null)
	{
		const creator = new Room_Event();
		body.appendChild(creator.init());
		return creator;
	}
	try
	{
		const parsedData = <CreatorData>JSON.parse(data);
		const creator = new Room_Event();
		body.appendChild(creator.init());
		setData(creator, parsedData, CreatorsList);
		return creator;
	}
	catch (er)
	{
		console.error("Data load failed: ", er);
	}
	body.innerHTML = "";
	const creator = new Room_Event();
	body.appendChild(creator.init());
	return creator;
}
function setData(creator: Creator, data: CreatorData, creators: typeof Creator[])
{
	creator.setValue(data.value);
	if (data.subData.length > 0)
	{
		for (let i = 0; i < data.subData.length; i++) {
			const subData = data.subData[i];
			if (i == 0)
			{
				const child = creator.getChild(0);
				if (child)
				{
					setData(child, subData, creators.slice(1));
					continue;
				}
			}
			const subCreatorClass = creators[0] || Creator;
			const subCreator = new subCreatorClass();
			subCreator.init(creator);
			creator.appendChild(subCreator);
			setData(subCreator, subData, creators.slice(1));
		}
	}
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
	popup.classList.add("popup-show");
	if (!creator.checkData()) closeSendPopup(popup);
}
function closeSendPopup(popup: HTMLDivElement)
{
	popup.classList.remove("popup-show");
}
