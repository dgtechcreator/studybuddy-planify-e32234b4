export type TopicType = "written" | "practical";

export interface Topic {
  id: string;
  name: string;
  completed: boolean;
  topic_type: TopicType;
}

export interface Chapter {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}
