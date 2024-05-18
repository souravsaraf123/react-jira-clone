import { Project, ProjectDetails } from '../models/project.model';

import { Constants } from '../Constants';
import axios from 'axios';
import { handleApiError } from '../utils';

export async function getProjectDetails(token: string)
{
	try
	{
		let response = await axios.get(`${Constants.API_URL}/project`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
		});
		console.log('Project Details Api response : ', response.data);
		let { users, issues, ...project } = (await response.data).project;

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