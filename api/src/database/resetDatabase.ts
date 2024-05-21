import { Connection } from 'typeorm';
import { Request } from 'express';

const resetDatabase = async (req: Request): Promise<void> =>
{
	const connection = req.dbConnection as Connection;
	await connection.dropDatabase();
	await connection.synchronize();
};

export default resetDatabase;
