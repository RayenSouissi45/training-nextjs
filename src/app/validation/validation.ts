// validation.ts
import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1, "Name is required").max(12, "Max 12 characters"),
  age: z
    .number({ invalid_type_error: "Age must be a number" })
    .min(18, "Must be at least 18"),
});
