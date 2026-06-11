"use client"

import StudentJobFilter from '@/components/StudentJobFilter'
import StudentJobSearch from "@/components/StudentJobSearch"
import { useEffect, useState } from 'react'
import StudentJobGrid from '@/components/StudentJobGrid'


const StudentsJobPage = () => {
 const [filters, setFilters] = useState({
         jobType: "",
         location: "",
         experience: "",
         search: ""
      });
  const [jobs, setJobs] = useState([])
  const JOB_PER_PAGE = 9;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(jobs.length / JOB_PER_PAGE);
  const startIndex = (currentPage -1) * JOB_PER_PAGE;
  const endIndex = startIndex+JOB_PER_PAGE;
  const currentJobs = jobs.slice(startIndex, endIndex);

useEffect(() => {
  const getAllJobs = async () => {
    try {
      const query = new URLSearchParams({
        jobType: filters.jobType,
        location: filters.location,
        experience: filters.experience
      }).toString();

      const res = await fetch(`/api/jobs?${query}`);
      const data = await res.json();

      if (res.ok) {
        let filtered = data;

        // search (client-side)
        if (filters.search) {
          filtered = filtered.filter((job) =>
            job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            job.company.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        setJobs(filtered);
        setCurrentPage(1);
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
    <div className='p-8 space-y-8'>
       <StudentJobSearch  filters={filters} setFilters={setFilters} />

       <div className="flex gap-8">
         <StudentJobFilter filters={filters} setFilters={setFilters} />

         <div className="mx-auto space-y-8">
          <StudentJobGrid jobs={currentJobs} />

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
  )
}

export default StudentsJobPage