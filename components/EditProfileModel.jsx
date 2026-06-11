"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function EditProfileModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "Dhyan Patel",
    title: "MERN Stack Developer",
    email: "dhyan@email.com",
    phone: "+91 9876543210",
    location: "Ahmedabad, India",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} />
          <InputField label="Title" name="title" value={formData.title} onChange={handleChange} />
          <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
          <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          <InputField label="Location" name="location" value={formData.location} onChange={handleChange} />

        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-sm"
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}

/* Reusable Input Component */
function InputField({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
