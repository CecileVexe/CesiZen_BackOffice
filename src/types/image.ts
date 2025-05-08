import { ArticleType } from "./article";

export interface ImageType {
  id: string;
  url: Blob;
  article: ArticleType[];
}
