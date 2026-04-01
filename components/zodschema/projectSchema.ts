import { z } from "zod";

// Step 1: Project Info
export const projectInfoSchema = z.object({
  title: z.string().min(3, "Project title is required"),
  category: z.string().min(1, "Category is required"),
  status: z.string().min(1, "Priority is required"),
  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .max(500, "Short description must be under 500 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

// Step 2: Budget & Timeline

export const projectBudgetSchema = z.object({
  totalBudget: z.number().min(1, "Total Budget must be at least 1"),
  initialFund: z.number().min(1, "Initial Fund must be at least 1"),
  startDate: z.string().min(1, "Start Date required"),
  endDate: z.string().min(1, "End Date required"),
});
// Step 3: Teams & Roles
export const projectTeamSchema = z.object({
  projectLead: z.string().optional(),
  fundsUtilized: z
    .string()
    .optional()
    .refine(
      (val) => !val || Number(val) >= 0,
      "Funds utilized must be 0 or more",
    ),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});
