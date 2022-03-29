// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Comment, User, TimelineItem } = initSchema(schema);

export {
  Comment,
  User,
  TimelineItem
};