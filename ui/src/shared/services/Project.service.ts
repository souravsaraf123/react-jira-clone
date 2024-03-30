import { Project, ProjectDetails } from '../models/project.model';
import { delay, handleApiError } from '../utils';

import { Constants } from '../Constants';
import axios from 'axios';

export async function getProjectDetails(token: string)
{
	try
	{
		await delay(10000);
		let response = await axios.get(`${Constants.API_URL}/project`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		});
		let { users, issues, ...project } = (await response.data).project;
		console.log('Project : ', project);
		console.log('Users : ', users);
		console.log('Issues : ', issues);

		let projectDetails: ProjectDetails = {
			project: project,
			users: users,
			issues: issues,
		};

		return projectDetails;
	}
	catch (error)
	{
		handleApiError(error);
	}
}

export async function updateProject(token: string, project: Project)
{
	try
	{
		await delay(5000);
		let response = await axios.put(`${Constants.API_URL}/project`, project, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		});
		console.log('Project updated : ', response.data);
	}
	catch (error)
	{
		handleApiError(error);
	}
}