import { z } from "zod";

export const eligibilitySchema = z.object({
//   age: z.coerce.number().int().min(1).max(120).optional(),
  age: z.preprocess(
  (value) => value === "" ? undefined : value,
  z.coerce.number().int().min(1).max(120).optional()
  ),
  maritalStatus: z.enum([
    "married",
    "widow",
    "unmarried",
    "other",
  ]).optional(),
  hasBplCard: z.boolean().optional(),
  isShgMember: z.boolean().optional(),
  isPregnant: z.boolean().optional(),
  isFirstChild: z.boolean().optional(),
}).strict().refine(
  (answers) => Object.values(answers).some(
    (value) => value !== undefined
  ),
  { message: "Please answer at least one question." }
);