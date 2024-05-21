import { UserComment } from "../models/userComment.model";
import axios from "axios";
import { handleApiError } from "../utils";

// create comment
export async function createComment(token: string, comment: Partial<UserComment>)
{
	console.log('Create UserComment request : ', comment);
	try
	{
		let response = await axios.post(`${import.meta.env.VITE_API_URL}/comments`, comment, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		});
		console.log('Create UserComment Response : ', response.data);
		return response.data as UserComment;
	}
	catch (error)
	{
		handleApiError(error);
	}
}

// update comment
export async function updateComment(token: string, commentId: number, comment: Partial<UserComment>)
{
	console.log('Update UserComment request : ', comment);
	try
	{
		let response = await axios.put(`${import.meta.env.VITE_API_URL}/comments/${commentId}`, comment, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		});
		console.log('Update UserComment Response : ', response.data);
		return response.data as UserComment;
	}
	catch (error)
	{
		handleApiError(error);
	}
}

// delete comment
export async function deleteComment(token: string, commentId: number)
{
	console.log('Delete UserComment request : ', commentId);
	try
	{
		let response = await axios.delete(`${import.meta.env.VITE_API_URL}/comments/${commentId}`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		});
		console.log('Delete UserComment Response : ', response);
		return response.data as any;
	}
	catch (error)
	{
		handleApiError(error);
	}
}