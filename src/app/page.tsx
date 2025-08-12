'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header / Navbar */}
     

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
