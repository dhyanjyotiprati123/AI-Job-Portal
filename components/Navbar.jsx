import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      user = null;
    }
  }

  async function logout() {
    "use server";
    const cookieStore = await cookies();

    cookieStore.delete("token")
    redirect("/");
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md w-full bg-gray-50 border-b border-gray-200 h-25">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link href="/" className="text-2xl font-semibold tracking-wide">
          <span className="text-black">Ai</span>
          <span className="text-indigo-700">Job</span>
        </Link>

        <nav className="hidden md:flex gap-6 text-md text-gray-700">
          <Link href="/">Home</Link>
          <Link href="/jobs">Jobs</Link>
          <Link href="/about">About</Link>
        </nav>

        <div className="flex gap-3">
          {user ? (
            <>
              <Link
                href={`/dashboard/${user.role}`}
                className="px-4 py-2 border rounded cursor-pointer bg-white text-black"
              >
                Dashboard
              </Link>

              <form action={logout}>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded cursor-pointer"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="px-4 py-2 border rounded cursor-pointer bg-white text-black">
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 bg-black text-white rounded cursor-pointer"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
