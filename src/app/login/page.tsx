"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      setIsLoading(true);
      setServerError("");
      const response = await authService.login(values);
      if (response.success) {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      setServerError(err.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 text-sm mt-1">
            Sign in to your Medicore account
          </p>
        </div>

        {/* server error */}
        {serverError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
            {serverError}
          </div>
        )}

        {/* login form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* email */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-500 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* password */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="************"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-500 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* forgot password */}
          <div className="flex justify-end">
            <a
              href="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          {/* submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 size={20} className="animate-spin" />}
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Dont have an account?{" "}
          <a
            href="/register"
            className="text-blue-500 hover:underline font-medium"
          >
            Register
          </a>
        </p>
      </div>
    </main>
  );
}
