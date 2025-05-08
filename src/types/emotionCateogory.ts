export interface EmotionCategory {
  id: number;
  name: string;
  color: string;
  smiley: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmotionCategoryAddType
 {
  data: EmotionCategory,
  message: string
 }  

export interface EmotionCategoryApi {
    data: EmotionCategory[];
    message: string
    total: number;
  }