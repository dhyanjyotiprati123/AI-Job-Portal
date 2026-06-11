"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Jobs", path: "/admin/jobs" },
    { name: "Applications", path: "/admin/applications" },
  ];

  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <ul className="space-y-3">
          {menu.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <div
                  className={`p-2 rounded cursor-pointer ${
                    pathname === item.path
                      ? "bg-gray-700"
                      : "hover:bg-gray-800"
                  }`}
                >
                  {item.name}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        {children}
      </div>

    </div>
  );
}