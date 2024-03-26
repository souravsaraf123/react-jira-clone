import { InvalidTokenError, catchErrors } from 'errors';

import { Request } from 'express';
import { User } from 'entities';
import { verifyToken } from 'utils/authToken';

export const authenticateUser = catchErrors(async (req: any, _res, next) =>
{
	const token = getAuthTokenFromRequest(req);
	if (!token)
	{
		throw new InvalidTokenError('Authentication token not found.');
	}
	const userId = verifyToken(token).sub;
	if (!userId)
	{
		throw new InvalidTokenError('Authentication token is invalid.');
	}
	const user = await User.findOne(userId);
	if (!user)
	{
		throw new InvalidTokenError('Authentication token is invalid: User not found.');
	}
	req.currentUser = user;
	next();
});

const getAuthTokenFromRequest = (req: Request): string | null =>
{
	const header = req.get('Authorization') || '';
	const [bearer, token] = header.split(' ');
	return bearer === 'Bearer' && token ? token : null;
};
