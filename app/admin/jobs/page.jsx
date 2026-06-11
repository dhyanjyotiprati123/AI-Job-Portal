"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const AdminJobsPage =()=> {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
    try {
      const res = await fetch("/api/admin/jobs",{
         credentials:"include"
      });
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.log(err);
    }
  };
    fetchJobs();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Jobs</h1>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Company</th>
              <th className="p-3">Location</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="border-t">
                <td className="p-3">{job.title}</td>
                <td className="p-3">{job.company}</td>
                <td className="p-3">{job.location}</td>
                <td className="p-3">
                    <Link href={`/admin/jobs/${job._id}`}>View Detail</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminJobsPage;