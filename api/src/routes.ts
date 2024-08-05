import * as authentication from './controllers/seedData';
import * as comments from './controllers/comments';
import * as issues from './controllers/issues';
import * as projects from './controllers/projects';
import * as test from './controllers/test';
import * as users from './controllers/users';

import { Express, Request, Response } from 'express';

export const attachPublicRoutes = (app: Express): void =>
{
	if (process.env.NODE_ENV === 'test')
	{
		app.delete('/test/reset-database', test.resetDatabase);
		app.post('/test/create-account', test.createAccount);
	}

	app.get('/cronJob', authentication.createGuestAccount);
	app.post('/seedData', authentication.createGuestAccount);
	app.get('/api', (req: Request, res: Response) =>
	{
		process.argv.forEach((val, index) =>
		{
			console.log(`${index}: ${val}`);
		});
		res.send('Hello From SS Jira Api');
	});
};

export const attachPrivateRoutes = (app: Express): void =>
{
	app.post('/comments', comments.create);
	app.put('/comments/:commentId', comments.update);
	app.delete('/comments/:commentId', comments.remove);

	app.get('/issues', issues.getProjectIssues);
	app.get('/issues/:issueId', issues.getIssueWithUsersAndComments);
	app.post('/issues', issues.create);
	app.put('/issues/:issueId', issues.update);
	app.put('/issues/', issues.updateMultiple);
	app.delete('/issues/:issueId', issues.remove);

	app.get('/project', projects.getProjectWithUsersAndIssues);
	app.put('/project', projects.update);

	app.get('/currentUser', users.getCurrentUser);
};
