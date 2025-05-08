export interface EmotionType {
  id: string;
  name: string;
  color: string;
  emotionCategoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmotionTypeApi {
  data: EmotionType[];
  message: string;
  total: number;
}

export interface EmotionAddType {
  data: EmotionType;
  message: string;
}
