
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditJobPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [job, setJob] = useState(null);
  const [newSkill, setNewSkill] = useState("");

  // ✅ Fetch Single Job
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/recruiter/my-jobs/${id}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setJob(data.job);
      } catch (error) {
        alert(error.message);
        router.push("/dashboard/recruiter/my-jobs");
      } finally {
        setFetching(false);
      }
    };

    fetchJob();
  }, [id, router]);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add Skill
  const addSkill = () => {
    if (!newSkill.trim()) return;

    if (!job.skillsRequired.includes(newSkill.trim())) {
      setJob((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, newSkill.trim()],
      }));
    }

    setNewSkill("");
  };

  // ✅ Remove Skill
  const removeSkill = (skill) => {
    setJob((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((s) => s !== skill),
    }));
  };

  // ✅ Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/recruiter/my-jobs/${id}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(job),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Job updated successfully ✅");
      router.push("/dashboard/recruiter/my-jobs");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-16">Loading job...</div>;
  }

  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto p-16 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Edit Job
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title */}
        <Input
          label="Job Title"
          name="title"
          value={job.title}
          onChange={handleChange}
        />

        {/* Company + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Company"
            name="company"
            value={job.company}
            onChange={handleChange}
          />
          <Input
            label="Company Email"
            name="companyEmail"
            value={job.companyEmail}
            onChange={handleChange}
          />
        </div>

        {/* Location + Salary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Location"
            name="location"
            value={job.location}
            onChange={handleChange}
          />
          <Input
            label="Salary"
            name="salary"
            value={job.salary}
            onChange={handleChange}
          />
        </div>

        {/* Job Type */}
        <Select
          label="Employment Type"
          name="jobType"
          value={job.jobType}
          onChange={handleChange}
          options={["Full-Time", "Part-Time", "Internship", "Remote", "Contract"]}
        />

        {/* Experience Level */}
        <Select
          label="Experience Level"
          name="experienceLevel"
          value={job.experienceLevel}
          onChange={handleChange}
          options={["Fresher", "Junior", "Mid-Level", "Senior"]}
        />

        {/* Skills */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Required Skills
          </label>

          <div className="flex flex-wrap gap-2 mb-3">
            {job.skillsRequired?.map((skill) => (
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
              className="border rounded-md px-3 py-2 text-sm flex-1"
            />

            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md"
            >
              Add
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Description
          </label>
          <textarea
            rows={6}
            name="description"
            value={job.description}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md cursor-pointer"
          >
            {loading ? "Updating..." : "Update Job"}
          </button>
        </div>

      </form>
    </div>
  );
}

/* Reusable Components */

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-2">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-md px-3 py-2 text-sm"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-2">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-md px-3 py-2 text-sm"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}