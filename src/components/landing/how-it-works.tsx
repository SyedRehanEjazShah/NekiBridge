"use client";

import { motion } from "framer-motion";
import { UserPlus, Building2, CalendarCheck, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Register",
    titleUrdu: "رجسٹر کریں",
    description: "Create your free account as a donor in under 2 minutes. Tell us your city and preferences.",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: Building2,
    step: "02",
    title: "Choose NGO",
    titleUrdu: "ادارہ چنیں",
    description: "Browse verified NGOs or let our smart algorithm match your donation to the NGO that needs it most.",
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
  },
  {
    icon: CalendarCheck,
    step: "03",
    title: "Schedule Pickup",
    titleUrdu: "وقت مقرر کریں",
    description: "Add your clothing items, choose drop-off or home pickup, and schedule at your convenience.",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    icon: BarChart3,
    step: "04",
    title: "Track Impact",
    titleUrdu: "اثر دیکھیں",
    description: "Track your donation from pickup to distribution. See exactly who benefited from your generosity.",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50/50 dark:bg-gray-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-heading text-gray-900 dark:text-white mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            From your closet to someone&apos;s smile — in 4 simple steps
          </p>
          <p className="urdu-text text-gray-400 dark:text-gray-500 text-sm mt-2">
            آپ کی الماری سے کسی کی مسکراہٹ تک — صرف چار آسان مراحل
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative group"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent z-0" />
              )}

              <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all hover:shadow-xl hover:-translate-y-1 group">
                {/* Step number */}
                <span className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br text-white text-sm font-bold flex items-center justify-center shadow-lg"
                  style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                >
                  <span className={`bg-gradient-to-br ${step.color} bg-clip-text text-transparent font-heading w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800`}>
                    {step.step}
                  </span>
                </span>

                {/* Icon */}
                <div className={`${step.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <step.icon className={`w-7 h-7 bg-gradient-to-br ${step.color} bg-clip-text`} style={{ color: step.color.includes("emerald") ? "#059669" : step.color.includes("cyan") ? "#0891b2" : step.color.includes("amber") ? "#d97706" : "#9333ea" }} />
                </div>

                <h3 className="text-xl font-bold font-heading text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="urdu-text text-xs text-emerald-500 mb-3">{step.titleUrdu}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
