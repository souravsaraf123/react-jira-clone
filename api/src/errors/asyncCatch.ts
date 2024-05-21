import { NextFunction, Request, Response } from 'express';

type RH = (_req: Request, _res: Response, _next: NextFunction) => void;

export const catchErrors = (requestHandler: any): any =>
{
	return async (req: Request, res: Response, next: NextFunction): Promise<any> =>
	{
		try
		{
			return await requestHandler(req, res, next);
		} catch (error)
		{
			next(error);
		}
	};
};
