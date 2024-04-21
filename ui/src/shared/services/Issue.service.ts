import { Constants } from "../Constants";
import { Issue } from "../models/issue.model";
import axios from "axios";
import { handleApiError } from "../utils";

export async function updateIssues(token: string, issues: Partial<Issue>[])
{
	console.log('Updating issues : ', issues);
	try
	{
		let response = await axios.put(`${Constants.API_URL}/issues`, issues, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		});
		console.log('Issues updated : ', response.data);
	}
	catch (error)
	{
		handleApiError(error);
	}
}