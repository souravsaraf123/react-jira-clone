import { Constants } from "../Constants";
import { LoginResponse } from "../models/user.model";

export async function seedData()
{
	let response = await fetch(`${Constants.API_URL}/seedData`, {
		method: "POST",
		headers: new Headers({
			"Content-Type": "application/json",
		}),
	});
	let userDetails: LoginResponse = await response.json();
	console.log('User details : ', userDetails);

	return userDetails;
}