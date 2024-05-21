import { Request, Response } from 'express';
import { createEntity, deleteEntity, findEntityOrThrow, updateEntity } from './../utils/typeorm';

import { Connection } from 'typeorm';
import { Issue } from './../entities/index';
import { IssueStatus } from './../constants/issues';
import { catchErrors } from './../errors/index';

export const getProjectIssues = catchErrors(async (req: Request, res: Response) =>
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

export const getIssueWithUsersAndComments = catchErrors(async (req: Request, res: Response) =>
{
	const issue = await findEntityOrThrow(Issue, req.params.issueId, {
		relations: ['users', 'comments', 'comments.user'],
	});
	res.respond(issue);
});

export const create = catchErrors(async (req: Request, res: Response) =>
{
	console.log('Create Issue Request : ', req.body);
	let createIssueRequest: Partial<Issue> = req.body;

	const listPosition = await calculateListPosition(createIssueRequest);
	createIssueRequest.status = IssueStatus.BACKLOG;
	createIssueRequest.listPosition = listPosition;

	const issueCreated = await createEntity(Issue, createIssueRequest);

	for (let userId of createIssueRequest.userIds)
	{
		let conn = req.dbConnection as Connection;
		await conn.createQueryBuilder().insert().into('issue_user').values({
			issueId: issueCreated.id,
			userId: userId,
		}).execute();
	}

	issueCreated.userIds = createIssueRequest.userIds;
	res.respond(issueCreated);
});

export const update = catchErrors(async (req: Request, res: Response) =>
{
	let issueRequest: Partial<Issue> = req.body;
	if ('status' in issueRequest)
	{
		issueRequest.listPosition = await calculateListPosition(issueRequest);
	}
	const issue = await updateEntity(Issue, req.params.issueId, req.body);
	res.respond(issue);
});

export const updateMultiple = catchErrors(async (req: Request, res: Response) =>
{
	console.log('Updating multiple issues');
	let issuesToUpdate: Partial<Issue>[] = req.body;
	let conn = req.dbConnection as Connection;
	let qr = conn.createQueryRunner();
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

export const remove = catchErrors(async (req: Request, res: Response) =>
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
