"use client";

import { useEffect, useState } from "react";
import {
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard",{
           credentials:"include"
        });
        const result = await res.json();

        if(res.ok){
          setData(result); 
        }else{
          alert(result.message)
        }
        
      } catch (error) {
         alert(error.message)
      }
  };
    fetchDashboard();
  }, []);

  if (!data) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* 🔷 Header */}
      <h1 className="text-3xl font-bold text-gray-800">
        Admin Dashboard
      </h1>

      {/* 📊 STATS */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* Users */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-4">
          <div className="bg-indigo-100 p-4 rounded-full">
            <FaUsers className="text-indigo-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <h2 className="text-2xl font-bold">{data.totalUsers}</h2>
          </div>
        </div>

        {/* Jobs */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-4">
          <div className="bg-purple-100 p-4 rounded-full">
            <FaBriefcase className="text-purple-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Jobs</p>
            <h2 className="text-2xl font-bold">{data.totalJobs}</h2>
          </div>
        </div>

        {/* Applications */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-full">
            <FaFileAlt className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Applications</p>
            <h2 className="text-2xl font-bold">{data.totalApplications}</h2>
          </div>
        </div>

      </div>

      {/* 🆕 RECENT SECTION */}
      <div className="grid md:grid-cols-3 gap-6">

  {/* 👤 Recent Users */}
  <div className="p-6 rounded-2xl bg-gray-100 shadow-[8px_8px_15px_#d1d5db,-8px_-8px_15px_#ffffff]">
    <h2 className="text-lg font-semibold mb-4 text-indigo-600">
      Recent Users
    </h2>

    {data.recentUsers.map((user) => (
      <div
        key={user._id}
        className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-gray-100
        shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff]"
      >
        <FaUser className="text-indigo-500 text-lg" />
        <div>
          <p className="text-base font-semibold">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>
    ))}
  </div>

  {/* 💼 Recent Jobs */}
  <div className="p-6 rounded-2xl bg-gray-100 shadow-[8px_8px_15px_#d1d5db,-8px_-8px_15px_#ffffff]">
    <h2 className="text-lg font-semibold mb-4 text-purple-600">
      Recent Jobs
    </h2>

    {data.recentJobs.map((job) => (
      <div
        key={job._id}
        className="mb-3 p-3 rounded-xl bg-gray-100
        shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff]"
      >
        <p className="text-base font-semibold">{job.title}</p>
        <p className="text-sm text-gray-600">
          {job.company} • {job.location}
        </p>
      </div>
    ))}
  </div>

  {/* 📄 Recent Applications */}
  <div className="p-6 rounded-2xl bg-gray-100 shadow-[8px_8px_15px_#d1d5db,-8px_-8px_15px_#ffffff]">
    <h2 className="text-lg font-semibold mb-4 text-green-600">
      Recent Applications
    </h2>

    {data.recentApplications.map((app) => (
      <div
        key={app._id}
        className="mb-3 p-3 rounded-xl bg-gray-100
        shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff]"
      >
        <p className="text-base font-semibold">
          {app.student?.user?.name}
        </p>
        <p className="text-sm text-gray-600">
          {app.job?.title}
        </p>
      </div>
    ))}
  </div>

</div>

    </div>
  );
}