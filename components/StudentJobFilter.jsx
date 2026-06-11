import { FaFilter } from "react-icons/fa";

const StudentJobFilter = ({filters, setFilters}) => {

 const handleChange = (type, value) => {
  const current = filters[type];

  const updated = current.includes(value) ? [] : [value];

  setFilters({ ...filters, [type]: updated });
};

  return (
    <aside className="w-64 bg-white border rounded-lg p-4 hidden lg:block">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaFilter /> Filters
      </h3>

        <div className="space-y-4">

        {/* Job Type */}
        <div>
          <label className="text-sm text-gray-600">Job Type</label>
          <select
            value={filters.jobType}
            onChange={(e) =>
              setFilters({ ...filters, jobType: e.target.value })
            }
            className="w-full mt-1 p-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="Full-Time">Full Time</option>
            <option value="Part-Time">Part Time</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className="text-sm text-gray-600">Experience</label>
          <select
            value={filters.experience}
            onChange={(e) =>
              setFilters({ ...filters, experience: e.target.value })
            }
            className="w-full mt-1 p-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="Fresher">Fresher</option>
            <option value="Junior">Junior</option>
            <option value="Mid-Level">Mid-Level</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

      </div>
    </aside>
  );
}

export default StudentJobFilter

// helper functions

function FilterSection({ title, children }) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FilterItem({ label }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
      <input type="checkbox" className="accent-indigo-600" />
      {label}
    </label>
  );
}