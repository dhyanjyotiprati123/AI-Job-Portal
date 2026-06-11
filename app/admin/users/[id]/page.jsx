"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaTrash,
  FaFileAlt,
} from "react-icons/fa";

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
     try {
       const res = await fetch(`/api/admin/users/${id}`);
       const result = await res.json();
       if(res.ok){
          setData(result)
       }else{
          alert(result.message)
       }
     } catch (error) {
        alert(error.message)
     }
    
  };
    if (id) fetchUser();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = confirm("Delete this user?");
    if (!confirmDelete) return;
    try {
       const res = await fetch(`/api/admin/users/${id}`, {
         method: "DELETE",
         credentials:"include"
        });
        const data = await res.json();
        if(res.ok){
            router.push("/admin/users");
        }else{
          alert(data.message)
        }
    } catch (error) {
       alert(error.message)
    }
  };

  if (!data) return <p className="p-6">Loading...</p>;

  const { user, studentProfile, recruiterProfile, applications, jobsPosted } = data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          User Details
        </h1>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
        >
          <FaTrash />
          Delete User
        </button>
      </div>

      {/* 👤 USER + PROFILE */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* 👤 USER INFO */}
        <div className="bg-linear-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaUser /> User Info
          </h2>

          <p className="flex items-center gap-2">
            <FaEnvelope /> {user.email}
          </p>

          <p className="flex items-center gap-2 mt-2">
            <FaShieldAlt /> Role: {user.role}
          </p>

          <p className="mt-2 font-medium">{user.name}</p>
        </div>

        {/* 🎓 STUDENT */}
        {user.role === "student" && studentProfile && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaUser /> Student Profile
            </h2>

            <p className="flex items-center gap-2">
              <FaPhone /> {studentProfile.phone}
            </p>

            <p className="flex items-center gap-2 mt-2">
              <FaMapMarkerAlt /> {studentProfile.location}
            </p>

            <div className="mt-3">
              <p className="font-medium">Skills:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {studentProfile.skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-3 flex items-center gap-2">
              <FaFileAlt />
              {studentProfile.resume ? (
                <a
                  href={studentProfile.resume}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  View Resume
                </a>
              ) : (
                "No resume"
              )}
            </p>
          </div>
        )}

        {/* 🧑‍💼 RECRUITER */}
        {user.role === "recruiter" && recruiterProfile && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaBriefcase /> Recruiter Profile
            </h2>

            <p className="font-semibold">
              {recruiterProfile.companyName}
            </p>

            <p className="text-sm text-gray-500">
              {recruiterProfile.companyEmail}
            </p>

            <p className="mt-2 flex items-center gap-2">
              <FaPhone /> {recruiterProfile.phone}
            </p>

            <p className="flex items-center gap-2 mt-2">
              <FaMapMarkerAlt /> {recruiterProfile.location}
            </p>
          </div>
        )}
      </div>

      {/* 📄 APPLICATIONS */}
      {applications && (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Applications
          </h2>

          {applications.length === 0 ? (
            <p>No applications</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="border p-4 rounded-xl bg-gray-50"
                >
                  <p className="font-semibold">{app.job?.title}</p>
                  <p className="text-sm text-gray-500">{app.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 💼 JOBS POSTED */}
      {jobsPosted && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Jobs Posted
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
           {jobsPosted.map((job) => (
             <div
               key={job._id}
               className="bg-white p-5 rounded-2xl shadow-lg flex flex-col justify-between h-80 hover:shadow-xl transition"
             >
               <div>
                 <h3 className="font-bold text-lg">{job.title}</h3>
                 <p className="text-gray-500 text-lg font-semibold">{job.company}</p>

                 <p className="text-md mt-2 text-gray-600">
                   📍 {job.location}
                 </p>

                 <p className="text-md text-gray-600">
                   💼 {job.jobType}
                 </p>

                 <p className="text-md text-gray-600">
                   🎯 {job.experienceLevel}
                 </p>
               </div>

      
               <div className="mt-3">
                 <p className="text-sm font-semibold">
                   Applicants: {job.applicants.length}
                 </p>
               </div>
             </div>
           ))}
         </div>
        </div>
      )}

    </div>
  );
}