import { catchErrors } from './../errors';

export const getCurrentUser = catchErrors((req: any, res: any) =>
{
	res.respond({ currentUser: req.currentUser });
});
