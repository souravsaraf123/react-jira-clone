import { createEntity, deleteEntity, findEntityOrThrow, updateEntity } from './../utils/typeorm';

import { Issue } from './../entities/index';
import { catchErrors } from './../errors/index';

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
	res.respond({ issue });
});

export const create = catchErrors(async (req, res: any) =>
{
	const listPosition = await calculateListPosition(req.body);
	const issue = await createEntity(Issue, { ...req.body, listPosition });
	res.respond({ issue });
});

export const update = catchErrors(async (req, res: any) =>
{
	const issue = await updateEntity(Issue, req.params.issueId, req.body);
	res.respond({ issue });
});

export const remove = catchErrors(async (req, res: any) =>
{
	const issue = await deleteEntity(Issue, req.params.issueId);
	res.respond({ issue });
});

const calculateListPosition = async ({ projectId, status }: Issue): Promise<number> =>
{
	const issues = await Issue.find({
		where: { projectId, status }
	});

	const listPositions = issues.map(({ listPosition }) => listPosition);

	if (listPositions.length > 0)
	{
		return Math.min(...listPositions) - 1;
	}
	return 1;
};
