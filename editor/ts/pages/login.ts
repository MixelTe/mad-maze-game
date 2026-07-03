import { query_auth, query_user } from "../api/auth.js";
import Spinner from "../cmps/spinner.js";
import { toPage } from "../index.js";
import { $, Button, Div, elRef, H1, If, initEl, Input } from "../lib.js";

export default function render()
{
	const user = query_user();
	const auth = query_auth();
	const inp_login = elRef<HTMLInputElement>();
	const inp_pass = elRef<HTMLInputElement>();

	$(user, u =>
	{
		if (u.data) toPage("home");
	});

	return Div("login", initEl("form", "form", [
		H1([], "Вход"),
		initEl("h2", [], "Только признанным творцам позволенно войти"),
		$(user, s => s.isLoading && Spinner()),
		$(auth, s => s.isLoading && Spinner()),
		$(auth, s => s.error?.msg && initEl("h2", "error", s.error.msg)),
		Input([], "text", "Логин", inp_login.set),
		Input([], "password", "Пароль", inp_pass.set),
		Button([], "Войти", async () =>
		{
			const r = await auth.v.fetch(inp_login.el.value, inp_pass.el.value);
			console.log(r);
		}),
	]));
}
