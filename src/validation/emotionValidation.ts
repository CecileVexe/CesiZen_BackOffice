import { z } from "zod";

export const FormSchema = z.object({
  name: z.string({
    error: "Le nom est requis",
  }),
  emotionCategoryId: z.string({
    error: "La catégorie est requis",
  }),
  color: z.string({
    error: "La couleur est requis",
  }),
});
