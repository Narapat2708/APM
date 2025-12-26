import React from "react"
import Link from "next/link"

const Navbar = () => {
  return (
    <nav className="w-full bg-gradient-to-r from-purple-600 to-blue-500 shadow-md shadow-slate-900/25">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-6">
            <img
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              alt="Logo"
              className="h-8 w-auto"
            />

            <div className="hidden sm:flex gap-4">
              <Link
                href="/appointment"
                className="rounded-md px-3 py-2 text-sm font-medium text-white"
              >
                Appointment
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <button className="rounded-full p-1 text-gray-400 hover:text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-6 w-6"
              >
                <path
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              alt="User"
              className="h-8 w-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
