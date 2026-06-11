"use client";

import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
    try {
      const res = await fetch(
        "/api/recruiter/notification",
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setNotifications(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
    fetchNotifications();
  }, []);

  const handleViewNotification = async (notificationId) => {
   try {
    const res = await fetch(
      `/api/recruiter/notification/${notificationId}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (res.ok) {
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId
            ? { ...n, isRead: true }
            : n
        )
      );
      setSelectedNotification(data);
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert(error.message);
  }
 };

 console.log(selectedNotification)

  if (loading) {
    return (
      <div className="p-6">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">

      <div className="flex items-center gap-3 mb-8">
        <FaBell className="text-indigo-600 text-2xl" />
        <h1 className="text-3xl font-bold">
          Notifications
        </h1>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <p className="text-gray-500">
            No notifications yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">

  <div className="space-y-4">
  
   {notifications.map((notification) => (
    <div
      key={notification._id}
      className={`border rounded-xl p-5 shadow-sm
      ${
        notification.isRead
          ? "bg-white"
          : "bg-blue-50 border-blue-300"
      }`}
    >
      <div className="flex justify-between items-start">

        <div>
          <h2 className="font-semibold text-lg">
            {notification.title}
          </h2>

          <p className="text-gray-600 mt-2">
            {notification.message}
          </p>
        </div>

        {!notification.isRead && (
          <span className="h-3 w-3 rounded-full bg-blue-500"></span>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">

        <p className="text-xs text-gray-400">
          {new Date(
            notification.createdAt
          ).toLocaleString()}
        </p>

        <button
          disabled={notification.isRead}
          onClick={() =>
            handleViewNotification(notification._id)
          }
          className={`px-4 py-2 rounded-md text-sm
          ${
            notification.isRead
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          View
        </button>

       </div>
       </div>
    ))}
   </div>

</div>
      )}

   {selectedNotification && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

    <div className="bg-white w-full max-w-2xl rounded-xl p-6 relative">

      <button
        onClick={() =>
          setSelectedNotification(null)
        }
        className="absolute top-4 right-4 text-gray-500"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-6">
        Applicant Details
      </h2>

      <div className="space-y-3">

        <p>
          <strong>Name:</strong>{" "}
          {
            selectedNotification.application?.student?.user?.name
          }
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {
            selectedNotification.application?.student?.user?.email
          }
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {
            selectedNotification.application
              ?.student?.phone
          }
        </p>

        <p>
          <strong>Location:</strong>{" "}
          {
            selectedNotification.application
              ?.student?.location
          }
        </p>

        <hr />

        <p>
          <strong>Job:</strong>{" "}
          {
            selectedNotification.application
              ?.job?.title
          }
        </p>

        <p>
          <strong>Company:</strong>{" "}
          {
            selectedNotification.application
              ?.job?.company
          }
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {
            selectedNotification.application
              ?.status
          }
        </p>

      </div>

      <div className="flex gap-3 mt-6">

        <a
          href={
            selectedNotification.application
              ?.student?.resume
          }
          target="_blank"
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          View Resume
        </a>

      </div>

    </div>

  </div>
)}
    </div>
  );
}