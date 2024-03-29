import { GUEST_EMAIL } from './../constants/user';
import User from './../entities/User';
import { catchErrors } from './../errors';
import createAccount from './../database/createGuestAccount';
import { signToken } from './../utils/authToken';

export const createGuestAccount = catchErrors(async (_req: any, res: any) =>
{
	// Check if guest user already exists
	const guestUser = await User.findOne({
		where: { email: GUEST_EMAIL },
	});
	if (guestUser)
	{
		res.respond({
			msg: 'Guest user already exists',
			authToken: signToken({ sub: guestUser.id }),
		});
		return;
	}

	// Else Create seed data and respond with guest user auth token
	const user = await createAccount();
	res.respond({
		msg: 'Seed data created successfully',
		currentUser: user,
		authToken: signToken({ sub: user.id }),
	});
});