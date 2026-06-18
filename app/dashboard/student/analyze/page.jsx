"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaFilePdf,
  FaBrain,
  FaUserGraduate,
  FaLightbulb,
} from "react-icons/fa";
import { span } from "framer-motion/client";

const ResumeAnalyzePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/student/profile", {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
          if(data?.aiAnalysis){
             setAnalysis(data.aiAnalysis);
          }
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert(error.message);
      }
    };

    getUser();
  }, []);

  // 🚀 Analyze Resume
  const handleAnalyze = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/ai/analyze_gemini", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify({
          resumeUrl: user?.resume,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setAnalysis(data);
        setUser((prev)=>({...prev, aiAnalysis:data}));
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-white to-indigo-100 p-6">

      {/* 🔥 PAGE TITLE */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
          <FaBrain className="text-indigo-600" />
          AI Resume Analyzer
        </h1>

        <p className="text-slate-500 mt-2 text-lg">
          Analyze your resume with AI and improve your career opportunities.
        </p>
      </motion.div>

      {/* 🔥 MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* ================================================= */}
        {/* LEFT SIDE → RESUME SECTION */}
        {/* ================================================= */}

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-6"
        >

          {/* USER INFO */}
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-indigo-100 p-4 rounded-2xl">
              <FaUserGraduate className="text-3xl text-indigo-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {user?.user?.name}
              </h2>

              <p className="text-slate-500">
                {user?.user?.email}
              </p>
            </div>
          </div>

          {/* RESUME CARD */}
          <div className="bg-linear-to-r from-indigo-500 to-purple-500 rounded-3xl p-6 text-white shadow-lg">

            <div className="flex items-center gap-3 mb-4">
              <FaFilePdf className="text-3xl" />

              <h3 className="text-2xl font-semibold">
                Uploaded Resume
              </h3>
            </div>

            {user?.resume? (
              <div>

                <p className="text-indigo-100 mb-6">
                  Your uploaded resume is ready for AI analysis.
                </p>

                {/* VIEW RESUME */}
                <a
                  href={user.resume}
                  target="_blank"
                  className="inline-block bg-white text-indigo-600 font-semibold px-5 py-3 rounded-xl hover:scale-105 transition"
                >
                  View Resume
                </a>

              </div>
            ) : (
              <p>No resume uploaded.</p>
            )}
          </div>

          {/* PDF PREVIEW */}
          {user?.resume && (
            <div className="mt-8">

              <h3 className="text-xl font-bold mb-4 text-slate-700">
                Resume Preview
              </h3>

              <div className="rounded-2xl overflow-hidden border shadow-lg h-175">

                <iframe
                  src={user?.resume}
                  className="w-full h-full"
                />

              </div>

            </div>
          )}
        </motion.div>

        {/* ================================================= */}
        {/* RIGHT SIDE → AI ANALYSIS */}
        {/* ================================================= */}

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-6"
        >

          {/* ANALYZE BUTTON */}
          <div className="flex justify-between items-center mb-8">

            <div>
              <h2 className="text-3xl font-bold text-slate-800">
                AI Analysis
              </h2>

              <p className="text-slate-500 mt-1">
                Get detailed resume insights powered by AI.
              </p>
            </div>

            {
              !analysis ? ( <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition hover:scale-105"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>) : ( <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition hover:scale-105"
            >
              Analyze Again
            </button>)
            }
           

          </div>

          {/* NO ANALYSIS */}
          {!analysis && !loading && (
            <div className="h-125 flex flex-col justify-center items-center text-center">

              <FaLightbulb className="text-6xl text-indigo-300 mb-6" />

              <h3 className="text-2xl font-bold text-slate-700 mb-3">
                AI Insights Await
              </h3>

              <p className="text-slate-500 max-w-md">
                Click the analyze button to extract skills, strengths,
                weaknesses, and career suggestions from your resume.
              </p>

            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="h-125 flex justify-center items-center">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* ANALYSIS RESULT */}
          {analysis && (
            <div className="space-y-8">

              {/* SKILLS */}
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Skills
                </h3>

                <div className="flex flex-wrap gap-3">
                  {analysis.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* STRENGTHS */}
              <div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">
                  Strengths
                </h3>

                <div className="space-y-3">
                  {analysis.strengths?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-green-50 border border-green-100 p-4 rounded-2xl"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* WEAKNESSES */}
              <div>
                <h3 className="text-2xl font-bold text-red-500 mb-4">
                  Weaknesses
                </h3>

                <div className="space-y-3">
                  {analysis.weaknesses?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-red-50 border border-red-100 p-4 rounded-2xl"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* SUGGESTIONS */}
              <div>
                <h3 className="text-2xl font-bold text-purple-600 mb-4">
                  Suggestions
                </h3>

                <div className="space-y-3">
                  {analysis.suggestions?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-purple-50 border border-purple-100 p-4 rounded-2xl"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </motion.div>

      </div>
    </div>
  );
};

export default ResumeAnalyzePage;