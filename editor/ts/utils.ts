import { toPage } from "./index.js";
import { query_user } from "./api/auth.js";
import { $ } from "./lib.js";

export class UnauthorisedError extends Error { }

export function use_user()
{
	const user = query_user();
	$(user, u =>
	{
		if (u.isLoading) return;
		if (!u.data) toPage("login");
	});
	if (!user.v.data) throw new UnauthorisedError();
	return user.v.data;
}
