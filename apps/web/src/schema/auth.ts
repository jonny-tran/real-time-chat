import { z } from "zod";

// login
export const LoginSchema = z.object({
  username: z.string().min(3, "Username tối thiểu 3 ký tự"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
});

// Register
export const RegisterSchema = z.object({
  username: z.string().min(3, "Username tối thiểu 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ cái viết hoa")
    .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ cái viết thường")
    .regex(/\d/, "Mật khẩu phải có ít nhất 1 số"),
  avatarUrl: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
});

// Forgot password
export const ForgotSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

// Reset password
export const ResetSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  token: z.string().min(1, "Thiếu token"),
  newPassword: z
    .string()
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ cái viết hoa")
    .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ cái viết thường")
    .regex(/\d/, "Mật khẩu phải có ít nhất 1 số"),
});

// inferred type
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ForgotInput = z.infer<typeof ForgotSchema>;
export type ResetInput = z.infer<typeof ResetSchema>;
