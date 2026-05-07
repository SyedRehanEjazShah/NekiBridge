"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Building2, MapPin, Shirt } from "lucide-react";

const stats = [
  { icon: Shirt, value: 12450, suffix: "+", label: "Clothes Donated", labelUrdu: "لباس عطیہ" },
  { icon: Building2, value: 15, suffix: "+", label: "Partner NGOs", labelUrdu: "شراکت دار ادارے" },
  { icon: MapPin, value: 20, suffix: "+", label: "Cities Covered", labelUrdu: "شہر" },
  { icon: Users, value: 3200, suffix: "+", label: "Happy Donors", labelUrdu: "خوش عطیہ دہندگان" },
];

function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function StatsBar() {
  return (
    <section className="relative -mt-16 z-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl md:text-4xl font-extrabold font-heading text-gray-900 dark:text-white mb-1">
                <AnimatedCounter target={stat.value} />
                <span className="text-emerald-500">{stat.suffix}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="urdu-text text-xs text-gray-400 dark:text-gray-500 mt-0.5">{stat.labelUrdu}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
