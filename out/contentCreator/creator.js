import { ConfirmPopup } from "./confirmPopup.js";
import { appendTo, Button, capitalize, Div, Label, TextArea } from "./functions.js";
export class Creator {
    constructor(options, parent) {
        this.level = 0;
        this.remove = () => null;
        this.input = TextArea();
        this.titleEl = Label();
        this.body = Div("creator-body");
        this.creatorsDiv = Div("creators");
        this.colapseButton = Button("button-colapse", "-", this.colapse.bind(this));
        this.creators = [];
        this.colapsed = false;
        this.options = options;
        if (parent) {
            this.level = parent.level + 1;
            this.remove = parent.removeChild.bind(parent, this);
        }
        this.creatorsDiv.classList.add(`creators-level${this.level}`);
        this.body.setAttribute("creator-level", `${this.level}`);
        const id = `colapse_${Math.random()}`;
        this.input = TextArea(options.placeholder);
        this.input.addEventListener("click", () => this.input.classList.remove("emptyfield"));
        this.titleEl = Label("text", options.title, id);
        if (options.collapsible) {
            this.colapseButton.id = id;
            appendTo(this.body, [
                Div("creator-titlediv", [
                    this.colapseButton,
                    this.titleEl,
                ]),
            ]);
        }
        else {
            appendTo(this.body, [
                Div("creator-titlediv", [
                    this.titleEl,
                ]),
            ]);
        }
        const subBody = Div("creator-subBody");
        this.body.appendChild(subBody);
        appendTo(subBody, [
            Div("sub-text", options.hint),
        ]);
        if (this.level > 0) {
            appendTo(subBody, [
                Div("creator-removeDiv", [
                    Button("creator-button-remove", "Удалить", this.remove),
                ]),
            ]);
        }
        appendTo(subBody, [
            Div("creator-input", [this.input]),
        ]);
        if (options.child != null) {
            appendTo(subBody, [
                Div("text", options.subTitle),
                Div("sub-text", options.subTitleHint),
                Button("creator-button-add", "Добавить " + options.addText, this.addChild.bind(this, true)),
                this.creatorsDiv,
                Div("creator-botton-add", [
                    Button("creator-button-add", "Добавить " + options.addText.toLowerCase(), this.addChild.bind(this, false)),
                ]),
            ]);
            if (options.childrenCount != undefined && options.childrenCount > 1) {
                for (let i = 0; i < options.childrenCount; i++)
                    this.addChild();
            }
            else {
                this.addChild();
            }
        }
    }
    getData() {
        const subData = [];
        this.creators.forEach(creator => subData.push(creator.getData()));
        const data = { value: this.input.value, subData };
        return data;
    }
    checkData() {
        if (this.input.value == "") {
            if (this.colapsed)
                this.colapse();
            this.input.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => {
                this.input.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 50);
            this.input.classList.add("emptyfield");
            return false;
        }
        this.input.value = capitalize(this.input.value.trim().replaceAll(/ +/g, " "));
        if (this.creators.length == 0)
            return true;
        for (let i = 0; i < this.creators.length; i++) {
            const creator = this.creators[i];
            const res = creator.checkData();
            if (!res) {
                if (this.colapsed)
                    this.colapse();
                return false;
            }
        }
        return true;
    }
    addChild(toTop = false) {
        if (this.options.child) {
            const child = new Creator(this.options.child, this);
            if (toTop)
                this.creatorsDiv.prepend(child.body);
            else
                this.creatorsDiv.appendChild(child.body);
            this.creators.push(child);
            return child;
        }
        return null;
    }
    async removeChild(creator) {
        if (this.creators.length > 1) {
            if (!creator.isEmpty()) {
                const text = "удалить " + this.options.addText;
                if (!await new ConfirmPopup(text).ask())
                    return;
            }
            this.creatorsDiv.removeChild(creator.body);
            const i = this.creators.indexOf(creator);
            if (i >= 0)
                this.creators.splice(i, 1);
        }
    }
    colapse() {
        this.colapsed = !this.colapsed;
        if (this.colapsed) {
            this.colapseButton.innerText = "+";
            this.body.classList.add("creator-colapsed");
            this.titleEl.innerText = this.input.value || this.options.placeholder;
        }
        else {
            this.colapseButton.innerText = "-";
            this.body.classList.remove("creator-colapsed");
            this.titleEl.innerText = this.options.title;
        }
    }
    isEmpty() {
        if (this.input.value != "")
            return false;
        if (this.creators.length == 0)
            return true;
        for (let i = 0; i < this.creators.length; i++) {
            if (!this.creators[i].isEmpty())
                return false;
        }
        return true;
    }
    setValue(value) {
        this.input.value = value;
    }
    createChild() {
        return this.addChild();
    }
    getChild(index) {
        if (this.creators.length > index)
            return this.creators[index];
        return undefined;
    }
    getBody() {
        return this.body;
    }
}