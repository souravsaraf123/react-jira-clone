import { Issue } from "./issue.model";
import { User } from "./user.model";

export interface Project
{
	id: number,
	name: string,
	url: string,
	description: string,
	category: ProjectCategory,
	createdAt: string,
	updatedAt: string,
	users: User[],
	issues: Issue[],
}

export enum ProjectCategory
{
	software = 'software',
	marketing = 'marketing',
	business = 'business',
}
