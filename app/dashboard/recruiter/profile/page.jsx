"use client";

import { useEffect, useState } from "react";

export default function RecruiterProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [recruiter, setRecruiter] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
     const getProfile = async()=>{
       try {
         const res = await fetch("/api/recruiter/profile", {
           method: "GET",
           credentials:"include"
         });
         const data = await res.json();
         setRecruiter(data.recruiter);
         setFormData(data.recruiter)
       } catch (error) {
          alert(error.message)
       }
     }
     getProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    const res = await fetch("/api/recruiter/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include"
    });

    const data = await res.json();

    if (res.ok) {
      setRecruiter(data.recruiter);
      setIsEditing(false);
    }
  };

  if (!recruiter) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-10 space-y-6">

      <div className="bg-white border rounded-lg p-6 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {recruiter.companyName}
          </h1>
          <p className="text-gray-500">
            {recruiter.industry}
          </p>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Edit
        </button>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-3">
        <p>Email: {recruiter.companyEmail}</p>
        <p>Phone: {recruiter.phone}</p>
        <p>Location: {recruiter.location}</p>
        <p>Website: {recruiter.website}</p>
        <p>Size: {recruiter.companySize}</p>
        <p>Industry: {recruiter.industry}</p>
        <p>{recruiter.description}</p>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl space-y-4">

            <input
              name="companyName"
              value={formData.companyName || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Company Name"
            />

            <input
              name="companyEmail"
              value={formData.companyEmail || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Company Email"
            />

            <input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Phone"
            />

            <input
              name="alternateEmail"
              value={formData.alternateEmail || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Alternate Email"
            />

            <input
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Location"
            />

            <input
              name="website"
              value={formData.website || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Website"
            />

            <input
              name="industry"
              value={formData.industry || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Industry"
            />

            <input
              name="companySize"
              value={formData.companySize || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Company Size"
            />

            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Description"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}