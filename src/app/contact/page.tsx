"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, Heart, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  return (
    <SessionProvider>
      <Navbar />
      <main className="pt-20">
        <section className="relative py-20 gradient-hero dark:gradient-hero-dark overflow-hidden">
          <div className="absolute inset-0 pattern-bg" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-white mb-4">Get in <span className="text-amber-300">Touch</span></h1>
              <p className="text-lg text-white/70 mb-3">Have questions? We&apos;d love to hear from you.</p>
              <p className="urdu-text text-white/50">ہم سے رابطہ کریں — ہم آپ کی مدد کے لیے حاضر ہیں</p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
        </section>

        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-extrabold font-heading text-gray-900 dark:text-white mb-6">Contact Information</h2>
                <div className="space-y-5">
                  {[
                    { icon: MapPin, label: "Address", value: "Islamabad, Pakistan", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
                    { icon: Mail, label: "Email", value: "contact@nekibridge.pk", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
                    { icon: Phone, label: "Phone", value: "+92 300 1234567", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
                    { icon: Clock, label: "Hours", value: "Mon-Sat: 9 AM - 6 PM", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{item.label}</p>
                        <p className="font-medium text-gray-900 dark:text-white">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white relative overflow-hidden">
                  <div className="absolute inset-0 pattern-bg opacity-20" />
                  <div className="relative z-10">
                    <Heart className="w-6 h-6 mb-2 text-white/80" />
                    <p className="font-semibold mb-1">Want to partner with us?</p>
                    <p className="text-sm text-white/70">If you&apos;re an NGO or business wanting to collaborate, we&apos;d love to talk.</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
                {submitted ? (
                  <div className="text-center py-10">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-500 mb-6">Thank you for reaching out. We&apos;ll respond within 24 hours.</p>
                    <Button onClick={() => setSubmitted(false)} variant="outline">Send Another</Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <MessageSquare className="w-6 h-6 text-emerald-500" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Send us a Message</h3>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5"><Label>First Name</Label><Input placeholder="Your first name" required /></div>
                        <div className="space-y-1.5"><Label>Last Name</Label><Input placeholder="Your last name" required /></div>
                      </div>
                      <div className="space-y-1.5"><Label>Email</Label><Input type="email" placeholder="you@example.com" required /></div>
                      <div className="space-y-1.5"><Label>Subject</Label>
                        <select className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm" required>
                          <option value="">Select a topic</option>
                          <option value="donation">Donation Inquiry</option>
                          <option value="ngo">NGO Partnership</option>
                          <option value="technical">Technical Support</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-1.5"><Label>Message</Label>
                        <textarea className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm min-h-[130px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40" placeholder="Your message..." required />
                      </div>
                      <Button type="submit" size="lg" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
                      </Button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </SessionProvider>
  );
}
