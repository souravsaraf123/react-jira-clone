import { Constants } from '../Constants';
import { ProjectDetails } from '../models/project.model';

export async function getProjectDetails(token: string)
{
	let response = await fetch(`${Constants.API_URL}/project`, {
		method: "GET",
		headers: new Headers({
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`,
		}),
	});
	let { users, issues, ...project } = (await response.json()).project;
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