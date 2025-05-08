import { z } from "zod";

export const FormSchema = z.object({
    name: z.string({
        required_error: "Le nom est requis",
    }),
    color: z.string({
        required_error: "La couleur est requise",
    }).regex(/^#([0-9A-F]{3}){1,2}$/i, "Couleur invalide"),
     smiley: z.string({
        required_error: "L'icone est requise",
    }),
})