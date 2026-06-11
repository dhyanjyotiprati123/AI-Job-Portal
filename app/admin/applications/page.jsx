"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaUser,
  FaBriefcase,
  FaEnvelope,
  FaEye,
} from "react-icons/fa";

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);

  useEffect(() =>{
    const getApplication = async()=>{
        try {
            const res = await fetch(`/api/admin/applications`,{
               credentials:"include"
            });
            const data = await res.json();
            if(res.ok){
                setApps(data)
            }else{
                alert(data.mesage)
            }
        } catch (error) {
            alert(error.message)
        }
    }
    getApplication();
  },[])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* 🔷 Header */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Applications
      </h1>

      {/* 🌈 Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-left">

          {/* Header */}
          <thead className="bg-linear-to-r from-indigo-500 to-purple-500 text-white">
            <tr>
              <th className="p-4">👤 Student</th>
              <th className="p-4">💼 Job</th>
              <th className="p-4">📧 Email</th>
              <th className="p-4">📊 Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {apps.map((app, index) => (
              <tr
                key={app._id}
                className={`border-t hover:bg-indigo-50 transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {/* Student */}
                <td className="p-4 flex items-center gap-2">
                  <FaUser className="text-indigo-500" />
                  {app.student?.user?.name}
                </td>

                {/* Job */}
                <td className="p-4 flex items-center gap-2">
                  <FaBriefcase className="text-purple-500" />
                  {app.job?.title}
                </td>

                {/* Email */}
                <td className="p-4 flex items-center gap-2 text-gray-600">
                  <FaEnvelope />
                  {app.student?.user?.email}
                </td>

                {/* Status */}
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${app.status === "Pending" && "bg-yellow-100 text-yellow-700"}
                    ${app.status === "Accepted" && "bg-green-100 text-green-700"}
                    ${app.status === "Rejected" && "bg-red-100 text-red-700"}
                    ${app.status === "Reviewed" && "bg-blue-100 text-blue-700"}
                  `}>
                    {app.status}
                  </span>
                </td>

                {/* Action */}
                <td className="p-4 text-center">
                  <Link
                    href={`/admin/applications/${app._id}`}
                    className="inline-flex items-center gap-2 text-indigo-600 hover:underline"
                  >
                    <FaEye />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}