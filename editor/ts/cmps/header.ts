import { query_logout, type User } from "../api/auth.js";
import { $, Button, Div, initEl, injectStyles, Span } from "../lib.js";
import Spinner from "./spinner.js";

export default function Header(user: User, title: string)
{
	const logout = query_logout();

	return Div(styles.root, [
		$(logout, s => s.isLoading && Spinner()),
		Button([], "Домик"),
		initEl("h1", [], title),
		Div(styles.user, [
			Span([], user.username),
			Button([], "Выйти", logout.v.fetch),
		]),
	]);
}

const styles = injectStyles({
	root: {
		backgroundColor: "var(--c-back2)",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "1em",
		width: "100%",
		position: "sticky",
		top: 0,
		zIndex: 999,
		borderRadius: "0 0 1em 1em",
	},
	user: {
		display: "flex",
		alignItems: "center",
		gap: "0.5em",
	},
});