"use client";

import { useState } from "react";

export default function PostJobPage() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [employmentType, setEmploymentType] = useState("Full-Time");
  const [loading, setLoading] = useState(false);


  const [job, setJob] = useState({
    title:"",
    company:"",
    companyEmail:"",
    location:"",
    salary: "",
    description: ""
  })


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

  const handleChange =(e)=>{
    const {name, value} = e.target;
    setJob({...job, [name]: value})
  }

  const handleSubmit = async(e)=>{
     e.preventDefault();
     
     setLoading(true);
     const payload = {...job, jobType:employmentType, skillsRequired:skills, experienceLevel};

      try {
        const res = await fetch("/api/recruiter/post-job",{
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(payload),
          credentials:"include"
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        alert("Job posted successfully ✅");

        setJob({
          title: "",
          company: "",
          companyEmail: "",
          location: "",
          salary: "",
          description: "",
        });

        setSkills([]);
        setExperienceLevel("Fresher");
        setEmploymentType("Full-Time");

      } catch (error) {
         alert(error.message)
      }
      finally {
      setLoading(false);
     }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-16">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Post New Job
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a job listing and attract candidates
        </p>
      </div>

      {/* Form */}
      <form className="bg-white border rounded-lg p-6 space-y-6" onSubmit={handleSubmit}>

        {/* Job Title */}
        <Input label="Job Title" placeholder="Frontend Developer" name="title" value={job.title} onChange={handleChange} />

        <Input label="Company Email" placeholder="technova@gmail.com" name="companyEmail" value={job.companyEmail} onChange={handleChange} />

        {/* Company + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Company Name" placeholder="Tech Solutions Pvt Ltd" onChange={handleChange} name="company" value={job.company} />
          <Input label="Location" placeholder="Ahmedabad, India" onChange={handleChange} name="location" value={job.location} />
        </div>

        {/* Employment Type + Salary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select label="Employment Type"
             value={employmentType}
             onChange={(e)=> setEmploymentType(e.target.value)}
           />
          <Input label="Salary (Optional)" placeholder="₹6-8 LPA" name="salary" value={job.salary} onChange={handleChange} />
        </div>

        <div className="space-y-2">
         <label className="text-sm font-medium text-gray-700">
           Experience Level
         </label>

          <select
             value={experienceLevel}
             onChange={(e) => setExperienceLevel(e.target.value)}
             className="w-full border rounded-md px-3 py-2 text-sm 
               focus:outline-none focus:ring-2 focus:ring-indigo-500"
             >
            <option value="Fresher">Fresher</option>
            <option value="Junior">Junior</option>
            <option value="Mid-Level">Mid-Level</option>
            <option value="Senior">Senior</option>
          </select>
        </div>


        {/* Skills Required */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Required Skills
          </label>

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

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {if (e.key === "Enter") {e.preventDefault();addSkill();}}}
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

        {/* Job Description */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Job Description
          </label>
          <textarea
            rows={6}
            placeholder="Describe the role, responsibilities, and requirements..."
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            name="description"
            value={job.description}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition cursor-pointer" type="submit" disabled={loading}>
            Publish Job
          </button>
        </div>

      </form>
    </div>
  );
}

/* Reusable Components */

function Input({ label, placeholder, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-2">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

function Select({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-2">{label}</label>
      <select className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={value} onChange={onChange}>
        <option>Full-Time</option>
        <option>Part-Time</option>
        <option>Internship</option>
        <option>Remote</option>
      </select>
    </div>
  );
}
