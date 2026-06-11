import { FaSearch } from "react-icons/fa";

export default function JobSearchBar({filters, setFilters}) {
  return (
    <div className="bg-white border rounded-lg p-4 flex items-center gap-3">
      <FaSearch className="text-gray-400" />
      <input
        type="text"
        placeholder="Search jobs..."
        value={filters.search}
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value })
        }
      />
    </div>
  );
}
