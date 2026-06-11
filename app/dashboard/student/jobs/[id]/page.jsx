"use client"

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobDetailsPage() {

  const { id } =  useParams();
  const [job, setJob] = useState({});

  useEffect(()=>{
     if(!id  || id === undefined) return;

     const getJob = async()=>{
       try {
          const res = await fetch( `/api/jobs/${id}`);
          const data = await res.json();
          if(res.ok){
            setJob(data)
          }else{
              alert(data.message)
          }
       } catch (error) {
          alert(error.message)
       }
     }
      getJob();
  }, [id]);

  const handleSaveJob = async()=>{
    try {
        const res = await fetch("/api/student/save",{
          method: "PATCH",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify({id}),
          credentials:"include"
        });

        const data = await res.json();
        if(res.ok){
          alert(data.message)
        }else{
          alert(`Somethng Went Wrong ${data.message}`)
        }
    } catch (error) {
       alert(error.message)
    }
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white border rounded-xl p-8">

        {/* Back */}
        <Link
          href="/dashboard/student/jobs"
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to Jobs
        </Link>

        {/* Header */}
        <div className="mt-4 mb-6">
          <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
          <p className="text-gray-600">
            {job.company} • {job.location}
          </p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 mb-6">
          <span className="px-4 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm">
            {job.jobType}
          </span>
          <span className="px-4 py-1 rounded-full bg-emerald-100 text-emerald-600 text-sm">
            {job.experienceLevel}
          </span>
          <span className="px-4 py-1 rounded-full bg-amber-100 text-amber-600 text-sm">
            {job.salary}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
           <p className="border rounded-sm p-2 text-md font-light flex justify-center items-center">
             Deadline: {job.deadline}
           </p>
           <p className="border rounded-sm p-2 text-sm font-light flex justify-center items-center">
             Active: {job.isActive ? "active" : "closed"}
           </p>
        </div>

        <div className="flex flex-col flex-wrap gap-4 mb-6">
          <h3 className="font-semibold text-lg">
            Skills Required
          </h3>
          <p className="flex gap-4 items-center">
            {
              job.skillsRequired?.map((j, index) => <span className="text-md text-blue-400" key={index}>{j}</span>)
            }
          </p>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-2">Job Description</h3>
          <p className="text-gray-700 leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link href={`/dashboard/student/jobs/${id}/apply`} className="px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer">
            Apply Now
          </Link>
          <button className="px-6 py-2 rounded-md border text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={handleSaveJob}>
            Save Job
          </button>
        </div>
      </div>
    </div>
  );
}
