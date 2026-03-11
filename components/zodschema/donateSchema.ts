import { z } from "zod";
export const donationSchema = z.object({
  cause: z.string().min(1, "Please select donation Type"),
  amount: z
    .string()
    .min(1, "Please enter an amount")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Invalid amount"),
  name: z
    .string()
    .min(3, "Full name is required")
    .regex(/^[A-Za-z\s]+$/, "Name must contain only letters and spaces"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^\d+$/, "Phone must contain only numbers"),
  message: z.string().optional(),
  payment: z.enum(["bKash", "Bank"], "Select a payment method"),
  transactionId: z.string().min(1, "Transaction ID is required"),
});
