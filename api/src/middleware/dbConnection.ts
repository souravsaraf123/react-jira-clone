import { NextFunction, Request, Response } from 'express';

import createDatabaseConnection from './../database/createConnection';

const dbConnectionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	await createDatabaseConnection();
	next();
};

export default dbConnectionMiddleware;