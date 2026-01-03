"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input } from "@/components/ui";
import { toast } from "react-toastify";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      toast.success("Welcome back!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/signup/caelum_logo.png"
                alt="Caelum"
                width={60}
                height={60}
                className="mx-auto mb-4"
              />
            </Link>
            <h1 className="text-3xl font-bold text-color3">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to continue to Caelum</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-color1 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="text-center mt-6 text-gray-600 space-y-2">
            <p>
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-color1 font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
            <p>
              Are you an admin?{" "}
              <Link
                href="/admin/login"
                className="text-color1 font-semibold hover:underline"
              >
                Go to Admin Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-color9 to-blue-800 items-center justify-center p-8">
        <div className="max-w-lg text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Transform Your School Investment Journey
          </h2>
          <p className="text-xl text-gray-200">
            AI-powered tools and expert guidance for investors and educators.
          </p>
        </div>
      </div>
    </div>
  );
}
