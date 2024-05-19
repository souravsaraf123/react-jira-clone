import { createEntity, deleteEntity, findEntityOrThrow, updateEntity } from './../utils/typeorm';

import { Issue } from './../entities/index';
import { IssueStatus } from './../constants/issues';
import { catchErrors } from './../errors/index';
import { getConnection } from 'typeorm';

export const getProjectIssues = catchErrors(async (req: any, res: any) =>
{
	const { projectId } = req.currentUser;
	const { searchTerm } = req.query;

	let whereSQL = 'issue.projectId = :projectId';

	if (searchTerm)
	{
		whereSQL += ' AND (issue.title ILIKE :searchTerm OR issue.descriptionText ILIKE :searchTerm)';
	}

	const issues = await Issue.createQueryBuilder('issue')
		.select()
		.where(whereSQL, { projectId, searchTerm: `%${searchTerm}%` })
		.getMany();

	res.respond({ issues });
});

export const getIssueWithUsersAndComments = catchErrors(async (req, res: any) =>
{
	const issue = await findEntityOrThrow(Issue, req.params.issueId, {
		relations: ['users', 'comments', 'comments.user'],
	});
	res.respond(issue);
});

export const create = catchErrors(async (req, res: any) =>
{
	console.log('Create Issue Request : ', req.body);
	let createIssueRequest: Partial<Issue> = req.body;

	const listPosition = await calculateListPosition(createIssueRequest);
	createIssueRequest.status = IssueStatus.BACKLOG;
	createIssueRequest.listPosition = listPosition;

	const issueCreated = await createEntity(Issue, createIssueRequest);

	for (let userId of createIssueRequest.userIds)
	{
		await getConnection().createQueryBuilder().insert().into('issue_user').values({
			issueId: issueCreated.id,
			userId: userId,
		}).execute();
	}

	issueCreated.userIds = createIssueRequest.userIds;
	res.respond(issueCreated);
});

export const update = catchErrors(async (req, res: any) =>
{
	let issueRequest: Partial<Issue> = req.body;
	if ('status' in issueRequest)
	{
		issueRequest.listPosition = await calculateListPosition(issueRequest);
	}
	const issue = await updateEntity(Issue, req.params.issueId, req.body);
	res.respond(issue);
});

export const updateMultiple = catchErrors(async (req, res: any) =>
{
	console.log('Updating multiple issues');
	let issuesToUpdate: Partial<Issue>[] = req.body;
	let qr = getConnection().createQueryRunner();
	qr.startTransaction();
	try
	{
		for (let issue of issuesToUpdate)
		{
			await qr.manager.update(Issue, issue.id, issue);
		}
		qr.commitTransaction();
		res.respond(issuesToUpdate);
	}
	catch (error)
	{
		qr.rollbackTransaction();
		throw error;
	}
});

export const remove = catchErrors(async (req, res: any) =>
{
	const issue = await deleteEntity(Issue, req.params.issueId);
	res.respond({ issue });
});

const calculateListPosition = async ({ projectId, status }: Partial<Issue>): Promise<number> =>
{
	const issues = await Issue.find({
		where: { projectId, status },
		order: { listPosition: 'DESC' },
		take: 1,
	});

	if (issues.length == 0)
	{
		return 0;
	}
	else
	{
		return issues[0].listPosition + 1;
	}
};
