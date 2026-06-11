"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7 },
  }),
};

export default function Home() {
  return (
    <main className="relative overflow-x-hidden bg-linear-to-b from-[#0f172a] via-[#1e293b] to-[#020617] text-white">

      <motion.div
        animate={{ y: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute w-72 h-72 bg-indigo-500/30 blur-3xl rounded-full top-20 left-10"
      />
      <motion.div
        animate={{ y: [0, 40, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
        className="absolute w-96 h-96 bg-purple-500/30 blur-3xl rounded-full bottom-10 right-10"
      />

      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="text-5xl md:text-7xl font-bold leading-tight"
        >
          Find the Right Job with{" "}
          <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI Assistance
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mt-6 max-w-2xl mx-auto text-gray-300 text-lg"
        >
          AI-powered job platform that analyzes resumes, matches skills, and prepares you for interviews.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="flex justify-center gap-4 mt-10"
        >
          <a className="px-8 py-3 bg-indigo-500 rounded-full hover:scale-105 transition shadow-lg">
            Get Started
          </a>
          <a className="px-8 py-3 border border-white/30 rounded-full backdrop-blur-md hover:bg-white/10 transition">
            Login
          </a>
        </motion.div>

      </section>

      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl font-bold text-center mb-16"
        >
          Platform Features
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10">

          {[
            "AI Resume Analysis",
            "Smart Job Matching",
            "Interview Preparation",
          ].map((title, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              custom={i}
              whileHover={{ scale: 1.05 }}
              className="p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-gray-300">
                Experience intelligent automation that enhances your career journey.
              </p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* ⚙️ HOW IT WORKS */}
      <section className="relative z-10 py-24 text-center">

        <h2 className="text-3xl font-bold mb-16">How It Works</h2>

        <div className="grid md:grid-cols-4 gap-10 max-w-6xl mx-auto px-6">

          {["Create Profile", "Upload Resume", "Get Matched", "Apply"].map(
            (step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                custom={i}
              >
                <div className="text-5xl font-bold text-indigo-400 mb-4">
                  {i + 1}
                </div>
                <p className="text-gray-300">{step}</p>
              </motion.div>
            )
          )}

        </div>
      </section>

      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-16">
          What Users Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {["Great platform!", "AI saved my time!", "Amazing experience!"].map(
            (text, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20"
              >
                <p className="text-gray-300 italic">{text}</p>
              </motion.div>
            )
          )}

        </div>
      </section>

      <section className="relative z-10 py-32 text-center">

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-bold mb-6"
        >
          Start Your Career Journey Today
        </motion.h2>

        <motion.a
          whileHover={{ scale: 1.1 }}
          className="px-10 py-4 bg-indigo-500 rounded-full shadow-lg"
        >
          Create Account
        </motion.a>

      </section>

    </main>
  );
}