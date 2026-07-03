import render_login from "./pages/login.js";
import render_home from "./pages/home.js"
import { Div, runPageCleanup, SetContent } from "./lib.js";

toPage("login");
export function toPage(page: "login" | "home")
{
	runPageCleanup();
	SetContent(document.body, Div("root", {
		"login": render_login,
		"home": render_home,
	}[page]()));
}