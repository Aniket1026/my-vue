import z from "zod";

export const messageValidation = z.object({
  message: z
    .string()
    .min(1, { message: "Message must not be empty" })
    .max(250, { message: "Message must be at most 250 characters long" }),
});
