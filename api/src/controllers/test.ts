import { catchErrors } from 'errors';
import createTestAccount from 'database/createTestAccount';
import resetTestDatabase from 'database/resetDatabase';
import { signToken } from 'utils/authToken';

export const resetDatabase = catchErrors(async (_req, res: any) =>
{
	await resetTestDatabase();
	res.respond(true);
});

export const createAccount = catchErrors(async (_req, res: any) =>
{
	const user = await createTestAccount();
	res.respond({
		authToken: signToken({ sub: user.id }),
	});
});
