"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const ApplicantDetailsPage = ()=> {
  const { id } = useParams();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/recruiter/applications/${id}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setApp(data);
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <p className="p-10">Loading...</p>;

  if (!app) return <p className="p-10">No Data Found</p>;

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-8">

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          {app.student.user.name}
        </h1>
        <p className="text-gray-500">{app.student.user.email}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Applied Job
        </h2>

        <p className="text-gray-700">
          <strong>{app.job.title}</strong> ({app.job.jobType})
        </p>
        <p className="text-sm text-gray-500">{app.job.company}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Contact Details
        </h2>

        <p>📞 {app.student.phone || "Not provided"}</p>
        <p>📍 {app.student.location || "Not provided"}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Skills
        </h2>

        <div className="flex flex-wrap gap-2">
          {app.student.skills?.length > 0 ? (
            app.student.skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No skills added</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Resume
        </h2>

        {app.resume ? (
          <a
            href={app.resume}
            target="_blank"
            className="text-indigo-600 underline"
          >
            View Resume
          </a>
        ) : (
          <p className="text-gray-500">No resume uploaded</p>
        )}
      </div>

      {/* Cover Letter */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Cover Letter
        </h2>

        <p className="text-gray-700 whitespace-pre-line">
          {app.coverLetter}
        </p>
      </div>

    </div>
  );
}

export default ApplicantDetailsPage;