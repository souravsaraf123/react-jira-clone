import 'dotenv/config';
import 'reflect-metadata';

import { attachPrivateRoutes, attachPublicRoutes } from './routes';

import { RouteNotFoundError } from './errors/index';
import { addRespondToResponse } from './middleware/response';
import { authenticateUser } from './middleware/authentication';
import cors from 'cors';
import { createConnection } from 'typeorm';
import express from 'express';
import { handleError } from './middleware/errors';

const establishDatabaseConnection = async (): Promise<void> =>
{
	try
	{
		console.log('Establishing database connection');
		console.log('DB_HOST:', process.env.DB_HOST);
		console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
		let conn = await createConnection({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			entities: [],
			synchronize: true,
		});
		console.log(`Connected to ${conn.options.type} database`);
		let result = await conn.query('SELECT 1');
		console.log('Result:', result);
	}
	catch (error)
	{
		console.log(error);
	}
};

const initializeExpress = (): void =>
{
	console.log('Initializing express app');
	const app = express();

	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded());

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
