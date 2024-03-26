import { catchErrors } from 'errors';
import createAccount from 'database/createGuestAccount';
import { signToken } from 'utils/authToken';

export const createGuestAccount = catchErrors(async (_req: any, res: any) =>
{
	const user = await createAccount();
	res.respond({
		authToken: signToken({ sub: user.id }),
	});
});
