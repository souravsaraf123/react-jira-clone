import { RequestHandler } from 'express';

export const addRespondToResponse: RequestHandler = (_req, res: any, next) =>
{
	res.respond = (data): void =>
	{
		res.status(200).send(data);
	};
	next();
};
