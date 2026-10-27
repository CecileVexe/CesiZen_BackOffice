import { z } from "zod";

export const FormSchema = z.object({
  name: z.string({
    error: "Le nom est requis",
  }),
  surname: z.string({
    error: "Le prénom est requis",
  }),
  email: z.string({
    error: "L'email est requis",
  }),
  password: z.any(),
  roleId: z.string().optional(),
});
