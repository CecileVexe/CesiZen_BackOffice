export interface ArticleCategoryType {
  id: string;
  name: string;
  description: string;
}

export interface ArticleCategoryAddType {
  data: ArticleCategoryType;
  message: string;
}

export interface ArticleCategoriesType {
  data: ArticleCategoryType[];
  message: string;
  total: number;
}
