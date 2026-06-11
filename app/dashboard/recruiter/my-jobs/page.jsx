"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyJobsPage() {

 const [jobs, setJobs] = useState([]);

 useEffect(() => {
   const getMyJobs = async()=>{
    try {
      const res = await fetch("/api/recruiter/my-jobs", {
         method: "GET",
         credentials:"include"
      });
       const data = await res.json();
       
       if(res.ok){
        setJobs(data.jobs)
       }else{
        alert(data.message)
       }
    } catch (error) {
      alert(error.message)
    }
   }

   getMyJobs()
 },[])

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-16">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          My Job Posts
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and track your job listings
        </p>
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        {jobs?.map((job) => (
          <MyJobCard key={job._id} job={job} setJobs={setJobs} />
        ))}
      </div>

    </div>
  );
}

/* Job Card Component */

function MyJobCard({ job, setJobs }) {

  const closeJob = async () => {
    try {
      const res = await fetch(`/api/recruiter/my-jobs/${job._id}/close`, {
        method: "PATCH",
        credentials: "include"
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setJobs(prev =>
        prev.map(j =>
          j._id === job._id ? { ...j, isActive: false } : j
        )
      );

      alert("Job closed successfully");

    } catch (error) {
      alert(error.message);
    }
  };

  const deleteJob = async () => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`/api/recruiter/my-jobs/${job._id}/delete`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Remove job from UI
      setJobs(prev =>
        prev.filter(j => j._id !== job._id)
      );

      alert("Job deleted successfully");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 space-y-4 mt-8">

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {job.title}
          </h3>

          <p className="text-sm text-gray-500">
            {job.location} • {job.jobType}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Posted on {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>

        <StatusBadge status={job.isActive ? "Active" : "Closed"} />
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>Applicants: {job.applicants?.length || 0}</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={`/dashboard/recruiter/my-jobs/${job._id}/applicants`} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
          View Applicants
        </Link>

        <Link href={`/dashboard/recruiter/my-jobs/${job._id}/edit`} className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100">
          Edit Job
        </Link>

        {job.isActive && (
          <button
            onClick={closeJob}
            className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
          >
            Close Job
          </button>
        )}

        <button
          onClick={deleteJob}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* Status Badge */

function StatusBadge({ status }) {
  const colors = {
    Active: "bg-green-100 text-green-700",
    Closed: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 text-sm rounded-full ${colors[status]}`}>
      {status}
    </span>
  );
}
