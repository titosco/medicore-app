"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { authService } from "@/services/auth.service";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type forgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState("");
  const [isLoadinig, SetIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotForm>({
    resolver: zodResolver(forgotSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: forgotForm) => {
    try {
      SetIsLoading(true);
      setServerError("");
      const response = await authService.forgotPassword(values);
      if (response.success) {
        setSuccess(true);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      setServerError(err.response?.data?.error || "something went wrong");
    } finally {
      SetIsLoading(false);
    }
  };

  // if successful state
  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md text-center">
          <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-blue-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Check your email
          </h2>
          <p className="text-gray-500 text-sm">
            {" "}
            If an account with that email exists, you will receive a password
            reset link shortly.
          </p>
          <a
            href="/login"
            className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition"
          >
            Back to Login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/login"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-700 mb-4"
          >
            <ArrowLeft size={16} />
          </a>
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email and we will send you a reset link
          </p>
        </div>

        {/* server error */}
        {serverError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              {...register("email")}
              type="text"
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={isLoadinig}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoadinig && <Loader2 size={20} className="animate-spin" />}
            {isLoadinig ? "sending..." : "send reset link"}
          </button>
        </form>
      </div>
    </main>
  );
}
