import z from "zod";

export const verifyValidation = z
  .string()
  .length(6, { message: "Verification code must be 6 characters long" });
