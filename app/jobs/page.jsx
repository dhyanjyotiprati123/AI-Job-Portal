"use client";

import { useEffect, useState } from "react";
import JobFilters from "@/components/JobFilters";
import JobsGrid from "@/components/JobGrid";


export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    jobType: "",
    location: "",
    experience: ""
  })
  const JOBS_PER_PAGE = 9;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);

  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;

  const currentJobs = jobs.slice(startIndex, endIndex);

 useEffect(() => {
  const getAllJobs = async () => {
    try {
      const query = new URLSearchParams(filters).toString();

      const res = await fetch(`/api/jobs?${query}`);
      const data = await res.json();

      if (res.ok) {
        setJobs(data);
        setCurrentPage(1); // reset page
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  getAllJobs();
}, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Job Openings</h1>
          <p className="text-gray-600">
            Showing {currentJobs.length} of {jobs.length} jobs
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">

          {/* Filters */}
          <JobFilters filters={filters} setFilters={setFilters} />

          {/* Jobs + Pagination */}
          <div className="md:col-span-3 space-y-8">

            {/* Job Grid */}
            <JobsGrid jobs={currentJobs} />

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 flex-wrap">

              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md text-sm border
                      ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "bg-white hover:bg-gray-100"
                      }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
              >
                Next
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
