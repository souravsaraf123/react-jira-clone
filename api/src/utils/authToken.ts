import { ExpiredTokenError, InvalidTokenError } from './../errors/index';
import jwt, { SignOptions } from 'jsonwebtoken';

import { isPlainObject } from 'lodash';

export const signToken = (payload: object, options?: SignOptions): string =>
	jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: '180 days',
		...options,
	});

export const verifyToken = (token: string): { [key: string]: any } =>
{
	try
	{
		const payload = jwt.verify(token, process.env.JWT_SECRET);

		if (isPlainObject(payload))
		{
			return payload as { [key: string]: any };
		}
		throw new Error();
	}
	catch (error)
	{
		console.error('Error while verifying token : ', error);
		if (error instanceof jwt.TokenExpiredError)
		{
			console.error('Token expired');
			throw new ExpiredTokenError();
		}
		throw new InvalidTokenError();
	}
};
