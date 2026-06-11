"use client";

import { useEffect, useState } from "react";
import ApplicationCard from "@/components/ApplicationCard";

const MyApplicationsPage= ()=> {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchApplications = async () => {
      try {

        const res = await fetch("/api/student/applications", {
          credentials: "include"
        });

        const data = await res.json();

        if (res.ok) {
          setApplications(data.applications);
        } else {
          alert(data.message);
        }

      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();

  }, []);


  if (loading) {
    return (
      <div className="p-10 text-gray-500">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="p-8 min-h-[90vh] space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          My Applications
        </h1>
        <p className="text-sm text-gray-500">
          Track all jobs you have applied to
        </p>
      </div>

      {/* Applications List */}

      {applications.length === 0 ? (
        <div className="text-gray-500 mt-10">
          You have not applied to any jobs yet.
        </div>
      ) : (
        <div className="grid gap-6">

          {applications.map((app) => (
            <ApplicationCard key={app._id} app={app} />
          ))}

        </div>
      )}

    </div>
  );
}

export default MyApplicationsPage