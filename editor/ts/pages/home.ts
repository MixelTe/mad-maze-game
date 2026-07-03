import { query_user } from "../api/auth.js";
import Header from "../cmps/header.js";
import Spinner from "../cmps/spinner.js";
import { toPage } from "../index.js";
import { $, Div } from "../lib.js";

export default function render()
{
	const user = query_user();
	$(user, u =>
	{
		if (u.isLoading) return;
		if (!u.data) toPage("login");
	});
	if (!user.v.data) return Spinner();
	return [
		Header(user.v.data, ""),
	]
}