import render_login from "./pages/login.js";
import render_home from "./pages/home.js"
import { Div, runPageCleanup, SetContent } from "./lib.js";
import { setUnauthorisedHandler } from "./api/api.js";
import { UnauthorisedError } from "./utils.js";

setUnauthorisedHandler(() =>
{
	toPage("login");
});

let curPage = "";
toPage("login");
export function toPage(page: "login" | "home")
{
	if (curPage == page) return;
	curPage = page;
	runPageCleanup();
	try
	{
		SetContent(document.body, Div("root", {
			"login": render_login,
			"home": render_home,
		}[page]()));
	} catch (err)
	{
		console.error(err);
		if (err instanceof UnauthorisedError) toPage("login");
		else SetContent(document.body, Div("root", "Всё сломалося, перезагрузите страницу"));
	}
}