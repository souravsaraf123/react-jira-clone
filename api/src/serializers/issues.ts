import { pick } from 'lodash';

import { Issue } from './../entities/index';

export const issuePartial = (issue: Issue): Partial<Issue> =>
  pick(issue, [
    'id',
    'title',
    'type',
    'status',
    'priority',
    'listPosition',
    'createdAt',
    'updatedAt',
    'userIds',
  ]);
