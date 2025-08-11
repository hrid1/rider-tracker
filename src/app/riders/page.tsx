'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type RiderEntry = {
  date: string;
  rider: string;
  delivered: number;
  failed: number;
  returned: number;
};

export default function RidersPage() {
  const [entries, setEntries] = useState<RiderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      const q = query(collection(db, 'entries'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const results: RiderEntry[] = snapshot.docs.map((doc) => doc.data() as RiderEntry);
      setEntries(results);
      setLoading(false);
    };

    fetchEntries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Rider Entries</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-gray-500">No entries found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded overflow-hidden">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="px-5 py-3 text-left border-b border-gray-200">Date</th>
                  <th className="px-5 py-3 text-left border-b border-gray-200">Rider</th>
                  <th className="px-5 py-3 text-left border-b border-gray-200">Delivered</th>
                  <th className="px-5 py-3 text-left border-b border-gray-200">Failed</th>
                  <th className="px-5 py-3 text-left border-b border-gray-200">Returned</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-5 py-3 text-sm text-gray-800 border-b border-gray-200">{entry.date}</td>
                    <td className="px-5 py-3 text-sm text-gray-800 border-b border-gray-200">{entry.rider}</td>
                    <td className="px-5 py-3 text-sm text-green-700 font-medium border-b border-gray-200">{entry.delivered}</td>
                    <td className="px-5 py-3 text-sm text-red-600 border-b border-gray-200">{entry.failed}</td>
                    <td className="px-5 py-3 text-sm text-yellow-600 border-b border-gray-200">{entry.returned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
