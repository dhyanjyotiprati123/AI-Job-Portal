"use client";

import Link from "next/link";

export default function StudentJobCard({ job }) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition duration-300 group">

      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition">
            {job.title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {job.company} • {job.location}
          </p>
        </div>

        {/* Status */}
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            job.isActive
              ? "bg-emerald-100 text-emerald-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {job.isActive ? "Active" : "Closed"}
        </span>
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-3 mt-4">
        <span className="px-3 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full">
          {job.jobType}
        </span>

        <span className="px-3 py-1 text-xs bg-amber-100 text-amber-600 rounded-full">
          {job.experienceLevel}
        </span>

        {job.salary && (
          <span className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
            {job.salary}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mt-4 line-clamp-2">
        {job.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mt-4">
        {job.skillsRequired?.slice(0, 4).map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs bg-gradient-to-right from-indigo-500 to-purple-500 text-white rounded-full"
          >
            {skill}
          </span>
        ))}

        {job.skillsRequired?.length > 4 && (
          <span className="px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
            +{job.skillsRequired.length - 4} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6">
        {job.deadline && (
          <p className="text-xs text-gray-400">
            Deadline: {new Date(job.deadline).toLocaleDateString()}
          </p>
        )}

        <Link
          href={`/dashboard/student/jobs/${job._id}`}
          className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}