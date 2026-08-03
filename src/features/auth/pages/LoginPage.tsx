import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Mail, Lock } from "lucide-react";

import { type LoginFormValues, loginSchema } from "../schemas/auth.schema";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const router = useNavigate();
  const { login } = useAuth();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);

      await login(data.email, data.password);

      toast.success("Login successful");

      router("/");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-96">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border">
          <img
            src="/imrabo-logo-512x512.png"
            alt="Logo"
            width={50}
            height={50}
            className="h-6 w-6"
          />
        </div>

        <CardTitle className="text-2xl">Sign In</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <div className="relative">
              <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />

              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-10"
                {...register("email")}
              />
            </div>

            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <div className="relative">
              <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />

              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                className="pl-10"
                {...register("password")}
              />
            </div>

            {errors.password && (
              <p className="text-destructive text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>

          {/* Attribution */}
          <div className="border-t pt-4">
            <p className="text-muted-foreground text-center text-xs">
              Crafted by{" "}
              <a
                href="https://strix.website"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground font-semibold transition-colors"
              >
                Strix Engineering Studio
              </a>
            </p>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
