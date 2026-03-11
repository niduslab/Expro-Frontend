import { z } from "zod";

// Step 1: Project Info
export const projectInfoSchema = z.object({
  title: z.string().min(3, "Project title is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.string().min(1, "Priority is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

// Step 2: Budget & Timeline

export const projectBudgetSchema = z.object({
  totalBudget: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Budget must be at least 1"),
  ),
  initialFund: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Initial fund must be at least 1"),
  ),
  startDate: z.string().min(1, "Start Date required"),
  endDate: z.string().min(1, "End Date required"),
});
// Step 3: Teams & Roles
export const projectTeamSchema = z.object({
  projectLead: z
    .string()
    .min(1, "Project lead required")
    .regex(/^[A-Za-z\s]+$/, "Project lead must contain only letters"),
  role: z.string().min(1, "Role required"),
  teamSize: z.number().min(1, "Team size must be at least 1"),
  contribution: z.number().min(1, "Contribution must be at least 1"),
});
