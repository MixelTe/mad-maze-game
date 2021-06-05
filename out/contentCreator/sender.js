import { appendTo, Div, TextArea, Span, Button, copyText } from "./functions.js";
export class Sender {
    constructor(infDiv, buttonSend) {
        this.waitDiv = Div(["popup", "popup-show"]);
        this.name = TextArea();
        this.comment = TextArea();
        this.sent = false;
        this.infDiv = infDiv;
        this.buttonSend = buttonSend;
        buttonSend.innerText = "Отправить";
        infDiv.innerHTML = "";
        this.mainPage = Div([], [
            Div("text", "Введите ваше имя (если хотите):"),
            this.name,
            Div("text", "Сюда можно написать коментарий к событию:"),
            this.comment,
        ]);
        infDiv.appendChild(this.mainPage);
        this.waitDiv.appendChild(this.createSpinner());
    }
    async send(creator) {
        if (this.sent)
            return;
        const data = this.collectData(creator);
        // console.log(data);
        this.showWait();
        const json = JSON.stringify(data);
        let r;
        try {
            r = await fetch("URL_OF_SERVER", {
                method: "POST",
                headers: {
                    "Content-Type": "text/json",
                },
                body: json,
            });
            if (!r.ok) {
                throw new Error(`service api call failed (text) status: ${r.status}`);
            }
            this.showOnSentPage();
        }
        catch {
            this.showOnErrorPage(json);
        }
        finally {
            this.hideWait();
        }
    }
    setData(data) {
        this.name.value = data.name;
        this.comment.value = data.comment;
    }
    getInputsData() {
        return { name: this.name.value, comment: this.comment.value };
    }
    collectData(creator) {
        const data = {
            author: {
                name: this.name.value,
                comment: this.comment.value,
            },
            data: this.getData(creator),
        };
        return data;
    }
    showWait() {
        document.body.appendChild(this.waitDiv);
    }
    hideWait() {
        document.body.removeChild(this.waitDiv);
    }
    getData(creator) {
        const creatorData = creator.getData();
        const data = {
            type: "text",
            event: creatorData.value,
            actions: this.convertToAction(creatorData.subData),
        };
        return data;
    }
    convertToAction(data) {
        const converted = [];
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            const results = [];
            for (let j = 0; j < el.subData.length; j++) {
                const el2 = el.subData[j];
                results.push(el2.value);
            }
            converted.push({ action: el.value, results });
        }
        return converted;
    }
    showOnErrorPage(data) {
        this.infDiv.innerHTML = "";
        const a = document.createElement("a");
        a.innerText = "Отправить через github";
        a.href = this.createLinkToIssue(data);
        a.target = "_blank";
        appendTo(this.infDiv, [
            Div("text", "К сожалению не удалось отправить данные на сервер :("),
            Div(["text", "marginTop"], [
                Span([], "Можете попробовать ещё раз или самостоятельно отправить данные автору: "),
                Button(["sender-copybutton"], "Копировать данные", copyText.bind(this, data)),
            ]),
            Div(["text", "marginTop"], [
                a,
                Span([], " достаточно будет нажать только зелёную кнопку"),
            ])
        ]);
        this.buttonSend.innerText = "Отправить ещё раз";
    }
    showOnSentPage() {
        this.infDiv.innerHTML = "";
        appendTo(this.infDiv, [
            Div("text", "Новое событие отправленно!"),
            Div(["text", "marginTop"], "Возможно оно будет добавленно в следующей версии игры"),
        ]);
        this.sent = true;
        this.buttonSend.innerText = "Создать ещё одно событие";
    }
    createLinkToIssue(data) {
        const mainLink = "https://github.com/MixelTe/mad-maze-game/issues/new";
        const title = encodeURIComponent("New event for game");
        const text = encodeURIComponent(data);
        const link = `${mainLink}?title=${title}&body=${text}`;
        return link;
    }
    createSpinner() {
        const parts = 13;
        const spinner = Div("spinner");
        const angleStep = 360 / parts;
        const delayStep = 1 / parts;
        for (let i = 0; i < 13; i++) {
            const subpart = Div();
            const part = Div([], [subpart]);
            spinner.appendChild(part);
            part.style.transform = `rotate(${angleStep * i}deg) translateX(var(--trx--))`;
            subpart.style.animationDelay = `${delayStep * i}s`;
        }
        return spinner;
    }
    onPopupClose() {
        this.buttonSend.innerText = "Отправить";
        this.infDiv.innerHTML = "";
        this.infDiv.appendChild(this.mainPage);
    }
}
