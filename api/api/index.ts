import 'reflect-metadata';

import { attachPrivateRoutes, attachPublicRoutes } from '../src/routes';

import { RouteNotFoundError } from '../src/errors/index';
import { addRespondToResponse } from '../src/middleware/response';
import { authenticateUser } from '../src/middleware/authentication';
import cors from 'cors';
import dbConnectionMiddleware from '../src/middleware/dbConnection';
import express from 'express';
import { handleError } from '../src/middleware/errors';
import requestLoggerMiddleware from '../src/middleware/requestLogger';

console.log('Initializing express app');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(requestLoggerMiddleware);
app.use(dbConnectionMiddleware);
app.use(addRespondToResponse);
attachPublicRoutes(app);
app.use('/', authenticateUser);
attachPrivateRoutes(app);
app.use((req, _res, next) => next(new RouteNotFoundError(req.originalUrl)));
app.use(handleError);

export default app;
