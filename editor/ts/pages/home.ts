import Header from "../cmps/header.js";
import Spinner from "../cmps/spinner.js";
import { toPage } from "../index.js";
import { $, Div } from "../lib.js";
import { use_user } from "../utils.js";

export default function render()
{
	const user = use_user();
	return [
		Header(user, ""),
	]
}