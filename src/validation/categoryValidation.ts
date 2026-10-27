import { z } from "zod";

export const FormSchema = z.object({
  name: z.string({
    error: "Le nom est requis",
  }),
  description: z.string({
    error: "La description est requise",
  }),
});
