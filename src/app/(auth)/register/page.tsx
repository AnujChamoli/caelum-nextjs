"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input, Select } from "@/components/ui";
import { UserType } from "@/types";
import { toast } from "react-toastify";

const userTypeOptions = [
  { value: "Investor", label: "Investor" },
  { value: "Teacher", label: "Teacher/Educator" },
];

function RegisterForm() {
  const searchParams = useSearchParams();
  const defaultType =
    searchParams.get("type") === "investor" ? "Investor" : "Teacher";

  const { register, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<UserType>(defaultType as UserType);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      await register(name, email, password, userType);
      toast.success("Account created successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-color1 to-color7 items-center justify-center p-8">
        <div className="max-w-lg text-center text-color3">
          <h2 className="text-4xl font-bold mb-6">Join Caelum Today</h2>
          <p className="text-xl text-color3/80">
            Start your journey to smarter education investment and teaching.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
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
            <h1 className="text-3xl font-bold text-color3">Create Account</h1>
            <p className="text-gray-600 mt-2">
              Sign up to get started with Caelum
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Select
              label="I am a..."
              options={userTypeOptions}
              value={userType}
              onChange={(e) => setUserType(e.target.value as UserType)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="At least 8 characters with uppercase, lowercase, and number"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-color1 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-color1"></div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
