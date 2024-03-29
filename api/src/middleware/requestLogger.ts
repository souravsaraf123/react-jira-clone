import { NextFunction, Request, Response } from 'express';

const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) =>
{
	console.log(`[${new Date().toISOString()}] Request received: ${req.method} ${req.path}`);
	// Log important parts of the request
	// console.log('Request method:', req.method);
	// console.log('Request path:', req.path);
	// console.log('Request url:', req.url);
	// console.log('Request headers:', req.headers);
	// console.log('Request body:', req.body);
	// console.log('Request query:', req.query);
	// console.log('Request params:', req.params);
	next();
};

export default requestLoggerMiddleware;