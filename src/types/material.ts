
export type MaterialType = 'video' | 'article' | 'course' | 'ebook';

export interface Material {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  url?: string;
  dateAdded: Date;
}
