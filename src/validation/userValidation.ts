import { z } from "zod";

export const FormSchema = z.object({
  name: z.string({
    required_error: "Le nom est requis",
  }),
  surname: z.string({
    required_error: "Le prénom est requis",
  }),
  email: z.string({
    required_error: "L'email est requis",
  }),
  password: z.any(),
  roleId: z.string().optional(),
});
