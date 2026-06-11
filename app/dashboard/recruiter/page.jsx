"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function RecruiterDashboard() {
   const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    shortlisted: 0
  });

  const [applications, setApplications] = useState([]);

    useEffect(() => {

    const fetchDashboard = async () => {

      const res = await fetch("/api/recruiter/dashboard", {
        credentials: "include"
      });

      const data = await res.json();

      if (res.ok) {
        setStats(data);
        setApplications(data.recentApplications);
      } else {
        alert(data.message);
      }

    };

    fetchDashboard();

  }, []);

  console.log(applications)

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-16">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Recruiter Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your job postings and applicants
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <StatCard title="Active Jobs" value={stats.activeJobs} />
        <StatCard title="Total Applicants" value={stats.totalApplicants} />
        <StatCard title="Shortlisted" value={stats.shortlisted} />

      </div>

      {/* Quick Actions */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <ActionButton text="Post New Job" link="/dashboard/recruiter/post-job" />
          <ActionButton text="View My Jobs" link="/dashboard/recruiter/my-jobs" />
          <ActionButton text="View Applicants" link="/dashboard/recruiter/applicants" />
        </div>
      </div>

      {/* Recent Applications Preview */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Recent Applications
        </h2>

        <div className="space-y-4">
          {
            applications.length === 0 ? 
            <div>
              <h2>Nothing to show ...No Recent Applications</h2>
            </div> : 
            <div className="flex gap-8 flex-wrap">
              {
                applications.map((a)=> <ApplicantCard key={a._id} a={a}  />)
              }
            </div>
          }
        </div>
      </div>

    </div>
  );
}

/* Components */

function StatCard({ title, value }) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-indigo-600 mt-2">{value}</h3>
    </div>
  );
}

function ActionButton({ text , link}) {
  return (
    <Link href={link} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition cursor-pointer">
      {text}
    </Link>
  );
}

const ApplicantCard = ({ a }) => {
  return (
    <div className="w-72 h-64 p-6 rounded-2xl 
                    bg-linear-to-br from-green-50 via-violet-50 to-purple-100
                    border border-gray-200 
                    shadow-sm hover:shadow-lg 
                    transition-all duration-300 flex flex-col justify-between items-center">

      {/* Top Section */}
      <div>
        <div className="mb-4">
          <p className="text-xl font-semibold text-gray-800">
            {a.student.user.name}
          </p>
          <p className="text-sm text-gray-600 wrap-break-words">
            {a.student.user.email}
          </p>
        </div>

        {/* Tag */}
        <span className="inline-block text-xs px-3 py-1 rounded-full 
                         bg-green-100 text-green-700">
          Applicant
        </span>
      </div>

      {/* Bottom Section */}
      <div className="mt-6">
        <Link
          href={`/dashboard/recruiter/applicants/${a._id}`}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition cursor-pointer"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
