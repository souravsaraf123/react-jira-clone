import { NextFunction, Request, Response } from 'express';

export const addRespondToResponse = (req: Request, res: Response, next: NextFunction) =>
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
