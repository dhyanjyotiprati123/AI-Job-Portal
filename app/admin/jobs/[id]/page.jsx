"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBill,
  FaUserTie,
  FaEnvelope,
  FaTrash,
  FaUsers,
  FaClock,
} from "react-icons/fa";

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
     title: "",
     company: "",
     location: "",
     salary: "",
     jobType: "",
     experienceLevel: "",
     description: "",
   });

  useEffect(() => {
     const fetchJob = async () => {
       try {
        const res = await fetch(`/api/admin/jobs/${id}`,{
           credentials:"include"
        });
        const data = await res.json();
        if(res.ok){
          setJob(data);
        }else{
           alert(data.message)
        }
       } catch (error) {
         alert(error.message)
       }
    };
    if (id) fetchJob();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = confirm("Delete this job?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
         method: "DELETE",
         credentials:"include"
       });
      
      const data = await res.json();
      
      if(res.ok){
         router.push("/admin/jobs");
      }else{
        alert(data.message)
      }
    } catch (error) {
       alert(error.message)
    }
  };

  const handleOpen = () => {
   setForm({
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary,
    jobType: job.jobType,
    experienceLevel: job.experienceLevel,
    description: job.description,
  });

   setOpen(true);
 };

 const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

const handleUpdate = async () => {
  try {
    const res = await fetch(`/api/admin/jobs/${id}`, {
       method: "PATCH",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(form),
       credentials:"include"
    });
   const data = await res.json();
   
   if(res.ok){
     alert(data.message)
     setOpen(false)
   }else{
    alert(data.message)
   }
  } catch (error) {
    alert(error.message)
  }
};

  if (!job) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Job Details</h1>

          <button
           onClick={handleOpen}
           className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-full shadow cursor-pointer"
         >
         ✏️ Edit Job
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full shadow-md transition cursor-pointer"
        >
          <FaTrash />
          Delete Job
        </button>

        
      </div>

      {/* 📄 JOB INFO */}
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-indigo-600">
          <FaBriefcase /> Job Information
        </h2>

        <p className="text-lg font-bold">{job.title}</p>

        <p className="flex items-center gap-2 text-gray-600">
          <FaMapMarkerAlt /> {job.location}
        </p>

        <p className="flex items-center gap-2 text-gray-600">
          <FaMoneyBill /> {job.salary || "Not specified"}
        </p>

        <p className="flex items-center gap-2 text-gray-600">
          <FaClock /> {job.jobType} • {job.experienceLevel}
        </p>

        <p className="text-gray-700 mt-2">{job.description}</p>
      </div>

      {/* 🧑‍💼 RECRUITER */}
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-purple-600">
          <FaUserTie /> Recruiter Details
        </h2>

        <p className="font-semibold">
          {job.recruiter?.companyName}
        </p>

        <p className="flex items-center gap-2 text-gray-600">
          <FaEnvelope /> {job.recruiter?.companyEmail}
        </p>

        <p className="text-gray-600">
          Contact: {job.recruiter?.user?.name}
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-green-600 mb-4">
          <FaUsers /> Applicants ({job.applicants.length})
        </h2>

        {job.applicants.length === 0 ? (
          <p className="text-gray-500">No applicants yet</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {job.applicants.map((app) => (
              <div
                key={app._id}
                className="p-4 rounded-xl border bg-gray-50 hover:shadow-md transition"
              >
                <p className="font-semibold">
                  {app.student?.user?.name}
                </p>

                <p className="text-sm text-gray-500">
                  {app.student?.user?.email}
                </p>

                <p className="mt-2 text-sm">
                  Status:{" "}
                  <span className="font-medium text-indigo-600">
                    {app.status}
                  </span>
                </p>

                {app.resume && (
                  <a
                    href={app.resume}
                    target="_blank"
                    className="text-blue-500 text-sm underline mt-2 block"
                  >
                    View Resume
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {open && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl space-y-4">

      <h2 className="text-xl font-semibold">Edit Job</h2>

      {/* Inputs */}
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Job Title"
        className="w-full p-2 border rounded-lg"
      />

      <input
        name="company"
        value={form.company}
        onChange={handleChange}
        placeholder="Company"
        className="w-full p-2 border rounded-lg"
      />

      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Location"
        className="w-full p-2 border rounded-lg"
      />

      <input
        name="salary"
        value={form.salary}
        onChange={handleChange}
        placeholder="Salary"
        className="w-full p-2 border rounded-lg"
      />

      <select
        name="jobType"
        value={form.jobType}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      >
        <option>Full-Time</option>
        <option>Part-Time</option>
        <option>Internship</option>
        <option>Remote</option>
        <option>Contract</option>
      </select>

      <select
        name="experienceLevel"
        value={form.experienceLevel}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
      >
        <option>Fresher</option>
        <option>Junior</option>
        <option>Mid-Level</option>
        <option>Senior</option>
      </select>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 border rounded-lg"
      />

      {/* Buttons */}
      <div className="flex justify-end gap-3">

        <button
          onClick={() => setOpen(false)}
          className="px-4 py-2 rounded-lg bg-gray-300"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="px-4 py-2 rounded-lg bg-indigo-500 text-white"
        >
          Save Changes
        </button>

      </div>

    </div>
  </div>
)}

    </div>
  );
}