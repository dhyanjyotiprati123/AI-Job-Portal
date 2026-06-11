"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaBriefcase,
  FaBookmark,
  FaUser,
  FaCog,
  FaPlusCircle,
  FaUsers,
  FaTools
} from "react-icons/fa";

export default function DashboardLayout({ role = "student", children }) {
  const pathname = usePathname();
  const links = {
    student: {
      main: [
        { name: "Dashboard", path: "/dashboard/student", icon: <FaBriefcase /> },
        { name: "Jobs", path: "/dashboard/student/jobs", icon: <FaBriefcase /> },
        { name: "Saved Jobs", path: "/dashboard/student/savedjobs", icon: <FaBookmark /> },
        { name: "Profile", path: "/dashboard/student/profile", icon: <FaUser /> },
      ],
      bottom: [
        { name: "Settings", path: "/dashboard/student/settings", icon: <FaCog /> },
      ],
    },

    recruiter: {
      main: [
        { name: "Dashboard", path: "/dashboard/recruiter", icon: <FaBriefcase /> },
        { name: "Post Job", path: "/dashboard/recruiter/post-job", icon: <FaPlusCircle /> },
        { name: "Applicants", path: "/dashboard/recruiter/applicants", icon: <FaUsers /> },
        { name: "My-Jobs", path: "/dashboard/recruiter/my-jobs", icon: <FaTools /> },
        { name: "Profile", path: "/dashboard/recruiter/profile", icon: <FaUser /> },
      ],
      bottom: [
        { name: "Settings", path: "/dashboard/recruiter/settings", icon: <FaCog /> },
      ],
    },

    admin: {
      main: [
        { name: "Dashboard", path: "/dashboard/admin", icon: <FaBriefcase /> },
        { name: "Users", path: "/dashboard/admin/users", icon: <FaUsers /> },
      ],
      bottom: [
        { name: "Settings", path: "/dashboard/settings", icon: <FaCog /> },
      ],
    },
  };

  return (
    <div className="flex min-h-[90vh] bg-gray-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r px-4 py-6 hidden md:flex flex-col">
        <h2 className="text-xl font-bold text-indigo-600 mb-8">JobAI</h2>

        {/* Main Links */}
        <nav className="flex flex-col gap-3 flex-1">
          {links[role].main.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition font-medium"
            >
              <span className="text-lg">{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Bottom Links */}
        <div className="border-t pt-4">
          {links[role].bottom.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition font-medium"
            >
              <span className="text-lg">{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {role.charAt(0).toUpperCase() + role.slice(1)}
          </h1>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}

