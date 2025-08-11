"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import AllRiders from "@/components/AllRiders";

type Entry = {
  date: string;
  rider: string;
  delivered: number;
  failed: number;
  returned: number;
};

export default function DashboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  console.log(entries);

  const totalDelivered = entries.reduce((sum, e) => sum + e.delivered, 0);
  const totalFailed = entries.reduce((sum, e) => sum + e.failed, 0);
  const totalReturned = entries.reduce((sum, e) => sum + e.returned, 0);
  const total = totalDelivered + totalFailed + totalReturned;
  const totalRiders = new Set(entries.map((e) => e.rider)).size;

  const successRatio = total
    ? ((totalDelivered / total) * 100).toFixed(1)
    : "0";
  const failedRatio = total ? ((totalFailed / total) * 100).toFixed(1) : "0";
  const returnRatio = total ? ((totalReturned / total) * 100).toFixed(1) : "0";

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "entries"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data() as Entry);
      setEntries(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <p className="h-screen flex items-center justify-center text-black bg-white font-medium text-xl">
        {" "}
        Loading...{" "}
      </p>
    );
  return (
    <main className=" bg-gray-50 px-4 py-10 container mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12 flex items-center justify-center gap-2">
          🛵 <span>Rider Performance Dashboard</span>
        </h1>
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Success Ratio"
          value={`${successRatio}%`}
          bg="bg-green-100"
          text="text-green-700"
        />
        <StatCard
          title="Failed Ratio"
          value={`${failedRatio}%`}
          bg="bg-red-100"
          text="text-red-700"
        />
        <StatCard
          title="Return Ratio"
          value={`${returnRatio}%`}
          bg="bg-yellow-100"
          text="text-yellow-700"
        />
        <StatCard
          title="Total Riders"
          value={totalRiders}
          bg="bg-blue-100"
          text="text-blue-700"
        />
      </div>

      {/* Section Blocks */}
      <section className="grid grid-cols-2 gap-6">
        <DashboardBlock
          title="➕ Add Daily Entry"
          description="Form will go here."
        />
        <DashboardBlock
          title="📆 Filter Entries"
          description="Date/rider filters will go here."
        />
        <DashboardBlock title="📊 Today's Entries">
          <TodayEntries entries={entries} />
        </DashboardBlock>
        <DashboardBlock
          title="📅 Monthly Report"
          description="Dropdown and Generate button."
        />
      </section>

      {/* All riders */}
      <AllRiders />
    </main>
  );
}

function StatCard({
  title,
  value,
  bg,
  text,
}: {
  title: string;
  value: string | number;
  bg: string;
  text: string;
}) {
  return (
    <div className={`p-5 rounded-xl shadow-sm border ${bg} ${text}`}>
      <p className="text-sm font-medium uppercase">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function DashboardBlock({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-white p-6 mb-6 rounded-xl shadow border">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      {description && <p className="text-gray-500 mb-2">{description}</p>}
      {children}
    </section>
  );
}

function TodayEntries({ entries }: { entries: Entry[] }) {
  const today = new Date().toISOString().split("T")[0];
  const todayEntries = entries.filter((e) => e.date === today);

  if (todayEntries.length === 0) {
    return <p className="text-gray-500">No entries for today.</p>;
  }

  return (
    <div className="overflow-auto mt-4">
      <table className="w-full border rounded-xl overflow-hidden">
        <thead className="bg-gray-100 text-left text-sm uppercase text-gray-600">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Rider</th>
            <th className="px-4 py-2">Delivered</th>
            <th className="px-4 py-2">Failed</th>
            <th className="px-4 py-2">Returned</th>
          </tr>
        </thead>
        <tbody>
          {todayEntries.map((entry, index) => (
            <tr key={index} className="border-t text-sm text-gray-700">
              <td className="px-4 py-2">{entry.date}</td>
              <td className="px-4 py-2">{entry.rider}</td>
              <td className="px-4 py-2">{entry.delivered}</td>
              <td className="px-4 py-2">{entry.failed}</td>
              <td className="px-4 py-2">{entry.returned}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
