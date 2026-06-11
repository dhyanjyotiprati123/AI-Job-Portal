"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FaUser,
  FaBriefcase,
  FaEnvelope,
  FaFileAlt,
  FaCheckCircle,
  FaTrash,
  FaCheck,
  FaTimes
} from "react-icons/fa";

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const [app, setApp] = useState(null);

  useEffect(() => {
    const fetchApp = async () => {
        try {
             const res = await fetch(`/api/admin/applications/${id}`);
             const data = await res.json();
             if(res.ok){
               setApp(data);
             }else{
                alert(data.message)
             }   
        } catch (error) {
            alert(error.message)
        }
    };
    if (id) fetchApp();
   }, [id]);

   const updateStatus = async(status)=>{
      try {
        const res = await fetch(`/api/admin/applications/${id}`,{
           method:"PATCH",
           headers:{
             "Content-Type":"application/json"
           },
           body: JSON.stringify({status}),
           credentials:"include"
        });

        const data = await res.json();
        if(res.ok){
          alert(data.message)
        }else{
          alert(data.message)
        }
      } catch (error) {
        alert(error.message)
      }
   }

   const handleDelete = async()=>{
     try {
       const res = await fetch(`/api/admin/applications/${id}`,{
         method:"DELETE",
         credentials:"include"
       });
       const data = await res.json();
       alert(data.message)
     } catch (error) {
       alert(error.message)
     }
   }

  if (!app) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* 🔷 Title */}
      <h1 className="text-3xl font-bold">Application Details</h1>

       <button
          onClick={handleDelete}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full shadow cursor-pointer"
        >
          <FaTrash />
          Delete
        </button>

      {/* 👤 Student Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-indigo-600 mb-3">
          <FaUser /> Student Info
        </h2>

        <p><strong>Name:</strong> {app.student?.user?.name}</p>
        <p className="flex items-center gap-2 text-gray-600">
          <FaEnvelope /> {app.student?.user?.email}
        </p>
      </div>

      {/* 💼 Job Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-purple-600 mb-3">
          <FaBriefcase /> Job Info
        </h2>

        <p><strong>Title:</strong> {app.job?.title}</p>
        <p><strong>Company:</strong> {app.job?.company}</p>
        <p><strong>Location:</strong> {app.job?.location}</p>
      </div>

      {/* 📄 Application Info */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-green-600 mb-3">
          <FaFileAlt /> Application Info
        </h2>

        <p>
          <strong>Status:</strong>{" "}
          <span className="ml-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-600">
            {app.status}
          </span>
        </p>

        <div className="flex gap-4 items-center justify-around">
          <button
            onClick={() => updateStatus("Accepted")}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full cursor-pointer"
          >
            <FaCheck /> Accept
          </button>

          <button
            onClick={() => updateStatus("Rejected")}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full cursor-pointer"
          >
            <FaTimes /> Reject
          </button>

          <button
            onClick={() => updateStatus("Reviewed")}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full cursor-pointer"
          >
            <FaCheckCircle />
            Review
          </button>
        </div>

        <p className="mt-3">
          <strong>Cover Letter:</strong>
        </p>
        <p className="text-gray-600 mt-1">{app.coverLetter}</p>

        {app.resume && (
          <a
            href={app.resume}
            target="_blank"
            className="inline-block mt-3 text-blue-500 underline"
          >
            View Resume
          </a>
        )}
      </div>

    </div>
  );
}