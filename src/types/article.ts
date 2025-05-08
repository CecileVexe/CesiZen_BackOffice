import { ArticleCategoryType } from "./articleCategory";

export interface ArticleType {
  id: number;
  title: string;
  description: string;
  content: string;
  category: ArticleCategoryType;
  categoryId: string;
  banner: Blob;
  readingTime: number;
}

export interface ArticleAddType {
  data: ArticleType;
  message: string;
}
export interface ArticlesType {
  data: ArticleType[];
  message: string;
  total: number;
}
