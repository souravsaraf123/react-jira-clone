import { Request, Response } from 'express';

import { catchErrors } from './../errors';

export const getCurrentUser = catchErrors((req: Request, res: Response) =>
{
	res.respond({ currentUser: req.currentUser });
});
