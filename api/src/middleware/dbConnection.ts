import { NextFunction, Request, Response } from 'express';

import createDatabaseConnection from './../database/createConnection';

const dbConnectionMiddleware = async (req: Request, res: Response, next: NextFunction) =>
{
	let dbConnectionPerApi = await createDatabaseConnection();
	req.dbConnection = dbConnectionPerApi;
	next();
};

export default dbConnectionMiddleware;