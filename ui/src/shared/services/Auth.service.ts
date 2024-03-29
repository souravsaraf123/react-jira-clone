import { Constants } from "../Constants";
import { LoginResponse } from "../models/user.model";
import axios from "axios";
import { handleApiError } from "../utils";

export async function seedData()
{
	try
	{
		let response = await axios.post<LoginResponse>(`${Constants.API_URL}/seedData`, {}, {
			headers: {
				"Content-Type": "application/json"
			}
		});
		let userDetails = response.data;
		console.log('User details : ', userDetails);

		return userDetails;
	}
	catch (error)
	{
		handleApiError(error);
	}
}