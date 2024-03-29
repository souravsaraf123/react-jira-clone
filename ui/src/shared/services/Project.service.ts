import { Constants } from '../Constants';
import { ProjectDetails } from '../models/project.model';
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