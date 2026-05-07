"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Heart, User, Mail, Lock, Eye, EyeOff, Phone, MapPin, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { donorRegisterSchema, type DonorRegisterInput } from "@/lib/validators";
import { PAKISTAN_CITIES } from "@/lib/utils";

export default function DonorRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<DonorRegisterInput>({
    resolver: zodResolver(donorRegisterSchema),
    defaultValues: { city: "" },
  });

  const handleNext = async () => {
    const valid = await trigger(["name", "email", "password", "confirmPassword"]);
    if (valid) setStep(2);
  };

  const onSubmit = async (data: DonorRegisterInput) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: "DONOR" }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero dark:gradient-hero-dark relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 pattern-bg" />
        <div className="relative z-10 text-center px-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-8"
          >
            <Heart className="w-10 h-10 text-white fill-white/50" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-extrabold font-heading text-white mb-4"
          >
            Join the Movement
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/60 text-lg max-w-sm mx-auto"
          >
            Register as a donor and start making a real impact in someone&apos;s life
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="urdu-text text-white/40 mt-4 text-base"
          >
            عطیہ دہندہ بنیں — زندگیاں بدلیں
          </motion.p>

          {/* Benefits list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-10 text-left max-w-xs mx-auto space-y-3"
          >
            {[
              "Track every donation end-to-end",
              "Choose from 15+ verified NGOs",
              "Get personal impact reports",
              "Schedule free home pickups",
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-white/70 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                {benefit}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold font-heading text-gray-900 dark:text-white">
              Neki<span className="text-emerald-500">Bridge</span>
            </span>
          </Link>

          <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Step {step} of 2 — {step === 1 ? "Your information" : "Location details"}
          </p>

          {/* Progress bar */}
          <div className="flex gap-2 mb-8">
            <div className={`h-1.5 rounded-full flex-1 ${step >= 1 ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-800"}`} />
            <div className={`h-1.5 rounded-full flex-1 ${step >= 2 ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-800"}`} />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {step === 1 ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="name" placeholder="Your full name" className="pl-10" {...register("name")} />
                  </div>
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="email" type="email" placeholder="you@example.com" className="pl-10" {...register("email")} />
                  </div>
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      className="pl-10 pr-10"
                      {...register("password")}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="confirmPassword" type="password" placeholder="Re-enter password" className="pl-10" {...register("confirmPassword")} />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <Button type="button" className="w-full" size="lg" onClick={handleNext}>
                  Next Step <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="phone" placeholder="+92 3XX XXXXXXX" className="pl-10" {...register("phone")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      id="city"
                      className="flex h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500 appearance-none"
                      {...register("city")}
                    >
                      <option value="">Select your city</option>
                      {PAKISTAN_CITIES.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address (optional)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <Input id="address" placeholder="Your address for pickups" className="pl-10" {...register("address")} />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" size="lg" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" size="lg" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                </div>
              </motion.div>
            )}
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
