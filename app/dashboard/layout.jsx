"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaBookmark,
  FaUser,
  FaCog,
  FaPlusCircle,
  FaUsers,
  FaTools,
  FaBell
} from "react-icons/fa";
import { FaWpforms, FaCreativeCommonsSampling  } from "react-icons/fa6";
import { IoAnalyticsSharp } from "react-icons/io5";


export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
        });

        if (!res.ok) {
          window.location.href = "/auth/login";
          return;
        }
        const data = await res.json();
        if(res.ok){
          setUser(data);
        }else{
          alert(data.message)
        }
      } catch (error) {
        alert(error.message);
        window.location.href = "/auth/login";
      } finally {
        setLoading(false);
      }
    };

    const fetchUnreadNotifications = async () => {
     try {
       const res = await fetch("/api/student/notifications",
         {
           credentials: "include",
          }
       );

       const data = await res.json();

       if (res.ok) {
         const notify = data.filter(
           (n) => !n.isRead
         ).length;

         setUnread(notify);
       }else{
          alert(data.message)
       }
     } catch (error) {
       alert(error.message)
     }
   };

    fetchUser();
    fetchUnreadNotifications();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return null;

  const role = user.role;

  const links = {
    student: {
      main: [
        { name: "Dashboard", path: "/dashboard/student", icon: <FaBriefcase /> },
        { name: "Jobs", path: "/dashboard/student/jobs", icon: <FaBriefcase /> },
        {name:"Applications", path:"/dashboard/student/applications", icon: <FaWpforms />},
        { name: "Saved Jobs", path: "/dashboard/student/savedjobs", icon: <FaBookmark /> },
        { name:"Analyze Resume", path:"/dashboard/student/analyze", icon: <IoAnalyticsSharp /> },
        {name:"Matched Jobs", path:"/dashboard/student/matched",icon : <FaCreativeCommonsSampling />},
        {name:"Notifications",path:"/dashboard/student/notifications", icon: <FaBell />},
        { name: "Profile", path:"/dashboard/student/profile", icon: <FaUser /> },
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
        { name: "My Jobs", path: "/dashboard/recruiter/my-jobs", icon: <FaTools /> },
        {name: "Notifications", path:"/dashboard/recruiter/notifications", icon: <FaBell />},
        { name: "Profile", path: "/dashboard/recruiter/profile", icon: <FaUser /> },
      ],
      bottom: [
        { name: "Settings", path: "/dashboard/recruiter/settings", icon: <FaCog /> },
      ],
    },
  };

  return (
    <div className="flex bg-gray-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white hidden border-r px-4 py-10 md:flex flex-col sticky top-25 h-[calc(100vh-100px)]">
        <h2 className="text-xl font-bold text-indigo-600 mb-8">JobAI</h2>

        <nav className="flex flex-col gap-3 flex-1">
          {links[role]?.main.map((link) => (
            <Link
               key={link.path}
               href={link.path}
               className="flex items-center justify-between px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition font-medium"
             >
             <div className="flex items-center gap-3">
               <span className="text-lg">{link.icon}</span>
               {link.name}
             </div>

             {link.name === "Notifications" && unread > 0 && (
               <span className="min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold">
                 {unread}
               </span>
             )}
           </Link>
          ))}
        </nav>

        <div className="border-t pt-4">
          {links[role]?.bottom.map((link) => (
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
            Welcome, {user.name}
          </h1>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
