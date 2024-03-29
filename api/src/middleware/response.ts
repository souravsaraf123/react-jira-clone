import { RequestHandler } from 'express';

export const addRespondToResponse: RequestHandler = (_req, res: any, next) =>
{
	res.respond = (data): void =>
	{
		console.log('Success Response : ', {
			code: 200,
			...data
		});
		res.status(200).send(data);
	};
	next();
};
