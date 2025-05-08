import { z, ZodType } from "zod";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 Mo
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const FormSchemaArticle: ZodType<unknown>= z.object({
    title: z.string({
        required_error: "Le titre est requise",
    }),
    description: z.string({
        required_error: "La description est requise",
    }),
    content: z.string({
        required_error: "Le contenue est requise",
    }),
    categoryId: z.string({
        required_error: "La catégorie est requise",
    }),
    readingTime: z.coerce.number({
        required_error: "Le temps de lecture est requise",
    }),
    banner: z
    .instanceof(File).optional().nullable()
    
   
})