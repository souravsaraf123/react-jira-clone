import * as entities from './../entities/index';

import { Connection, createConnection } from 'typeorm';

import crypto from 'crypto';

const createDatabaseConnection = (): Promise<Connection> => {
	console.log('process.env.DB_DATABASE : ', process.env.DB_DATABASE);
	return createConnection({
		type: 'postgres',
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		schema: process.env.DB_SCHEMA,
		entities: Object.values(entities),
		synchronize: false,
		name: crypto.randomUUID(),
	});
};

export default createDatabaseConnection;
