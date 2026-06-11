const JobFilters = ({ filters, setFilters }) => {
  return (
    <aside className="bg-white p-6 rounded-lg border h-fit">
      <h3 className="font-semibold mb-4">Filters</h3>

      <div className="space-y-4">

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
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Location</label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            placeholder="e.g. Remote"
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

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
};

export default JobFilters;