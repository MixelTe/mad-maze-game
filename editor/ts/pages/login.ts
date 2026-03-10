import { Button, Div, H1, initEl, Input } from "../utils.js";

export default function render()
{
	return Div("login", Div("form", [
		H1([], "Вход"),
		initEl("h2", [], "Только признанным творцам позволенно войти"),
		Input([], "text", "Логин"),
		Input([], "password", "Пароль"),
		Button([], "Войти")
	]));
}
