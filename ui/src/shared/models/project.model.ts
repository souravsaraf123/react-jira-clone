import { Issue } from "./issue.model";
import { User } from "./user.model";

export enum ProjectCategory
{
	software = 'software',
	marketing = 'marketing',
	business = 'business',
}

export interface Project
{
	id: number,
	name: string,
	url: string,
	description: string,
	category: ProjectCategory,
	createdAt: string,
	updatedAt: string,
}

export interface ProjectDetails
{
	project: Project,
	users: User[],
	issues: Issue[],
}