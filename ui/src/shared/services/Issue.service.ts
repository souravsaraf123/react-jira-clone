import { Issue, IssueWithUsersAndComments } from "../models/issue.model";

import axios from "axios";
import { handleApiError } from "../utils";

export async function updateIssues(token: string, issues: Partial<Issue>[])
{
	console.log('Update multiple issues request : ', issues);
	try
	{
		let response = await axios.put(`${import.meta.env.VITE_API_URL}/issues`, issues, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		});
		console.log('Update multiple issues response : ', response.data);
	}
	catch (error)
	{
		handleApiError(error);
	}
}

export async function createIssue(token: string, issue: Partial<Issue>)
{
	console.log('Create issue request : ', issue);
	try
	{
		let response = await axios.post(`${import.meta.env.VITE_API_URL}/issues`, issue, {
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
	console.log('Get issue by id request : ', issueId);
	try
	{
		let response = await axios.get(`${import.meta.env.VITE_API_URL}/issues/${issueId}`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		});
		console.log('Get issue response : ', response.data);
		return response.data;
	}
	catch (error)
	{
		handleApiError(error);
	}
}

export async function updateIssue(token: string, issueId: number, issue: Partial<IssueWithUsersAndComments>)
{
	console.log('Updating issue request : ', issueId, issue);
	try
	{
		let response = await axios.put(`${import.meta.env.VITE_API_URL}/issues/${issueId}`, issue, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		});
		console.log('Update issue response : ', response.data);
		return response.data as Issue;
	}
	catch (error)
	{
		handleApiError(error);
	}
}

// delete issue
export async function deleteIssue(token: string, issueId: number)
{
	console.log('Delete issue request : ', issueId);
	try
	{
		let response = await axios.delete(`${import.meta.env.VITE_API_URL}/issues/${issueId}`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		});
		console.log('Delete issue response : ', response.data);
	}
	catch (error)
	{
		handleApiError(error);
	}
}