import { z } from "zod";

export const pensionpackageSchema = z.object({
  packageName: z.string().min(3, "Package name is required"),
  monthlyFee: z.coerce.number().min(1, "Monthly fee must be at least 1"),
  status: z.string().min(1, "Status is required"),

  duration: z.coerce.number().min(1, "Duration required"),
  installments: z.coerce.number().min(1, "Installments required"),
  maturity: z.coerce.number().min(1, "Maturity amount required"),

  joiningCommission: z.coerce.number().min(1, "Joining commission required"),

  installmentCommission: z.coerce
    .number()
    .min(1, "Installment commission required"),
});
