"use client";

import { useEffect, useState } from "react";
import { FaUserEdit, FaPhone, FaMapMarkerAlt, FaTools, FaFileAlt, FaTimes } from "react-icons/fa";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [user, setUser] = useState({})

  useEffect(()=>{
     const fetchProfile = async()=>{
       try {
        const res = await fetch("/api/student/profile",{
           credentials:"include"
        });
        const data = await res.json();
        if(res.ok){
          setProfile(data);
          setSkills(data.skills || []); 
          setLoading(false)
        }
        else{
          alert(data.message)
        }
       } catch (error) {
         alert(error.message)
       }
     };

     const fetchUser = async()=>{
       try {
         const res = await fetch("/api/me",{
           credentials: "include"
         });
         const data = await res.json();
         if(res.ok){
           setUser(data)
         }else{
           alert(data.message)
         }
       } catch (error) {
          alert(error.message)
       }
     };

     fetchProfile();
     fetchUser();
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const addSkill = () => {
   if (!newSkill.trim()) return;

   if (!skills.includes(newSkill.trim())) {
    setSkills([...skills, newSkill.trim()]);
  }

   setNewSkill("");
  };

const removeSkill = (skill) => {
  setSkills(skills.filter((s) => s !== skill));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/student/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: profile.phone,
        location: profile.location,
        resume: profile.resume,
        skills: skills
      }),
      credentials: "include",
    });

    const data = await res.json();
    alert(data.message);

    setSaving(false);
    setEditOpen(false);
  };

  const handleResume =async (e)=>{
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

  try {
    const res = await fetch("/api/student/resume", {
      method: "PATCH",
      body: formData,
      credentials: "include"
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
    } else {
      alert("Resume uploaded");

      setProfile((prev) => ({
        ...prev,
        resume: data.resume
      }));
    }
  } catch (error) {
    alert("Upload failed");
  }
  }

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            <FaUserEdit />
            Edit Profile
          </button>
        </div>

        {/* Basic Info */}
        <div className="mb-6 p-5 bg-indigo-50 rounded-xl">
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </div>

        {/* Details */}
        <div className="space-y-4">

          <div className="flex items-center gap-3">
            <FaPhone className="text-indigo-600" />
            <span>{profile.phone || "Not provided"}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-indigo-600" />
            <span>{profile.location || "Not provided"}</span>
          </div>

          <div className="flex items-start gap-3">
            <FaTools className="text-indigo-600 mt-1" />
            <div className="flex flex-wrap gap-2">
              {profile.skills?.length > 0 ? (
                profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span>No skills added</span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Resume Section */}
<div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-8">

  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold flex items-center gap-2">
      <FaFileAlt className="text-indigo-600"/>
      Resume
    </h2>
  </div>

  {profile.resume ? (
    <div className="flex items-center justify-between">

      <a
        href={profile.resume}
        target="_blank"
        className="text-indigo-600 underline"
      >
        View Uploaded Resume
      </a>

      <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
        Replace Resume
        <input
          type="file"
          name="resume"
          className="hidden"
          onChange={handleResume}
        />
      </label>

    </div>
  ) : (
    <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
      Upload Resume
      <input
        type="file"
        className="hidden"
        onChange={handleResume}
      />
    </label>
  )}

</div>

{
  profile?.resume && 
  (
    <div className="mt-16 max-w-3xl mx-auto">
      <h3 className="text-xl font-bold mb-4 text-slate-700">
       Resume Preview
      </h3>

      <div className="rounded-2xl overflow-hidden border shadow-lg h-180">

        <iframe
          src={profile?.resume}
          className="w-full h-full"
        />

      </div>
    </div>
  )
}


      {/* EDIT MODAL */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl relative">

            <button
              onClick={() => setEditOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <FaTimes size={18} />
            </button>

            <h2 className="text-xl font-semibold mb-5">
              Edit Profile
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full px-4 py-2 border rounded-xl"
              />

              <input
                type="text"
                name="location"
                value={profile.location || ""}
                onChange={handleChange}
                placeholder="Location"
                className="w-full px-4 py-2 border rounded-xl"
              />

              {/* Skills */}
<div>
  <label className="block text-sm text-gray-600 mb-2">
    Skills
  </label>

  {/* Skill Chips */}
  <div className="flex flex-wrap gap-2 mb-3">
    {skills.map((skill) => (
      <div
        key={skill}
        className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm"
      >
        {skill}
        <button
          type="button"
          onClick={() => removeSkill(skill)}
          className="text-xs hover:text-red-500"
        >
          ×
        </button>
      </div>
    ))}
  </div>

  {/* Add Skill Input */}
  <div className="flex gap-2">
    <input
      type="text"
      value={newSkill}
      onChange={(e) => setNewSkill(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addSkill();
        }
      }}
      placeholder="Add skill..."
      className="border rounded-md px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />

    <button
      type="button"
      onClick={addSkill}
      className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition"
    >
      Add
       </button>
       </div>
   </div>

      <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 rounded-xl text-white ${
              saving
                ? "bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}