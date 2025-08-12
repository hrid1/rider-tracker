import Link from "next/link";
import React from "react";

const Navber = () => {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-700">EMON Delivery App</h1>
      <nav className="space-x-6 text-sm font-medium text-gray-700">
        <Link href="/" className="hover:text-blue-600 transition">
          Home
        </Link>
        <Link href="/dashboard" className="hover:text-blue-600 transition">
          Dashboard
        </Link>
        {/* <Link href="/add-entry" className="hover:text-blue-600 transition">
          Add Entry
        </Link> */}
        <Link href="/all-riders" className="hover:text-blue-600 transition">
          Riders
        </Link>
        <Link href="/report" className="hover:text-blue-600 transition">
          Reports
        </Link>
      </nav>
    </header>
  );
};

export default Navber;
