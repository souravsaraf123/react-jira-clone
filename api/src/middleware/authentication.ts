import { InvalidTokenError, catchErrors } from './../errors/index';
import { NextFunction, Request, Response } from 'express';

import { User } from './../entities/index';
import { verifyToken } from './../utils/authToken';

export const authenticateUser = catchErrors(async (req: Request, res: Response, next: NextFunction) =>
{
	console.log('Authenticating user');

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
	const user = await User.findOne({
		where: { id: userId },
	});
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
