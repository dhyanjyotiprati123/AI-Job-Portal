"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter()
  const [user, setUser ] = useState({
     email: "",
     password: ""
  });

  const handleChange = (e)=>{
    const {name , value} = e.target;
    setUser({...user, [name]: value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user),
        credentials: "include"
      });

      const data = await res.json();
      console.log(data);

      if(res.ok){
         router.push(`/dashboard/${data.user.role}`);
         router.refresh();
      }else{
        alert(data.message)
      }
    } catch (error) {
       alert(error.message)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border">

        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
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

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition cursor-pointer"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a href="/auth/register" className="text-indigo-600 hover:underline">
            Register
          </a>
        </p>

      </div>
    </div>
  );
}
