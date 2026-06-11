"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState({
     name: "",
     email: "",
     password: "",
     role: ""
  });

  const handleChange = (e)=>{
    const {name, value} = e.target;
    setUser({...user, [name]: value})
  }

  const handleSubmit = async(e)=>{
     e.preventDefault();
     try {
      const res = await fetch("/api/auth/register",{
         method:"POST",
         headers: {"Content-Type":"application/json"},
         body: JSON.stringify(user)
      });
      const data = await res.json();

      if(res.ok){
        router.push("/auth/login")
      }
     } catch (error) {
        alert(error.message)
     }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border border-black">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Role Selection */}
          <div>
            <label className="text-sm text-gray-600 block mb-2">
              Register as
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="border rounded-md p-3 flex items-center gap-2 cursor-pointer hover:border-indigo-500">
                  <input
                     type="radio"
                     name="role"
                     value="student"
                     checked={user.role === "student"}
                     onChange={handleChange}
                     className="accent-indigo-600"
                   />
                <span className="text-sm font-medium">Student</span>
              </label>

              <label className="border rounded-md p-3 flex items-center gap-2 cursor-pointer hover:border-indigo-500">
                <input
                     type="radio"
                     name="role"
                     value="recruiter"
                     checked={user.role === "recruiter"}
                     onChange={handleChange}
                     className="accent-indigo-600"
                   />
                <span className="text-sm font-medium">Recruiter</span>
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              placeholder="Your name"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

             <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition cursor-pointer"
             >

           {showPassword ? (
              <FaEyeSlash size={18} />
             ) : (
               <FaEye size={18} />
           )}

          </button>
          </div>

          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition cursor-pointer"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/auth/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}


