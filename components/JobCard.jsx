import Link from "next/link"

const JobCard = ({job}) => {
  console.log(job)
  return (
      <div className="bg-white border rounded-xl p-6 hover:shadow-md transition">
      <h3 className="font-semibold text-lg mb-1">
        {job.title}
      </h3>

      <p className="text-sm text-gray-500 mb-3">
        {job.company} • {job.location}
      </p>

      <p className="text-gray-600 text-sm mb-4">
        {job.description}
      </p>

      <div className="flex justify-between items-center">
        <span
          className={`text-sm px-3 py-1 rounded-full ${
            job.type === "Full Time"
              ? "bg-indigo-100 text-indigo-600"
              : job.type === "Internship"
              ? "bg-emerald-100 text-emerald-600"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {job.jobType}
        </span>
        <Link
          href={`/jobs/${job._id}`}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default JobCard