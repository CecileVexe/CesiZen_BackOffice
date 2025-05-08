import { ArticleCategoryType } from "./articleCategory";
import { ImageType } from "./image";

export interface ArticleType {
    id: number;
    title: string;
    description: string;
    content: string;
    category: ArticleCategoryType;
    categoryId: string
    banner: ImageType;
    bannerId: string; 
  }

export interface ArticleAddType
 {
  data: ArticleType,
  message: string
 }  
export interface ArticlesType {
    data: ArticleType[];
    message: string
    total: number;
  }