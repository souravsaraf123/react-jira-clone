import { Issue, IssueWithUsersAndComments } from "../models/issue.model";

import { Constants } from "../Constants";
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

export async function createIssue(token: string, issue: Partial<Issue>)
{
	console.log('Creating issue from request : ', issue);
	try
	{
		let response = await axios.post(`${Constants.API_URL}/issues`, issue, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		});
		console.log('Create Issue Response : ', response);
		return response.data as Issue;
	}
	catch (error)
	{
		handleApiError(error);
	}
}

export async function getIssue(token: string, issueId: number): Promise<IssueWithUsersAndComments>
{
	console.log('Getting issue : ', issueId);
	try
	{
		let response = await axios.get(`${Constants.API_URL}/issues/${issueId}`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		});
		console.log('Issue fetched : ', response.data);
		return response.data;
	}
	catch (error)
	{
		handleApiError(error);
	}
}

export async function updateIssue(token: string, issueId: number, issue: Partial<Issue>)
{
	console.log('Updating issue : ', issueId, issue);
	try
	{
		let response = await axios.put(`${Constants.API_URL}/issues/${issueId}`, issue, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		});
		console.log('Issue updated : ', response.data);
	}
	catch (error)
	{
		handleApiError(error);
	}
}