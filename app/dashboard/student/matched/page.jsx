"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function RecommendedJobs() {

  const [jobs,setJobs]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");

  useEffect(()=>{
    const fetchJobs=async()=>{
     try{
      const res=await fetch("/api/ai/job-match",
        {
          credentials:"include"
        }
      );
      const data=await res.json(); 
      if(res.ok){
        setJobs(data);
      }else{
        alert(data.message)
      }
    }
    catch(error){
      alert(error.message)
    }
    setLoading(false);
    }
    fetchJobs();
  },[]);

  const filteredJobs=jobs.filter((job)=>{
    return(
      job.title
      .toLowerCase()
      .includes(search.toLowerCase())
      ||
      job.company
      .toLowerCase()
      .includes(search.toLowerCase())
    )
  })

  if(loading){
    return(
      <div className="p-10">
        Loading...
      </div>
    )
  }

  return (

    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          AI Recommended Jobs
        </h1>

        <p className="text-gray-600">
          Jobs matched according to your resume analysis
        </p>
      </div>

      <div className="relative mb-8">
        <FaSearch className="absolute top-4 left-4 text-gray-400"/>
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="w-full bg-white p-4 pl-12 rounded-xl shadow outline-none"
        />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredJobs.map((job)=>(
          <div
          key={job._id}
          className=" bg-white rounded-2xl p-6 shadow-md"
          >
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {job.title}
                </h2>
                <p className="text-gray-600">
                  {job.company}
                </p>
              </div>
              <div>

                <div
                className={` text-white px-4 py-2  rounded-full font-medium
                ${
                  job.matchPercentage>=80
                  ? "bg-green-500"
                  : job.matchPercentage>=50
                  ? "bg-yellow-500"
                  : "bg-red-500"
                }
                `}
                >
                  {job.matchPercentage}%
                </div>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt/>
                {job.location}
              </div>
              <div className="flex items-center gap-2">
                <FaBriefcase/>
                {job.jobType}
              </div>
              <div className="flex items-center gap-2">
                <FaMoneyBillWave/>
                {job.salary}
              </div>
            </div>

            <div className="mt-5">
              <p className="font-medium mb-2">
                Matched Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {job.matchedSkills.map((skill)=>(                  
                  <span
                    key={skill}
                    className=" bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <p className="font-medium mb-2">
                Missing Skill
              </p>
              <div className="flex flex-wrap gap-2">
                {job.missingSkills.map((skill)=>(                  
                  <span
                    key={skill}
                    className=" bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <Link href={`/dashboard/student/matched/${job._id}`}>
              <button className=" mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 cursor-pointer">
                 View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}