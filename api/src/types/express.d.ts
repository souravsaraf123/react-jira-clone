import { Connection } from 'typeorm';

declare global
{
	namespace Express
	{
		export interface Response
		{
			respond: (data: any) => void;
		}
		export interface Request
		{
			dbConnection: Connection;
			currentUser: import('entities').User;
		}
	}
}