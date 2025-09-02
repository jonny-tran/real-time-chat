"use client";

import { LoginInput, LoginSchema } from "@/schema/auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
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
import Link from "next/link";

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

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { username: "", password: "" },
    mode: "onSubmit",
  });

  async function onSubmit(values: LoginInput) {
    // clear error in root
    form.clearErrors("root");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res
        .json()
        .catch(() => ({ message: "Có lỗi xảy ra, vui lòng thử lại sau." }));
      const message = data?.message || "Có lỗi xảy ra, vui lòng thử lại sau.";
      form.setError("root", { message });
      return;
    }

    const redirect = sp.get("redirect") || "/chat";
    router.replace(redirect);
  }

  return (
    <div className="min-h-screen flex items-center jusitfy-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Lỗi server tổng (root) */}
              {form.formState.errors.root?.message && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.root?.message}
                </p>
              )}

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Nhập mật khẩu" {...field} />
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
                  ? "Đang đăng nhập..."
                  : "Đăng nhập"}
              </Button>
            </form>
          </Form>

          <div className="m-4 text-sm flex justify-between">
            <Link href="/register" className="underline">
              Chưa có tài khoản? Đăng ký
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
