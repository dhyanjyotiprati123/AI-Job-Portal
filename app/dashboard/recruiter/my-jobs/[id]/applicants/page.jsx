"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function JobApplicantsPage() {
  const { id } = useParams();
  const [job, setJob] = useState({})
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matched, setMatched] = useState(null);
  

  useEffect(() => {
    const fetchJob = async()=>{
       try {
        const res = await fetch(`/api/jobs/${id}`);
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

    const fetchApplicants = async () => {
      try {
        const res = await fetch(`/api/recruiter/my-jobs/${id}/applicants`,
          { credentials: "include" }
        );

        const data = await res.json();

        if (res.ok) {
          setApplications(data);
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
    fetchApplicants();
  }, [id]);

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-16">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Applicants for this Job
        </h1>
      </div>

      <div className="border-2 border-green-600 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-gray-700">
          {job.title}
        </h2>
        <p className="text-md font-light">
          Job Type : {job.jobType}
        </p>
        <p className="text-md font-light">
          Location : {job.location}
        </p>
        <p className="text-md font-light">
          Salary : {job.salary}
        </p>
        <p className="text-md font-light">
          Experience : {job.experienceLevel}
        </p>
        <div className="flex gap-4 items-center mt-2">
          {
            job.skillsRequired.map((s , index) => <p key={index} className="p-2 rounded-xl bg-blue-100 font-sm">{s}</p>)
          }
        </div>
      </div>


      {/* Applicants */}
      <div className="space-y-6">
        {applications?.length === 0 ? (
          <p className="text-gray-500">No applicants yet</p>
        ) : (
          applications?.map((app) => (
             <ApplicantCard key={app._id} app={app} setApplications={setApplications} />
          ))
        )}
      </div>

    </div>
  );
}


function ApplicantCard({ app, setApplications }){

  const updateStatus = async (status) => {
    try {
      const res = await fetch(`/api/recruiter/applications/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({applicationId:app._id , status }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // ✅ instant UI update
      setApplications(prev =>
        prev.map(a =>
          a._id === app._id ? { ...a, status } : a
        )
      );

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-white border rounded-xl p-6 space-y-5 shadow-sm hover:shadow-lg transition">

      {/* Top */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        <div>
          <h3 className="font-semibold text-lg text-gray-800">
            {app.student.user.name}
          </h3>

          <p className="text-sm text-gray-500">
            {app.student.user.email}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {app.student.location || "No location"}
          </p>
        </div>
          <StatusBadge status={app.status} />
      </div>

      <div className="p-6 flex gap-8">
       <span
         className={`px-3 py-1 rounded-full text-sm font-medium flex items-center justify-center
         ${
           app.matchPercentage >= 80
             ? "bg-green-100 text-green-700"
             : app.matchPercentage >= 50
             ? "bg-yellow-100 text-yellow-700"
             : "bg-red-100 text-red-700"
         }`}
       >
         {app.matchPercentage}% Match
      </span>

      <h2 className="text-md font-light p-2 border rounded-3xl w-30 text-center">{app.verdict}</h2>
     </div>

     <div className="p-8 border border-green-800 rounded-2xl">
        <h2 className="text-md text-blue-900">Matched    Skills :</h2>
        {
          app.matchedSkills.map((m,i)=> <span key={i} className="text-sm"> {m} ,</span>)
        }
     </div>

     <div className="p-8 border border-green-800 rounded-2xl">
        <h2 className="text-md text-blue-900">Missing    Skills :</h2>
        {
          app.missingSkills.map((m,i)=> <span key={i} className="text-sm"> {m} ,</span>)
        }
     </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <a
          href={app.resume}
          target="_blank"
          className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
        >
          Resume
        </a>

        <button
          onClick={() => updateStatus("Accepted")}
          className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Accept
        </button>

        <button
          onClick={() => updateStatus("Reviewed")}
          className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          Review
        </button>

        <button
          onClick={() => updateStatus("Rejected")}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Reject
        </button>

      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Reviewed: "bg-blue-100 text-blue-700",
    Accepted: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-4 py-1 text-sm rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}