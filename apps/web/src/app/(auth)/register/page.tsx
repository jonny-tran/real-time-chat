"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterSchema, type RegisterInput } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

//PasswrodInput re-use
function PasswordInput(props: React.ComponentProps<"input">) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex gap-2">
      <Input type={show ? "text" : "password"} {...props} />
      <Button
        type="button"
        variant={"secondary"}
        onClick={() => setShow((s) => !s)}
      >
        {show ? "hide" : "show"}
      </Button>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { username: "", email: "", password: "", avatarUrl: "" },
    mode: "onSubmit",
  });

  async function onSubmit(values: RegisterInput) {
    // clear error in root
    form.clearErrors("root");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const message =
        data?.message ||
        (res.status === 409
          ? "Username/Email đã tồn tại."
          : res.status === 400
            ? "Dữ liệu không hợp lệ."
            : "Không thể kết nối máy chủ. Vui lòng thử lại.");
      form.setError("root", { message });
      return;
    }
    router.push("/login");
  }

  return (
    <div className="min-h-svh flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Tạo tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {form.formState.errors.root?.message && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.root?.message}
                </p>
              )}

              {/* username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập username"
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập email @gmail.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Nhập mật khẩu"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Đang tạo tài khoản..."
                  : "Tạo tài khoản"}
              </Button>

              <div className="m-4 text-sm flex justify-between">
                <Link href="/login" className="underline">
                  Đã có tài khoản? Đăng nhập
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
