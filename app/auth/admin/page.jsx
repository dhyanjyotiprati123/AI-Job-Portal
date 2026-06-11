"use client";

import { useState } from "react";

const AdminAuthPage =() => {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // STEP 1: Login
  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP sent to email");
        setStep(2);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("/api/auth/admin/verify", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          otp: form.otp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful");
        window.location.href = "/admin";
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded shadow w-96">
        
        <h1 className="text-2xl font-bold mb-6 text-center">
          Admin Login
        </h1>

        {step === 1 && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 border mb-3 rounded"
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 border mb-4 rounded"
              onChange={handleChange}
            />

            <button
              onClick={handleLogin}
              className="w-full bg-black text-white p-2 rounded cursor-pointer"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              className="w-full p-2 border mb-4 rounded"
              onChange={handleChange}
            />

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-black text-white p-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default AdminAuthPage;