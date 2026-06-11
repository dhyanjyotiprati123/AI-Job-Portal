"use client";

import { motion } from "framer-motion";
import { FaUserGraduate, FaBriefcase, FaRocket } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">

      {/* 🔷 HERO SECTION */}
      <section className="text-center py-20 px-6 bg-linear-to-r from-indigo-500 to-purple-500 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold"
        >
          About Our Platform
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 max-w-xl mx-auto text-lg"
        >
          A modern job portal connecting students and recruiters seamlessly with powerful tools and smart workflows.
        </motion.p>
      </section>

      {/* 🚀 FEATURES */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {/* Feature 1 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-2xl shadow-md text-center"
        >
          <FaUserGraduate className="text-indigo-500 text-3xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold">Student Friendly</h3>
          <p className="text-gray-600 mt-2">
            Easy profile creation, job search, and application tracking.
          </p>
        </motion.div>

        {/* Feature 2 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-2xl shadow-md text-center"
        >
          <FaBriefcase className="text-purple-500 text-3xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold">Recruiter Tools</h3>
          <p className="text-gray-600 mt-2">
            Post jobs, manage applicants, and find the best talent quickly.
          </p>
        </motion.div>

        {/* Feature 3 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-2xl shadow-md text-center"
        >
          <FaRocket className="text-green-500 text-3xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold">Fast & Modern</h3>
          <p className="text-gray-600 mt-2">
            Built with modern technologies for speed, performance, and scalability.
          </p>
        </motion.div>

      </section>

      {/* 🌟 VISION SECTION */}
      <section className="py-16 px-6 bg-white text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-4"
        >
          Our Vision
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-gray-600 text-lg"
        >
          We aim to simplify the hiring process by creating a seamless connection
          between students and recruiters. Our platform focuses on transparency,
          efficiency, and a user-first experience.
        </motion.p>
      </section>

      {/* ⚡ CTA */}
      <section className="py-16 px-6 text-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg"
        >
          Get Started
        </motion.button>
      </section>

    </div>
  );
};

export default AboutPage;