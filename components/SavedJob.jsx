"use client"

import Link from "next/link";

export default function SavedJobCard( {job, onremove} ) {
  const removeSavedJob = async() =>{
     try {
        const res = await fetch("/api/student/savedjobs",{
          method:"PATCH",
          headers:{
            "Content-Type":"application/json"
          },
          credentials:"include",
          body: JSON.stringify({id:job._id})
        });

        const data = await res.json();
        if(res.ok){
          alert(data.message);
          onremove(job._id)
        }else{
          alert(`Something Went Wrong ${data.message}`)
        }
     } catch (error) {
        alert(error.message)
     }
  }
  return (
    <div className="bg-white border rounded-lg p-5 space-y-4 hover:shadow-sm transition ">
    
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {job.title}
        </h3>
        <p className="text-sm text-gray-500">
          {job.company} • {job.location}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
        <span className="px-3 py-1 bg-gray-100 rounded-full">
          {job.jobType}
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded-full">
          {job.experienceLevel}
        </span>
        <span className="px-3 py-1 bg-gray-100 rounded-full">
          {job.salary}
        </span>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2">
        {job.description}
      </p>

      <div className="flex justify-between text-xs text-gray-500 border-t pt-3">
        <span>
          Saved on: <strong>{job.savedDate}</strong>
        </span>
        <span>
          Apply before: <strong>{job.applicationEndDate}</strong>
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button className="text-sm text-red-500 hover:underline cursor-pointer" onClick={removeSavedJob}>
          Remove
        </button>
        <Link href={`/dashboard/student/jobs/${job._id}/apply`} className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">
          Apply Now
        </Link>
      </div>
    </div>
  );
}
