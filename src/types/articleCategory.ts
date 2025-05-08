import { ArticleType } from "./article"

export interface ArticleCategoryType {
    id:  string  
    name: string
    description: string 
    ressources: ArticleType[]
}

export interface ArticleCategoryAddType
 {
  data: ArticleCategoryType,
  message: string
 }  

export interface ArticleCategoriesType {
    data: ArticleCategoryType[];
    message: string
    total: number;
  }