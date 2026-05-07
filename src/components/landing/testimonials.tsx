"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ahmed Raza",
    city: "Lahore",
    role: "Donor",
    quote: "NekiBridge made donating so easy! I just scheduled a pickup and could track exactly where my clothes went. Knowing they reached an orphanage in Peshawar was incredibly fulfilling.",
    quoteUrdu: "نیکی بریج نے عطیہ دینا بہت آسان بنا دیا!",
    rating: 5,
    donations: 12,
    avatar: "A",
  },
  {
    name: "Fatima Zahra",
    city: "Islamabad",
    role: "Donor",
    quote: "As a mother, I accumulate so many outgrown children's clothes. NekiBridge matched me with an NGO that specifically needed kids' clothing. The smart matching is brilliant!",
    quoteUrdu: "سمارٹ میچنگ واقعی شاندار ہے!",
    rating: 5,
    donations: 8,
    avatar: "F",
  },
  {
    name: "Bilal Khan",
    city: "Karachi",
    role: "NGO Partner",
    quote: "Before NekiBridge, we received random clothing we couldn't distribute. Now donors send exactly what we need. Our distribution efficiency went up by 300%!",
    quoteUrdu: "ہماری تقسیم کی کارکردگی میں 300 فیصد اضافہ ہوا!",
    rating: 5,
    donations: 0,
    avatar: "B",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 text-sm font-semibold mb-4">
            Real Stories
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-heading text-gray-900 dark:text-white mb-4">
            What Our <span className="text-gradient">Community</span> Says
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 relative hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <Quote className="w-10 h-10 text-emerald-100 dark:text-emerald-900 absolute top-6 right-6" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 relative z-10">
                &ldquo;{t.quote}&rdquo;
              </p>

              <p className="urdu-text text-xs text-emerald-500 mb-6">{t.quoteUrdu}</p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">
                    {t.role} • {t.city}
                    {t.donations > 0 && ` • ${t.donations} donations`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
