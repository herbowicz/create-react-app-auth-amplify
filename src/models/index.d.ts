import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";



export declare class Comment {
  readonly id: string;
  readonly body?: string;
  readonly user?: User;
  readonly timelineitemID?: string;
  constructor(init: ModelInit<Comment>);
  static copyOf(source: Comment, mutator: (draft: MutableModel<Comment>) => MutableModel<Comment> | void): Comment;
}

export declare class User {
  readonly id: string;
  readonly username?: string;
  readonly profilePic?: string;
  constructor(init: ModelInit<User>);
  static copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

export declare class TimelineItem {
  readonly id: string;
  readonly description?: string;
  readonly postTime?: string;
  readonly source?: string;
  readonly author?: User;
  readonly Comments?: Comment[];
  constructor(init: ModelInit<TimelineItem>);
  static copyOf(source: TimelineItem, mutator: (draft: MutableModel<TimelineItem>) => MutableModel<TimelineItem> | void): TimelineItem;
}