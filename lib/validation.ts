import { z } from "zod";
import { normalizePhone } from "./phone";
export { normalizePhone } from "./phone";
export const enquirySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Please enter your name.")
      .max(80, "Use 80 characters or fewer.")
      .regex(
        /^[\p{L}\p{M}\s.'’-]+$/u,
        "Use letters, spaces, apostrophes or hyphens.",
      ),
    phone: z
      .string()
      .max(30)
      .refine(
        (v) => normalizePhone(v) !== null,
        "Enter a Sri Lankan number, e.g. 077 717 3041.",
      ),
    category: z.string().trim().max(80).optional().default(""),
    message: z
      .string()
      .trim()
      .max(1500, "Keep your message under 1,500 characters.")
      .optional()
      .default(""),
    website: z.string().max(200).optional().default(""),
    requestId: z.string().uuid(),
    startedAt: z.number().int().positive(),
    challengeToken: z.string().max(2048).optional(),
  })
  .strict();
export type Enquiry = z.infer<typeof enquirySchema>;
export function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
}
