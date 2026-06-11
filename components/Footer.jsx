import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">
              JobAI
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              An AI-powered job portal designed to help students and recruiters
              connect efficiently.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-indigo-400 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-indigo-400 transition"
                >
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-indigo-400 transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-indigo-400 transition"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-white mb-3">
              Project Info
            </h4>
            <p className="text-gray-400 text-sm">
              Final Year Project <br />
              Built using Next.js & Tailwind CSS
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} JobAI. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
