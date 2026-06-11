"use client"

import Link from "next/link";
import { useEffect, useState } from "react"

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() =>{
    const getUsers = async()=>{
       try {
         const res = await fetch("/api/admin/users",{
            credentials:"include"
         });
         const data = await res.json();
         if(res.ok){
            setUsers(data);
         }else{
            alert(data.message)
         }
       } catch (error) {
          alert(error.message)
       } 
    };

    getUsers()
  },[]);

    
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Users</h1>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3">
                  <Link href={`/admin/users/${user._id}`} className="text-sm  text-blue-400 cursor-pointer">View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AllUsersPage