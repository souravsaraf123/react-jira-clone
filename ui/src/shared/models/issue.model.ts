import { DropdownOption } from "./dropdownOption.model";
import { User } from "./user.model";

export enum IssueType
{
	task = 'task',
	bug = 'bug',
	story = 'story',
}

export enum IssueStatus
{
	backlog = 'backlog',
	selected = 'selected',
	inprogress = 'inprogress',
	done = 'done',
}

export const IssueStatusOrdering: Record<number, IssueStatus> = {
	1: IssueStatus.backlog,
	2: IssueStatus.selected,
	3: IssueStatus.inprogress,
	4: IssueStatus.done,
}

export enum IssuePriority
{
	highest = '5',
	high = '4',
	medium = '3',
	low = '2',
	lowest = '1',
}

export const IssuePriorityLabel = {
	[IssuePriority.highest]: 'Highest',
	[IssuePriority.high]: 'High',
	[IssuePriority.medium]: 'Medium',
	[IssuePriority.low]: 'Low',
	[IssuePriority.lowest]: 'Lowest',
}

export interface Issue
{
	id: number;
	title: string;
	type: IssueType;
	status: IssueStatus;
	priority: IssuePriority;
	listPosition: number;
	description: string | null;
	descriptionText: string | null;
	estimate: number | null;
	timeSpent: number | null;
	timeRemaining: number | null;
	createdAt: string;
	updatedAt: string;
	reporterId: number;
	projectId: number;
	userIds: number[];
}

export interface IssueWithUsersAndComments extends Issue
{
	users: User[],
	comments: Comment[],
}

// Convert the ProjectCategory enum to an array of objects for the Select component
export const issueTypeOptions: DropdownOption[] = Object.values(IssueType).map((c) =>
{
	return { value: c, label: c.charAt(0).toUpperCase() + c.slice(1) };
});