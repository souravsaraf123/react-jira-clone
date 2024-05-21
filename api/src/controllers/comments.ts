import { Request, Response } from 'express';
import { createEntity, deleteEntity, updateEntity } from './../utils/typeorm';

import { Comment } from './../entities/index';
import { catchErrors } from './../errors/index';

export const create = catchErrors(async (req: Request, res: Response) =>
{
	const comment = await createEntity(Comment, req.body);
	res.respond(comment);
});

export const update = catchErrors(async (req: Request, res: Response) =>
{
	const comment = await updateEntity(Comment, req.params.commentId, req.body);
	res.respond(comment);
});

export const remove = catchErrors(async (req: Request, res: Response) =>
{
	const comment = await deleteEntity(Comment, req.params.commentId);
	res.respond(comment);
});
