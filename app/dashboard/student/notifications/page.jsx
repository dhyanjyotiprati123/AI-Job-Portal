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
        "/api/student/notifications",
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
      `/api/student/notifications/${notificationId}`,
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

 console.log(notifications)

 

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

          {notifications.map((notification) => (
            <div
                key={notification._id}
                className={`border rounded-xl p-5 shadow-sm
                  ${
                    notification.isRead
                      ? "bg-white"
                      : "bg-blue-50 border-blue-300"
                  }
                `}
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
                {new Date(notification.createdAt).toLocaleString()}
              </p>
          
              <button
                onClick={() => handleViewNotification(notification._id)}
                disabled={notification.isRead}
                 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
               >
                  {notification.isRead ? "Viewed": "View"}
              </button>
          
            </div>
           </div>
          ))}

        </div>
      )}

   {selectedNotification && (
     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

     <div className="bg-white rounded-2xl p-8 max-w-3xl w-full mx-4 shadow-xl">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Notification Details
        </h2>

        <button
          onClick={() => setSelectedNotification(null)}
          className="text-gray-500 text-xl"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">

        {/* Notification */}
        <div>
          <h3 className="text-lg font-semibold">
            {selectedNotification.title}
          </h3>

          <p className="text-gray-600 mt-2">
            {selectedNotification.message}
          </p>
        </div>

        {/* Job Details */}
        <div className="border rounded-xl p-4 bg-gray-50">

          <h4 className="font-semibold text-indigo-600 mb-3">
            Job Information
          </h4>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <p className="text-sm text-gray-500">
                Position
              </p>

              <p className="font-medium">
                {selectedNotification.notification.application?.job?.title}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Company
              </p>

              <p className="font-medium">
                {selectedNotification.notification.application?.job?.company}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Application Status
              </p>

              <p className="font-medium text-green-600">
                {selectedNotification.notification.application?.status}
              </p>
            </div>

          </div>

        </div>

        {/* Student Info */}
        <div className="border rounded-xl p-4 bg-gray-50">

          <h4 className="font-semibold text-indigo-600 mb-3">
            Applicant Information
          </h4>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p>
                {
                  selectedNotification.notification.application.student?.user?.name
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p>
                {
                  selectedNotification.notification?.application.student?.user?.email
                }
              </p>
            </div>

          </div>

        </div>

        {/* Notification Date */}
        <div>

          <p className="text-sm text-gray-500">
            Notification Received
          </p>

          <p>
            {new Date(selectedNotification.notification.createdAt).toLocaleString()}
          </p>

        </div>

      </div>

      <div className="mt-8 flex justify-end">

        <button
          onClick={() => setSelectedNotification(null)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          Close
        </button>

      </div>

    </div>

  </div>
)}
    </div>
  );
}