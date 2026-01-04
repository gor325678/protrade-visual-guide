
export type MaterialType = 'video' | 'article' | 'course' | 'ebook' | 'image';

export interface Material {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  url?: string;
  imageUrl?: string;
  dateAdded: Date;
}

export interface ModuleChange {
  date: Date;
  previousTitle?: string;
  previousTopics?: string[];
  changedBy?: string; // Could be used for user identification in the future
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  topics: string[]; // This might need to be optional if not in DB, or handled
  history?: ModuleChange[];
  is_published?: boolean;
  created_at?: string;
}
