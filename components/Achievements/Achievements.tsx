"use client";
import { CERTIFICATIONS } from "../../lib/data";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

export default function Achievements() {
  return (
    <section id="achievements" className="snap-start scroll-mt-24 py-20">
      <div className="section-shell px-4 sm:px-6">
        <div className="section-heading mb-12">
          <p className="section-kicker">Achievements</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Certifications & Awards</h2>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {CERTIFICATIONS.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="section-card flex items-start gap-4 rounded-2xl p-5 sm:p-6"
            >
              <div className="rounded-full bg-yellow-100 p-3 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{item.issuer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
