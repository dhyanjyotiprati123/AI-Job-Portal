"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function RecruiterSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState("");

  const [notifications, setNotifications] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(()=>{
     const getUser = async()=>{
       try {
         const res = await fetch("/api/me", {
           method:"GET",
           credentials: "include"
         });
         const data = await res.json();
          if(res.ok){
              setUser(data)
          }else{
            alert(data.message)
          }
         
       } catch (error) {
          alert(`Something Went Wrong ${error.message}`)
       }
     }
     getUser();
  }, []);

  /* =========================
      CHANGE EMAIL
  ========================== */

  const handleChangeEmail = async () => {
    if (!newEmail || !emailPassword) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await fetch("/api/recruiter/email", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newEmail,
          password: emailPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Email updated successfully");
        setShowEmailModal(false);
        setNewEmail("");
        setEmailPassword("");
        router.push("/auth/login")
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  /* =========================
      CHANGE PASSWORD
  ========================== */

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/recruiter/password", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        router.push("/auth/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  /* =========================
      DELETE ACCOUNT
  ========================== */

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you sure? This will permanently delete your account and all jobs."
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/recruiter/delete-account", {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account deleted successfully");
        router.push("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 p-16">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Account Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your recruiter account preferences
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-gradient-to-right from-indigo-50 to-white shadow-md border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Account Information
        </h2>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="font-medium text-gray-800">
              {user.email}
            </p>
          </div>

          <button
            onClick={() => setShowEmailModal(true)}
            className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer shadow"
          >
            Change Email
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white shadow-md border rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Change Password
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            setValue={setCurrentPassword}
          />
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            setValue={setNewPassword}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            setValue={setConfirmPassword}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleChangePassword}
            className="px-5 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition cursor-pointer shadow"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white shadow-md border rounded-xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Email Notifications
          </h2>
          <p className="text-sm text-gray-500">
            Receive alerts for new applicants
          </p>
        </div>

        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 relative transition">
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
          </div>
        </label>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold text-red-600">
          Danger Zone
        </h2>

        <p className="text-sm text-red-500">
          Deleting your recruiter account will remove all job posts permanently.
        </p>

        <button
          onClick={handleDeleteAccount}
          className="px-5 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition cursor-pointer shadow"
        >
          Delete Account
        </button>
      </div>

      {/* EMAIL MODAL */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl space-y-6">

            <h2 className="text-lg font-semibold text-gray-800">
              Change Email
            </h2>

            <Input
              type="email"
              placeholder="New Email"
              value={newEmail}
              setValue={setNewEmail}
            />

            <Input
              type="password"
              placeholder="Confirm Password"
              value={emailPassword}
              setValue={setEmailPassword}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleChangeEmail}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
              >
                Update Email
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

/* Reusable Input */

function Input({ type, placeholder, value, setValue }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="border rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    />
  );
}