"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useLogin } from "@/lib/hooks";
import { toast, Toaster } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending, error: loginError } = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    // Call login mutation
    login(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Login successful! Redirecting...");
        },
        onError: (error: any) => {
          // Extract error message similar to contact form
          let errorMsg = "Login failed. Please check your credentials.";
          
          if (error.message) {
            errorMsg = error.message;
          } else if (error.response?.data?.message) {
            errorMsg = error.response.data.message;
          } else if (error.response?.data?.errors) {
            const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
            errorMsg = errorMessages;
          }
          
          toast.error(errorMsg);
        },
      }
    );
  };

  // Extract error message for display
  const errorMessage = loginError
    ? loginError instanceof Error
      ? loginError.message
      : (loginError as any)?.response?.data?.message || "Login failed. Please check your credentials."
    : "";

  return (
    <div className="flex min-h-screen bg-white">
      {/* Toaster for notifications */}
      <Toaster
        position="bottom-right"
        richColors
        toastOptions={{
          duration: 2500,
          classNames: {
            toast: "relative overflow-hidden rounded-lg px-4 py-3 font-medium",
          },
        }}
      />
      {/* Left side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/contact-us/talk-with-us-expro.jpg"
            alt="Expro Login Background"
            fill
            className="object-cover opacity-90"
            priority
            quality={90}
          />
          {/* Overlay to ensure text readability if we add text over image later */}
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
        </div>

        {/* Optional: Add a testimonial or tagline on the image side */}
        <div className="relative z-10 w-full h-full flex flex-col justify-end p-12 text-white">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium">
              "Expro provides the best solutions for our business needs."
            </p>
            <footer className="text-sm font-medium opacity-80">
              &mdash; Expro Team
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2 bg-gray-50">
        <div className="mx-auto w-full max-w-md bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
          <div className="flex flex-col items-start">
            <div className="relative w-32 h-12 mb-6">
              <Image
                src="/logo.svg"
                alt="Expro Logo"
                fill
                className="object-contain object-left"
              />
            </div>
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div>
            <form
              action="#"
              method="POST"
              className="space-y-6"
              onSubmit={handleLogin}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {/* Heroicon name: mini/x-circle */}
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {errorMessage}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex justify-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-all duration-200"
                >
                  {isPending ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
