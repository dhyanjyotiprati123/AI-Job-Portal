"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ApplyJobPage() {
  const { id } = useParams();
  const router = useRouter();

  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverLetter.trim()) {
      alert("Cover letter is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/student/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId:id,coverLetter }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Application submitted successfully 🎉");
        router.push("/dashboard/student/applications");
      } else {
        alert(data.message);
      }

    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md">

        <Link
          href={`/dashboard/student/jobs/${id}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to Job Details
        </Link>

        <h1 className="text-2xl font-bold mt-4 mb-6">
          Apply for this Job
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Your profile details and resume will be shared with the recruiter.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Cover Letter
            </label>
            <textarea
              rows="6"
              required
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Write a short cover letter explaining why you're a good fit..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>

        </form>
      </div>
    </div>
  );
}