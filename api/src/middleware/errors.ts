import { CustomError } from './../errors/index';
import { ErrorRequestHandler } from 'express';
import { pick } from 'lodash';

export const handleError: ErrorRequestHandler = (error, _req, res, _next) =>
{
	console.error(error);

	const isErrorSafeForClient = error instanceof CustomError;

	const clientError = isErrorSafeForClient
		? pick(error, ['message', 'code', 'status', 'data'])
		: {
			message: 'Something went wrong, please contact our support.',
			code: 'INTERNAL_ERROR',
			status: 500,
			data: {},
		};

	console.log('Error Response : ', {
		code: clientError.status,
		...clientError
	});

	res.status(clientError.status).send({ error: clientError });
};
