"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Heart, User, Mail, Lock, Phone, MapPin, Building2, Globe, ArrowRight, Loader2, ArrowLeft, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ngoRegisterSchema, type NgoRegisterInput } from "@/lib/validators";
import { PAKISTAN_CITIES } from "@/lib/utils";

export default function NGORegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, trigger } = useForm<NgoRegisterInput>({
    resolver: zodResolver(ngoRegisterSchema),
    defaultValues: { city: "" },
  });

  const handleNext = async () => {
    if (step === 1) {
      const valid = await trigger(["adminName", "adminEmail", "adminPassword"]);
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await trigger(["ngoName", "description", "city", "address"]);
      if (valid) setStep(3);
    }
  };

  const onSubmit = async (data: NgoRegisterInput) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: "NGO_ADMIN" }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Registration failed");
        setLoading(false);
        return;
      }
      router.push("/login?registered=ngo");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 pattern-bg" />
        <div className="relative z-10 text-center px-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-8">
            <Building2 className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-4xl font-extrabold font-heading text-white mb-4">
            Register Your NGO
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-white/60 text-lg max-w-sm mx-auto">
            Join NekiBridge&apos;s network of verified NGOs and receive matched, quality donations
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="urdu-text text-white/40 mt-4 text-base">
            اپنے ادارے کو رجسٹر کریں — بہتر عطیات حاصل کریں
          </motion.p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-950">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold font-heading">Neki<span className="text-emerald-500">Bridge</span></span>
          </Link>

          <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white mb-2">NGO Registration</h1>
          <p className="text-gray-500 mb-8">Step {step} of 3 — {step === 1 ? "Admin account" : step === 2 ? "Organization info" : "Additional details"}</p>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 rounded-full flex-1 ${step >= s ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-800"}`} />
            ))}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 text-sm">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Admin Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Your name" className="pl-10" {...register("adminName")} />
                  </div>
                  {errors.adminName && <p className="text-xs text-red-500">{errors.adminName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Admin Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input type="email" placeholder="admin@ngo.org" className="pl-10" {...register("adminEmail")} />
                  </div>
                  {errors.adminEmail && <p className="text-xs text-red-500">{errors.adminEmail.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" className="pl-10" {...register("adminPassword")} />
                  </div>
                  {errors.adminPassword && <p className="text-xs text-red-500">{errors.adminPassword.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Admin Phone (optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="+92 3XX XXXXXXX" className="pl-10" {...register("adminPhone")} />
                  </div>
                </div>
                <Button type="button" className="w-full" size="lg" onClick={handleNext}>
                  Next: Organization Info <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Your NGO name" className="pl-10" {...register("ngoName")} />
                  </div>
                  {errors.ngoName && <p className="text-xs text-red-500">{errors.ngoName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea className="flex w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 min-h-[100px]"
                    placeholder="Describe your organization's mission and clothing programs..." {...register("description")} />
                  {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select className="flex h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 appearance-none" {...register("city")}>
                      <option value="">Select city</option>
                      {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input placeholder="Full address" {...register("address")} />
                  {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4" /> Back</Button>
                  <Button type="button" className="flex-1" onClick={handleNext}>Next <ArrowRight className="w-4 h-4" /></Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Registration Number (optional)</Label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="e.g., REG-001-KHI" className="pl-10" {...register("registrationNumber")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Website (optional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="https://your-ngo.org" className="pl-10" {...register("website")} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone (optional)</Label>
                    <Input placeholder="+92-XXX-XXX" {...register("phone")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Founded Year</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input type="number" placeholder="2005" className="pl-10" {...register("foundedYear", { valueAsNumber: true })} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Contact Email (optional)</Label>
                  <Input type="email" placeholder="info@your-ngo.org" {...register("email")} />
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(2)}><ArrowLeft className="w-4 h-4" /> Back</Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Register NGO <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                </div>
              </motion.div>
            )}
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already registered? <Link href="/login" className="text-emerald-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
