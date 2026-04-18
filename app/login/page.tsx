"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useLogin } from "@/lib/hooks";
import { toast, Toaster } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ login?: string; password?: string }>(
    {},
  );
  const { mutate: loginMutation, isPending, error: loginError } = useLogin();

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone format (Bangladesh phone number: 11 digits starting with 01)
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^01[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { login?: string; password?: string } = {};

    // Login validation (email or phone)
    if (!login.trim()) {
      newErrors.login = "Email or phone number is required";
    } else if (!validateEmail(login) && !validatePhone(login)) {
      newErrors.login = "Please enter a valid email or phone number (e.g., 01712345678)";
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    // Call login mutation
    loginMutation(
      { login, password },
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
            const errorMessages = Object.values(error.response.data.errors)
              .flat()
              .join(", ");
            errorMsg = errorMessages;
          }

          toast.error(errorMsg);
        },
      },
    );
  };

  // Clear error when user starts typing
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
    if (errors.login) {
      setErrors({ ...errors, login: undefined });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: undefined });
    }
  };

  // Extract error message for display
  const errorMessage = loginError
    ? loginError instanceof Error
      ? loginError.message
      : (loginError as any)?.response?.data?.message ||
        "Login failed. Please check your credentials."
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
                  htmlFor="login"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email or Phone Number
                </label>
                <div className="mt-1 ">
                  <input
                    id="login"
                    name="login"
                    type="text"
                    autoComplete="username"
                    required
                    value={login}
                    onChange={handleLoginChange}
                    className={`appearance-none text-slate-600 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${
                      errors.login
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="admin@gmail.com or 01712345678"
                  />
                  {errors.login && (
                    <p className="mt-1 text-sm text-red-600">{errors.login}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    className={`appearance-none text-slate-500 block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
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
                    href="/forgetPassword"
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
