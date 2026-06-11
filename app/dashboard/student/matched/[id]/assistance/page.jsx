"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FaEnvelope,
  FaRobot,
  FaSpinner,
  FaChevronDown,
  FaChevronUp,
  FaBriefcase,
  FaCopy
} from "react-icons/fa";
import Link from "next/link";

export default function JobAssistancePage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [mockInterview, setMockInterview] = useState([]);
  const [loadingJob, setLoadingJob] = useState(true);
  const [coverLoading, setCoverLoading] = useState(false);
  const [mockLoading, setMockLoading] = useState(false);
  const [openAnswers, setOpenAnswers] = useState({});

  // FETCH JOB
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/ai/job-match/${id}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setJob(data);
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoadingJob(false);
      }
    };

    fetchJob();
  }, [id]);

  // GENERATE COVER LETTER
  const generateCoverLetter = async () => {
    try {
      setCoverLoading(true);

      const res = await fetch(
        `/api/ai/job-match/${id}/cover-letter`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setCoverLetter(data.coverLetter);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setCoverLoading(false);
    }
  };

  // GENERATE MOCK INTERVIEW
  const generateMockInterview = async () => {
    try {
      setMockLoading(true);

      const res = await fetch(
        `/api/ai/job-match/${id}/mock-interview`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMockInterview(data.questions || []);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setMockLoading(false);
    }
  };

  // TOGGLE ANSWER
  const toggleAnswer = (index) => {
    setOpenAnswers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const copyCoverLetter = async () => {
     if(!coverLetter) return;
     try{
    await navigator.clipboard.writeText(coverLetter);
      alert("Cover letter copied!");
     }
    catch(error){
      alert("Failed to copy");
     }
   };

  if (loadingJob) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">

        <div className="bg-white rounded-2xl shadow p-6 mb-6">

  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

    {/* LEFT */}
    <div>

      <h1 className="text-3xl font-bold text-gray-800">
        AI Job Assistance
      </h1>

      <p className="text-gray-500 mt-2">
        Personalized AI assistance for your job application.
      </p>

    </div>

    {/* RIGHT */}
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 min-w-[320px]">
      <h2 className="text-xl font-bold text-indigo-700">
        {job?.job?.title}
      </h2>

      <p className="text-gray-600 mt-1">
        {job?.job?.company}
      </p>

      <div className="flex flex-wrap gap-3 mt-4 text-sm">
        <span className="bg-white px-3 py-1 rounded-full border">
          📍 {job?.job?.location}
        </span>

        <span className="bg-white px-3 py-1 rounded-full border">
          💼 {job?.job?.jobType}
        </span>

        <span className="bg-white px-3 py-1 rounded-full border">
          ⭐ {job?.matchPercentage}% Match
        </span>
      </div>
     </div>
    </div>
  </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* COVER LETTER SECTION */}
        <div className="bg-white rounded-2xl shadow p-6">

          {/* TITLE */}
          <div className="flex items-center gap-3 mb-6">

            <div className="bg-indigo-100 p-3 rounded-xl">
              <FaEnvelope className="text-indigo-600 text-xl" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                AI Cover Letter
              </h2>

              <p className="text-gray-500 text-sm">
                Generate a personalized cover letter for this job.
              </p>
            </div>

          </div>

          {/* BUTTON */}
          {!coverLetter && (
            <button
              onClick={generateCoverLetter}
              disabled={coverLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-xl font-semibold cursor-pointer"
            >
              {coverLoading ? (
                <span className="flex justify-center items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Generating...
                </span>
              ) : (
                "Generate Cover Letter"
              )}
            </button>
          )}

          {/* RESULT */}
          {coverLetter && (
            <div className="space-y-5">
              <div className="bg-gray-50 border rounded-2xl p-5 whitespace-pre-line text-gray-700 leading-7 relative">
                 {
                   coverLetter && (
                     <button
                       onClick={copyCoverLetter}
                       className="absolute right-5 top-5 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
                     >
                       <FaCopy />
                       Copy
                     </button>
                   )
                 }
                {coverLetter}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4">

               <Link href={`/dashboard/student/jobs/${id}/apply`} className="flex-1 bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-xl font-semibold cursor-pointer flex justify-center items-center gap-2">               
                  <FaBriefcase />
                  Apply For This Job
               </Link>
               
                <button
                  onClick={generateCoverLetter}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-xl font-semibold cursor-pointer"
                >
                  Regenerate
                </button>

              </div>

            </div>
          )}
        </div>

        {/* MOCK INTERVIEW SECTION */}
        <div className="bg-white rounded-2xl shadow p-6">

          {/* TITLE */}
          <div className="flex items-center gap-3 mb-6">

            <div className="bg-purple-100 p-3 rounded-xl">
              <FaRobot className="text-purple-600 text-xl" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                AI Mock Interview
              </h2>

              <p className="text-gray-500 text-sm">
                Practice AI-generated interview questions with answers.
              </p>
            </div>

          </div>

          {/* BUTTON */}
          {mockInterview.length === 0 && (
            <button
              onClick={generateMockInterview}
              disabled={mockLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded-xl font-semibold cursor-pointer"
            >
              {mockLoading ? (
                <span className="flex justify-center items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Generating...
                </span>
              ) : (
                "Generate Mock Interview"
              )}
            </button>
          )}

          {/* QUESTIONS */}
          {mockInterview.length > 0 && (
            <div className="space-y-4 max-h-212.5 overflow-y-auto pr-2">

              {mockInterview.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-2xl p-4 bg-gray-50"
                >

                  {/* QUESTION */}
                  <div className="flex justify-between items-start gap-4">

                    <h3 className="font-semibold text-gray-800">
                      {index + 1}. {item.question}
                    </h3>

                    <button
                      onClick={() => toggleAnswer(index)}
                      className="text-indigo-600 cursor-pointer"
                    >
                      {openAnswers[index] ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>

                  </div>

                  {/* ANSWER */}
                  {openAnswers[index] && (
                    <div className="mt-4 bg-white rounded-xl p-4 border text-gray-700 text-sm leading-7">
                      {item.answer}
                    </div>
                  )}

                </div>
              ))}

              {/* REGENERATE */}
              <button
                onClick={generateMockInterview}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded-xl font-semibold cursor-pointer"
              >
                Regenerate Questions
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}