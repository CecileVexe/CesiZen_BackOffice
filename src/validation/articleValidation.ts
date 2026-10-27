import { z, ZodType } from "zod";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 Mo
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const FormSchemaArticle: ZodType<unknown> = z.object({
  title: z.string({
    error: "Le titre est requise",
  }),
  description: z.string({
    error: "La description est requise",
  }),
  content: z.string({
    error: "Le contenue est requise",
  }),
  categoryId: z.string({
    error: "La catégorie est requise",
  }),
  readingTime: z.coerce.number({
    error: "Le temps de lecture est requise",
  }),
  banner: z
    .any()
    .optional()
    .refine(
      (file) =>
        file?.length == 1
          ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type)
            ? true
            : false
          : true,
      "Invalid file. choose either JPEG or PNG image"
    )
    .refine(
      (file) =>
        file?.length == 1
          ? file[0]?.size <= MAX_FILE_SIZE
            ? true
            : false
          : true,
      "Max file size allowed is 8MB."
    ),
});
