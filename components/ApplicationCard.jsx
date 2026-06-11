"use client";

import { useRouter } from "next/navigation";

const ApplicationCard = ({ app }) => {

  const router = useRouter();

  const getStatusColor = (status) => {
   switch (status) {
    case "Accepted":
      return "bg-green-500 text-white";
    case "Rejected":
      return "bg-red-500 text-white";
    default:
      return "bg-yellow-400 text-white";
     }
   };

  const deleteApplication = async () => {
    try {
      const res = await fetch("/api/student/applications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ id: app._id })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Application removed");
        router.refresh();
      } else {
        alert(data.message);
      }

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-linear-to-br from-white to-gray-50 border rounded-2xl p-6 shadow-sm hover:shadow-lg transition duration-300">

      {/* Top */}
      <div className="flex justify-between items-start">

        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {app.job?.title}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {app.job?.company} • {app.job?.location}
          </p>
        </div>

        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
          {app.status}
        </span>

      </div>

      <div className="flex flex-wrap gap-3 mt-5 text-sm">

        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
          {app.job?.jobType}
        </span>

        <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full">
          {app.job?.salary}
        </span>

      </div>

    
      <div className="flex justify-between items-center mt-6 text-sm border-t pt-4">

          <span className="text-gray-500">
            Applied on:{" "}
            <strong className="text-gray-700">
              {new Date(app.createdAt).toLocaleDateString()}
            </strong>
          </span> 

           <div className="flex gap-3">

          <button
           onClick={() => router.push(`/dashboard/student/jobs/${app.job._id}`)}
           className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 active:scale-95 transition cursor-pointer"
         >
           View Job
         </button>

         <button
           onClick={deleteApplication}
           className="px-4 py-2 bg-red-500 text-white rounded-md text-xs font-medium hover:bg-red-600 active:scale-95 transition cursor-pointer"
         >
           Remove
         </button>

       </div>

     </div>

    </div>
  );
};

export default ApplicationCard;