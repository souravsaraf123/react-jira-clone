import { Request, Response } from 'express';

import { catchErrors } from './../errors';
import createTestAccount from './../database/createTestAccount';
import resetTestDatabase from './../database/resetDatabase';
import { signToken } from './../utils/authToken';

export const resetDatabase = catchErrors(async (req: Request, res: Response) =>
{
	await resetTestDatabase(req);
	res.respond(true);
});

export const createAccount = catchErrors(async (req: Request, res: Response) =>
{
	const user = await createTestAccount();
	res.respond({
		authToken: signToken({ sub: user.id }),
	});
});
