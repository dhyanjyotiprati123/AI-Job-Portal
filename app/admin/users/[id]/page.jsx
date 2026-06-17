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
import { FiEdit } from "react-icons/fi";

export default function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [open, setOpen] =useState(false);
  const [formData, setFormData] = useState({
     name: "",
     email: "",
     phone: "",
     location: "",
     skills: "",
     companyName: "",
     companyEmail: "",
     companySize: "",
     description: "",
     industry: "",
     website : ""
});


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

  const handleOpen = ()=>{
    setFormData({
      name: user?.name || "",
      email: user?.email || "",

    phone:
      studentProfile?.phone ||
      recruiterProfile?.phone ||
      "",

    location:
      studentProfile?.location ||
      recruiterProfile?.location ||
      "",

    skills:
      studentProfile?.skills?.join(", ") ||
      "",

    companyName:
      recruiterProfile?.companyName || "",

    companyEmail:
      recruiterProfile?.companyEmail || "",

    companySize:
      recruiterProfile?.companySize || "",

    description:
      recruiterProfile?.description || "",

    industry:
      recruiterProfile?.industry || "",

    website:
      recruiterProfile?.website || "",
  });

  setOpen(true);
  }

  const handleChange =(e)=>{
    setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
  }

  const handleUpdate = async (e) => {
   e.preventDefault();

   try {
    const res = await fetch(
      `/api/admin/users/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          skills: formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      }
    );

    const result = await res.json();

    if (res.ok) {
      alert("User Updated");
      setOpen(false);

      const refreshed = await fetch(
        `/api/admin/users/${id}`
      );

      const refreshedData =
        await refreshed.json();

      setData(refreshedData);
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert(error.message);
  }
};

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

        <div className="flex items-center gap-8 p-4">
         <button
           onClick={handleDelete}
           className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
         >
           <FaTrash />
           Delete User
         </button>

         <button
          onClick={handleOpen}
           className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
         >
            <FiEdit  />
             Edit User
         </button>
        </div>
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



{
  open && (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl p-6 w-full max-w-xl">

        <h2 className="text-2xl font-bold mb-4">
          Edit User
        </h2>

        <form
          onSubmit={handleUpdate}
          className="space-y-4"
        >

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border p-3 rounded"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-3 rounded"
          />

          {data?.user.role === "student" && (
           <>
             <input
               type="text"
               name="phone"
               value={formData.phone}
               onChange={handleChange}
               placeholder="Phone"
               className="w-full border p-3 rounded"
             />
         
             <input
               type="text"
               name="location"
               value={formData.location}
               onChange={handleChange}
               placeholder="Location"
               className="w-full border p-3 rounded"
             />
         
             <textarea
               name="skills"
               value={formData.skills}
               onChange={handleChange}
               placeholder="React, Node, MongoDB"
               className="w-full border p-3 rounded"
               rows={4}
             />
           </>
         )}

         {data?.user.role === "recruiter" && (
         <>
           <input
             type="text"
             name="companyName"
             value={formData.companyName}
             onChange={handleChange}
             placeholder="Company Name"
             className="w-full border p-3 rounded"
           />

           <input
             type="text"
             name="phone"
             value={formData.phone}
             onChange={handleChange}
             placeholder="Phone"
             className="w-full border p-3 rounded"
           />

           <input
             type="text"
             name="location"
             value={formData.location}
             onChange={handleChange}
             placeholder="Location"
             className="w-full border p-3 rounded"
           />
         </>
       )}

      <div className="flex justify-end gap-3 pt-4">

      <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 border rounded"
      >
          Cancel
      </button>

      <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          onClick={handleUpdate}
      >
          Save Changes
      </button>

      </div> 
    </form>
    </div>
</div>
  )
}
    </div>
  );
}