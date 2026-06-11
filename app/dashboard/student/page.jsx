"use client"

import { useEffect, useState } from "react";
import { FaBriefcase, FaBookmark, FaPaperPlane } from "react-icons/fa";

export default function StudentDashboardPage() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    savedJobsCount: 0,
    applicationsCount: 0,
  });

  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([])

  useEffect(()=>{
      const fetchDashboard = async () => {
        try {
          const res = await fetch("/api/student/dashboard", {
             credentials: "include",
          });

          const data = await res.json();

         if (res.ok) {
           setStats(data);
           setRecentJobs(data.recentJobs);
         } else {
           alert(data.message);
        }
        } catch (error) {
           alert(error.message)
        }
    };

    const fetchApplications = async () => {
    try {
      const res = await fetch("/api/student/applications", {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setRecentApplications(data.applications.slice(0, 5));
      }
    } catch (error) {
      alert(error.message);
    }
  };

    fetchDashboard();
    fetchApplications();
  },[]);


  return (
    <div className="p-8 min-h-[90vh] space-y-10">

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <DashboardCard
          title="Available Jobs"
          value={stats.totalJobs}
          color="from-blue-500 to-indigo-600"
          icon={<FaBriefcase />}
        />

        <DashboardCard
          title="Saved Jobs"
          value={stats.savedJobsCount}
          color="from-purple-500 to-pink-500"
          icon={<FaBookmark />}
        />

        <DashboardCard
          title="Applications"
          value={stats.applicationsCount}
          color="from-green-500 to-emerald-600"
          icon={<FaPaperPlane />}
        />

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Recent Jobs */}
        <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Recent Job Listings
          </h2>

          <div className="space-y-3">
            {recentJobs.length === 0 ? (
            <p className="text-gray-500">No jobs available</p>
          ) : (
            recentJobs.map((job) => (
              <RecentJob
                key={job._id}
                title={job.title}
                company={job.company}
              />
            ))
          )}
          </div>
        </div>

        {/* Placeholder second card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition">
           <h2 className="text-xl font-semibold text-gray-800 mb-6">
             Recent Applications
           </h2>

          <div className="space-y-3">
            {recentApplications.length === 0 ? (
              <p className="text-gray-500">No applications yet</p>
            ) : (
              recentApplications.map((app) => (
                <RecentApplication
                  key={app._id}
                  title={app.job?.title}
                  company={app.job?.company}
                  status={app.status}
                />
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}


/* ---------- Dashboard Card ---------- */

function DashboardCard({ title, value, icon, color }) {
  return (
    <div className={`bg-linear-to-r ${color} text-white p-6 rounded-2xl 
    flex items-center justify-between shadow-md 
    hover:shadow-xl hover:-translate-y-1 transition duration-300`}>

      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>

      <div className="text-2xl bg-white/20 p-3 rounded-full">
        {icon}
      </div>

    </div>
  );
}


/* ---------- Recent Job ---------- */

function RecentJob({ title, company }) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 hover:shadow-sm transition">

      <div>
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{company}</p>
      </div>

      <span className="text-sm font-medium text-indigo-600 hover:underline cursor-pointer">
        View
      </span>

    </div>
  );
}

//   Recent Application Card

function RecentApplication({ title, company, status }) {

  const getStatusColor = () => {
    switch (status) {
      case "Accepted":
        return "text-green-600";
      case "Rejected":
        return "text-red-600";
      default:
        return "text-yellow-500";
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 hover:shadow-sm transition">

      <div>
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{company}</p>
      </div>

      <span className={`text-sm font-semibold ${getStatusColor()}`}>
        {status}
      </span>

    </div>
  );
}