import { Button, Div } from "./functions.js";
export class ConfirmPopup {
    constructor(text, revert = false) {
        const buttons = revert ? [
            Button("popup-confirm-no", "Нет", this.result_no.bind(this)),
            Button("popup-confirm-yes", "Да", this.result_yes.bind(this)),
        ] : [
            Button("popup-confirm-yes", "Да", this.result_yes.bind(this)),
            Button("popup-confirm-no", "Нет", this.result_no.bind(this)),
        ];
        this.popup = Div(["popup", "popup-show"], [
            Div("popup-confirm-container", [
                Div("popup-confirm-text", `Вы уверены, что хотите ${text}?`),
                Div("popup-confirm-space"),
                Div("popup-confirm-buttons", buttons),
            ]),
        ]);
    }
    ask() {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            document.body.appendChild(this.popup);
        });
    }
    result_yes() {
        document.body.removeChild(this.popup);
        if (this.resolve != null) {
            this.resolve(true);
            this.resolve = undefined;
        }
    }
    result_no() {
        document.body.removeChild(this.popup);
        if (this.resolve != null) {
            this.resolve(false);
            this.resolve = undefined;
        }
    }
}
