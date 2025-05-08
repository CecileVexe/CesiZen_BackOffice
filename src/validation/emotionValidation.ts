import { z } from "zod";

export const FormSchema = z.object({
  name: z.string({
    required_error: "Le nom est requis",
  }),
  emotionCategoryId: z.string({
    required_error: "La catégorie est requis",
  }),
  color: z.string({
    required_error: "La couleur est requis",
  }),
});
