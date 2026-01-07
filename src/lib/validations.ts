import { z } from "zod";
import { UserType } from "@prisma/client";

// Auth Validators
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  userType: z.nativeEnum(UserType),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Blog Validators
export const createBlogSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),
  title: z.string().min(3, "Title must be at least 3 characters"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export const updateBlogSchema = createBlogSchema.partial();

// SEO Validators
export const createSeoPageSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export const updateSeoPageSchema = createSeoPageSchema.partial();

// Chat Validators
export const chatMessageSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  userMessage: z
    .string()
    .min(1, "Message cannot be empty")
    .max(4000, "Message too long"),
});

// Calculator Validators
export const feasibilitySchema = z.object({
  landSize: z.number().positive("Land size must be positive"),
  category: z.string().min(1, "Category is required"),
});

export const revenueSchema = z.object({
  noofStudents: z.number().positive("Number of students must be positive"),
  potentialBuiltUp: z.number().positive().optional(),
});

// FAQ Validators
export const createFaqSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
});

export const updateFaqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  blogId: z.string().uuid().optional().nullable(), 
});

// Utility function to validate and parse data
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
):
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((e) => e.message).join(", ");
      return { success: false, error: errorMessages };
    }
    return { success: false, error: "Validation failed" };
  }
}

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type CreateSeoPageInput = z.infer<typeof createSeoPageSchema>;
export type UpdateSeoPageInput = z.infer<typeof updateSeoPageSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type FeasibilityInput = z.infer<typeof feasibilitySchema>;
export type RevenueInput = z.infer<typeof revenueSchema>;
export type CreateFaqInput = z.infer<typeof createFaqSchema>;
export type UpdateFaqInput = z.infer<typeof updateFaqSchema>;
