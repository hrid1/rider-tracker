'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header / Navbar */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-700">EMON Delivery App</h1>
        <nav className="space-x-6 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
          <Link href="/add-entry" className="hover:text-blue-600 transition">Add Entry</Link>
          <Link href="/riders" className="hover:text-blue-600 transition">Riders</Link>
          <Link href="/reports" className="hover:text-blue-600 transition">Reports</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-10 py-20 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
          Track. Analyze. Improve.
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Welcome to the EMON Delivery App Dashboard – your all-in-one tool for monitoring rider performance, delivery stats, and operational efficiency.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link href="/dashboard">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Go to Dashboard
            </button>
          </Link>
          <Link href="/add-entry">
            <button className="bg-gray-100 px-6 py-3 rounded-lg text-gray-800 border hover:bg-gray-200 transition">
              Add Daily Entry
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
