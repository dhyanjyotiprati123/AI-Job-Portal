"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchApplicants = async (pageNumber = 1) => {
    try {
      const res = await fetch(
        `/api/recruiter/applications?page=${pageNumber}`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (res.ok) {
        setApplicants(data.applications);
        setTotalPages(data.totalPages);
        setPage(data.currentPage);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };
    fetchApplicants(page);
  }, [page]);

  const updateStatus = async (applicationId, status) => {
  try {
    const res = await fetch("/api/recruiter/applications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ applicationId, status }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    setApplicants((prev) =>
      prev.map((app) =>
        app._id === applicationId
          ? { ...app, status }
          : app
      )
    );

  } catch (error) {
    alert(error.message);
  }
};

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-16">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Applicants
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage candidates
        </p>
      </div>

      
      <div className="space-y-6">
        {applicants.length === 0 ? (
          <p className="text-gray-500">No applicants found</p>
        ) : (
          applicants.map((applicant) => (
            <ApplicantCard key={applicant._id} applicant={applicant} updateStatus={updateStatus} />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 pt-6">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100"
        >
          Prev
        </button>

        <span className="text-sm font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100"
        >
          Next
        </button>

      </div>

    </div>
  );
}


/* Applicant Card Component */

function ApplicantCard({ applicant, updateStatus }) {
   const [loading, setLoading] = useState(null);

   const handleAction = async (status) => {
    setLoading(status);
    await updateStatus(applicant._id, status);
    setLoading(null);
   };

  return (
    <div className="bg-white border rounded-xl p-6 space-y-5 shadow-sm hover:shadow-lg transition">

      {/* Top */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        <div>
          <h3 className="font-semibold text-lg text-gray-800">
            {applicant.student.user.name}
          </h3>

          <p className="text-sm text-gray-500">
            {applicant.student.user.email}
          </p>

          <p className="text-sm text-gray-600 mt-1">
            Applied for:{" "}
            <span className="font-medium text-indigo-600">
              {applicant.job?.title}
            </span>{" "}
            ({applicant.job?.jobType})
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {applicant.job?.company}
          </p>
        </div>

        <StatusBadge status={applicant.status} />

      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">

        <Link href={`/dashboard/recruiter/applicants/${applicant._id}`} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition cursor-pointer">
          View Profile
        </Link>

        <button className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100 transition cursor-pointer">
          Resume
        </button>

         <button
          disabled={loading !== null}
          onClick={() => handleAction("Accepted")}
          className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 cursor-pointer"
        >
          Accept
        </button>

        <button
          disabled={loading !== null}
          onClick={() => handleAction("Reviewed")}
          className="px-4 py-2 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 transition disabled:opacity-50 cursor-pointer"
        >
          Shortlist
        </button>

        <button
          disabled={loading !== null}
          onClick={() => handleAction("Rejected")}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
        >
          Reject
        </button>

      </div>

    </div>
  );
}

/* Status Badge */

function StatusBadge({ status }) {
   const styles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Reviewed: "bg-orange-100 text-orange-700",
    Accepted: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  if (status === "Rejected") {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;
  }

  return (
    <span
      className={`px-4 py-1 text-sm font-medium rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
}
