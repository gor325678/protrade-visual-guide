
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

export interface CourseModule {
  id: string;
  title: string;
  topics: string[];
}

