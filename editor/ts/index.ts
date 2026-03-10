import render_login from "./pages/login.js";
import { Div, SetContent } from "./utils.js";

toPage("login");
function toPage(page: "login")
{
	SetContent(document.body, Div("root", {
		"login": render_login,
	}[page]()));
}