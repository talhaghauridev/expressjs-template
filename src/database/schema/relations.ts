import { defineRelations } from 'drizzle-orm';
import * as schema from './index';

export const relations = defineRelations(schema, (r) => ({
  sessions: {
    user: r.one.users({
      from: r.sessions.userId,
      to: r.users.id,
    }),
  },
  users: {
    sessions: r.many.sessions(),
    locations: r.many.userLocations(),
    verifications: r.many.verifications(),
  },
  userLocations: {
    user: r.one.users({
      from: r.userLocations.userId,
      to: r.users.id,
    }),
  },
  verifications: {
    user: r.one.users({
      from: r.verifications.userId,
      to: r.users.id,
    }),
  },
}));
