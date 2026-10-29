"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token found. Please check your email link.");
      return;
    }

    const verify = async () => {
      try {
        const response = await authService.verifyEmail(token);
        if (response.success) {
          setStatus("success");
          setMessage("Your email has been verified successfully.");
          // Redirect to login after 3 seconds
          setTimeout(() => router.push("/login"), 3000);
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { error?: string } } };
        setStatus("error");
        setMessage(
          err.response?.data?.error ||
            "Verification failed. The link may have expired.",
        );
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md text-center">
        {/* Loading */}
        {status === "loading" && (
          <>
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-6 h-6 text-blue-700 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Verifying your email
            </h2>
            <p className="text-gray-600 text-sm">Please wait a moment...</p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Email verified
            </h2>
            <p className="text-gray-500 text-sm">{message}</p>
            <p className="text-gray-400 text-xs mt-2">
              Redirecting you to login...
            </p>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Verification failed
            </h2>
            <p className="text-gray-500 text-sm">{message}</p>
            <a
              href="/login"
              className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition"
            >
              Go to Login
            </a>
          </>
        )}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
