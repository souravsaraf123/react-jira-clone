import 'dotenv/config';
import 'reflect-metadata';

import { attachPrivateRoutes, attachPublicRoutes } from './routes';

import { RouteNotFoundError } from './errors/index';
import { addRespondToResponse } from './middleware/response';
import { authenticateUser } from './middleware/authentication';
import cors from 'cors';
import createDatabaseConnection from './database/createConnection';
import express from 'express';
import { handleError } from './middleware/errors';
import requestLoggerMiddleware from './middleware/requestLogger';

const establishDatabaseConnection = async (): Promise<void> =>
{
	try
	{
		await createDatabaseConnection();
	}
	catch (error)
	{
		console.log(error);
		throw error;
	}
};

const initializeExpress = (): void =>
{
	console.log('Initializing express app');
	const app = express();

	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(requestLoggerMiddleware);

	app.use(addRespondToResponse);

	attachPublicRoutes(app);

	app.use('/', authenticateUser);

	attachPrivateRoutes(app);

	app.use((req, _res, next) => next(new RouteNotFoundError(req.originalUrl)));
	app.use(handleError);

	app.listen(process.env.PORT || 3000);
};

const initializeApp = async (): Promise<void> =>
{
	console.log('Initializing app');
	await establishDatabaseConnection();
	console.log('Database connection established');
	initializeExpress();
	console.log('Express app initialized');
};

initializeApp().catch(console.error);
