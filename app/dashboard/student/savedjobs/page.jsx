"use client" 

import SavedJobCard from "@/components/SavedJob";
import { useEffect, useState } from "react";


const SavedJobsPage = () => {

  const [jobs, setJobs] = useState([]);

  useEffect(()=>{
    const getAllSavedJobs = async()=>{
      try {
         const res = await fetch("/api/student/savedjobs", {
           credentials: "include"
         });
         const data = await res.json();
         if(res.ok){
            setJobs(data)
         }else{
            alert(data.message)
         }
      } catch (error) {
         alert(error.message)
      }
    };

    getAllSavedJobs()
  },[]);

  const removeJobFromUI = (jobId) => {
    setJobs(prev => prev.filter(job => job._id !== jobId));
  };

  if(jobs.length === 0){
    return (
      <div className="mx-auto p-8 max-w-7xl">
         <h1>No Jobs Saved By You....till now!</h1>
      </div>
    )
  }

 
  return (
    <div className='mx-auto p-8 max-w-7xl grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {
          jobs?.map((j) => 
            <SavedJobCard key={j._id} job={j} onremove={removeJobFromUI} />
          )
        }
    </div>
  )
}

export default SavedJobsPage