"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentSettingsPage() {
  const [showEmailPopup, setShowEmailPopup] = useState(false)
  const [notifications, setNotifications] = useState(true);
  const [user, setUser] = useState({});
  const [changeEmail, setChangeEmail] = useState({
     email: "",
     password: ""
  });
  const [changePassword, setChangePassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const router = useRouter();

  useEffect(()=>{
    const getUser = async()=>{
      try {
        const res = await fetch("/api/me",{credentials:"include"});
        const data = await res.json();
        if(res.ok){
          setUser(data)
        }else{
          alert(data.mesage)
        }
      } catch (error) {
         alert(error.message)
      }
    };

    getUser();
  },[]);

  const handleEmailInputs = (e) =>{
      const {name, value} = e.target;
      setChangeEmail({...changeEmail, [name]: value})
  }

  const handlePasswordInputs = (e) =>{
    const {name, value} = e.target;
    setChangePassword({...changePassword, [name]: value})
  }


  const handleEmailChange = async() =>{
    try {
      const res = await fetch("/api/student/email",{
         method: "PUT",
         headers: {
           "Content-Type": "application/json"
         },
         credentials: "include",
         body: JSON.stringify(changeEmail)
      });
      const data = await res.json();

      if(res.ok){
         alert("email updated successfully");
         setShowEmailPopup(false);
        
         setChangeEmail({
           email: "",
           password: ""
         });
          router.push("/auth/login")
      }else{
         alert(data.message)
      }
    } catch (error) {
       alert(error.message)
    }
  }


  const handlePasswordChange = async()=>{
      try {
        const res = await fetch("/api/student/password", {
           method:"PUT",
           headers:{
              "Content-Type": "application/json"
           },
           credentials:"include",
           body: JSON.stringify(changePassword)
        });
        const data = await res.json();
        if(res.ok){
          alert("Password Updated Successfully");
          setChangePassword({
             currentPassword: "",
             newPassword: "",
             confirmPassword: ""
          });
          router.push("/auth/login")
        }else{
            alert(data.message)
        }
      } catch (error) {
         alert(error.message)
      }
  }

    /* DELETE ACCOUNT */
  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/student/delete", {
        method: "DELETE",
        credentials: "include",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({id: user._id})
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
      } else {
        alert("Account deleted");

        window.location.href = "/";
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-16">

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Account Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account preferences and security
        </p>
      </div>

      {/* Email Section */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Account Information
        </h2>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="font-medium text-gray-800">{user.email}</p>
          </div>

          <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition" onClick={() => setShowEmailPopup(true)}>
            Change Email
          </button>
        </div>
      </div>

      {showEmailPopup && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

       <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">

       <h2 className="text-lg font-semibold">Change Email</h2>

      <input
        type="email"
        name="email"
        placeholder="New Email"
        value={changeEmail.email}
        onChange={handleEmailInputs}
        className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
      />

      <input
        type="password"
        name="password"
        placeholder="Confirm Password"
        value={changeEmail.password}
        onChange={handleEmailInputs}
        className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
      />

      <div className="flex justify-end gap-3 pt-2">

        <button
          onClick={() => setShowEmailPopup(false)}
          className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100 cursor-pointer"
        >
          Cancel
        </button>

         <button
           onClick={handleEmailChange}
           className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
         >
            Update Email
         </button>

        </div>
       </div>

      </div>
     )}

      {/* Change Password */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Change Password
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input type="password" placeholder="Current Password" value={changePassword.currentPassword} name="currentPassword" onChange={handlePasswordInputs} />
          <Input type="password" placeholder="New Password" value={changePassword.newPassword} name="newPassword" onChange={handlePasswordInputs} />
          <Input type="password" placeholder="Confirm New Password" value={changePassword.confirmPassword} name="confirmPassword" onChange={handlePasswordInputs} />
        </div>

        <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition cursor-pointer" onClick={handlePasswordChange}>
          Update Password
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-white border rounded-lg p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Email Notifications
          </h2>
          <p className="text-sm text-gray-500">
            Receive job alerts and application updates
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-red-600">
          Danger Zone
        </h2>

        <p className="text-sm text-red-500">
          Deleting your account is permanent and cannot be undone.
        </p>

        <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>

    </div>
  );
}

/* Reusable Input */
function Input({ type, placeholder, onChange, name, value }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
}
