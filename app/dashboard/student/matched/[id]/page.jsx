"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaRobot,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import Link from "next/link";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiData, setAiData] = useState(null);


  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(
          `/api/ai/job-match/${id}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok) {
          setJob(data);
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert(error.message);
      }

      setLoading(false);
    };

    fetchJob();

  }, [id]);


  const analyzeJob = async () => {
    try {
      setAnalyzing(true);
      const res = await fetch(
        `/api/ai/job-match/${id}/analyze`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setAiData(data);
      } else {
        alert(data.message);
      }

    } catch (error) {
      alert(error.message);
    }
    setAnalyzing(false);
  };


  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid lg:grid-cols-2 gap-6">

        {/* LEFT SECTION */}

        <div className="bg-white p-6 rounded-2xl shadow">
          {/* HEADER */}

          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                {job?.job?.title}
              </h1>

              <p className="text-gray-600 mt-2">
                {job?.job?.company}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-full text-white text-sm font-medium
              ${
                job?.matchPercentage >= 80
                  ? "bg-green-500"
                  : job?.matchPercentage >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }
              `}
            >
              {job?.matchPercentage}% Match
            </div>
          </div>

          {/* JOB INFO */}
          <div className="mt-6 space-y-4 text-gray-700">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt />
              {job?.job?.location}
            </div>

            <div className="flex items-center gap-3">
              <FaMoneyBillWave />
              {job?.job?.salary}
            </div>

            <div className="flex items-center gap-3">
              <FaBriefcase />
              {job?.job?.jobType}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-medium">
                Experience:
              </span>
              {job?.job?.experienceLevel}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-8">
            <h2 className="font-bold text-xl">
              Description
            </h2>
            <p className="mt-3 text-gray-700 leading-7">
              {job?.job?.description}
            </p>
          </div>

          {/* MATCHED SKILLS */}
          <div className="mt-8">
            <h2 className="font-bold text-lg">
              Matched Skills
            </h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {job?.matchedSkills?.map((skill) => (
                <span
                  key={skill}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* MISSING SKILLS */}

          <div className="mt-8">
            <h2 className="font-bold text-lg">
              Missing Skills
            </h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {job?.missingSkills?.map((skill) => (
                <span
                  key={skill}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>


          {/* APPLY BUTTON */}
          <Link href={`/dashboard/student/jobs/${id}/apply`}>
             <button className="mt-8 w-full bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 transition cursor-pointer">
               Apply Now
            </button>
          </Link>
          
          <Link href={`/dashboard/student/matched/${id}/assistance`}>
            <button className="mt-8 w-full bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 transition cursor-pointer">
              Get Full AI Assist For This Job
            </button>
          </Link>
          
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow h-fit">
          {/* HEADER */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <FaRobot
                size={24}
                className="text-indigo-600"
              />
              <h2 className="font-bold text-2xl">
                AI Career Assistant
              </h2>
            </div>
            <button
              onClick={analyzeJob}
              disabled={analyzing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl transition"
            >
              {
                analyzing
                  ? "Analyzing..."
                  : "Analyze This Job"
              }
            </button>
          </div>

          {/* EMPTY STATE */}

          {!aiData && !analyzing && (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <FaRobot
                size={60}
                className="text-indigo-300 mb-5"
              />
              <h3 className="text-2xl font-bold text-gray-700">
                AI Analysis Ready
              </h3>
              <p className="text-gray-500 mt-3 max-w-md leading-7">
                Analyze this job according to your resume,
                skills, strengths, and career profile.
              </p>
            </div>
          )}

          {/* LOADING */}

          {analyzing && (
            <div className="flex justify-center items-center py-24">
              <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* AI DATA */}

          {aiData && !analyzing && (
            <div className="space-y-6">
              {/* FIT REASON */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <h3 className="font-semibold flex items-center gap-2 text-green-700">
                  <FaCheckCircle />
                  Why You Fit
                </h3>
                <p className="mt-3 text-sm text-gray-700 leading-6">
                  {aiData?.fitReason}
                </p>
              </div>

              {/* MISSING SKILLS */}
              {aiData?.missingSkills?.length > 0 && (
                <div>
                  <h3 className="font-semibold flex items-center gap-2 text-orange-600 mb-3">
                    <FaExclamationTriangle />
                    Missing Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {aiData?.missingSkills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* STRENGTHS */}
              <div>
                <h3 className="font-semibold text-green-600 mb-3">
                  Strengths
                </h3>
                <div className="space-y-2">
                  {aiData?.strengths?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-green-50 p-3 rounded-xl text-sm text-gray-700"
                    >
                      • {item}
                   </div>
                  ))}
                </div>
              </div>

              {/* WEAKNESSES */}
              <div>
                <h3 className="font-semibold text-red-500 mb-3">
                  Weaknesses
                </h3>
                <div className="space-y-2">
                  {aiData?.weaknesses?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-red-50 p-3 rounded-xl text-sm text-gray-700"
                    >
                      • {item}
                    </div>
                  ))}
                </div>
              </div>


              {/* SUGGESTIONS */}

              <div>
                <h3 className="font-semibold text-indigo-600 mb-3">
                  Suggestions
                </h3>
                <div className="space-y-2">
                  {aiData?.suggestions?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-indigo-50 p-3 rounded-xl text-sm text-gray-700"
                    >
                      • {item}
                    </div>
                  ))}
                </div>
              </div>


              {/* INTERVIEW TIPS */}

              <div>
                <h3 className="font-semibold text-purple-600 mb-3">
                  Interview Tips
                </h3>
                <div className="space-y-2">
                  {aiData?.interviewTips?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-purple-50 p-3 rounded-xl text-sm text-gray-700"
                    >
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}