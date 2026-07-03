import { query, QueryCache } from "./api.js";
import { fetchJsonPost, fetchJsonGet, fetchPost, fetchJsonDelete, fetchJsonPatch, FetchError } from "../lib.js";

export interface User
{
	username: string
}


export const query_auth = () => query(
    null,
    async (login: string, password: string) =>
    {
        const r = await fetchJsonPost<User>("/api/login", { login, password });
        QueryCache.set("user", r);
        return r;
    }
);

export const query_logout = () => query(
    null,
    async () =>
    {
        try {
			await fetchPost("/api/logout");
		} finally
		{
			QueryCache.del("user");
			return true;
		}
    }
);

export const query_user = () => query(
    "user",
    async () =>
    {
        const user = await fetchJsonGet<User>("/api/me");
        return user;
    },
    []
);
