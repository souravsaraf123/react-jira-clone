import { Request, Response } from 'express';
import { findEntityOrThrow, updateEntity } from './../utils/typeorm';

import { Project } from './../entities/index';
import { catchErrors } from './../errors/index';
import { issuePartial } from './../serializers/issues';

export const getProjectWithUsersAndIssues = catchErrors(async (req: Request, res: Response) =>
{
	const project = await findEntityOrThrow(Project, req.currentUser.projectId, {
		relations: ['users', 'issues'],
	});
	res.respond({
		project: {
			...project,
			issues: project.issues.map(issuePartial),
		},
	});
});

export const update = catchErrors(async (req: Request, res: Response) =>
{
	const project = await updateEntity(Project, req.currentUser.projectId, req.body);
	res.respond({ project });
});
