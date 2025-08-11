"use client";
import "react-datepicker/dist/react-datepicker.css";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import AddEntryForm from "./AddEntryForm";
import DatePicker from "react-datepicker";
import { TodayBadge } from "./TodayBadge";
import { useAllRiders } from "@/hooks/useAllRiders";

type RiderEntry = {
  id: string;
  date: Timestamp;
  rider: string;
  delivered: number;
  failed: number;
  returned: number;
};

export default function AllRiders() {
  const [entries, setEntries] = useState<RiderEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<RiderEntry[]>([]);
  const [loading, setLoading] = useState(true);
   const { riders } = useAllRiders();
  //filters
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(),
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const [selectedRider, setSelectedRider] = useState("");

  //   fetching all data
  const fetchEntries = async () => {
    const q = query(collection(db, "entries"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    const results: RiderEntry[] = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as RiderEntry)
    );
    setEntries(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // filter logic

  useEffect(() => {
    let filtered = [...entries];

    // filter

    if (startDate && endDate) {
      // Adjust end date to end of the day
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter((entry) => {
        const entryDate = entry.date.toDate();
        return entryDate >= startDate && entryDate <= adjustedEndDate;
      });
    }

    // rider filter


    if (selectedRider) {
      filtered = filtered.filter((entry) => entry.rider === selectedRider);
    }

    setFilteredEntries(filtered);
  }, [entries, startDate, endDate, selectedRider]);

  // delete rider
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure ?")) {
      console.log("Delete ", id);
      await deleteDoc(doc(db, "entries", id));
      fetchEntries();
    }
  };

  console.log(filteredEntries);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 container mx-auto">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {/*  */}
        <div className="flex items-center justify-between  mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 ">
            Rider Entries
          </h2>
          <AddEntryForm refreshEntries={fetchEntries} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              isClearable={true}
              className="border z-10 rounded px-2 py-1 w-60 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rider
            </label>
            <select
              value={selectedRider}
              onChange={(e) => setSelectedRider(e.target.value)}
              className="border rounded px-2 py-1 text-black"
            >
              <option value="">All Riders</option>
              {riders.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-gray-500">No entries found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded overflow-hidden">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="px-5 py-3 text-left border-b border-gray-200">
                    Date
                  </th>
                  <th className="px-5 py-3 text-left border-b border-gray-200">
                    Rider
                  </th>
                  <th className="px-5 py-3 text-left border-b border-gray-200">
                    Delivered
                  </th>
                  <th className="px-5 py-3 text-left border-b border-gray-200">
                    Failed
                  </th>
                  <th className="px-5 py-3 text-left border-b border-gray-200">
                    Returned
                  </th>
                  <th className="px-5 py-3 text-left border-b border-gray-200">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-5 py-3 text-sm text-gray-800 border-b border-gray-200">
                      {entry?.date?.toDate()?.toLocaleDateString("en-CA")}

                      <TodayBadge
                        entryDate={entry?.date
                          ?.toDate()
                          ?.toLocaleDateString("en-CA")}
                      />
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-800 border-b border-gray-200">
                      {entry.rider}
                    </td>
                    <td className="px-5 py-3 text-sm text-green-700 font-medium border-b border-gray-200">
                      {entry.delivered}
                    </td>
                    <td className="px-5 py-3 text-sm text-red-600 border-b border-gray-200">
                      {entry.failed}
                    </td>
                    <td className="px-5 py-3 text-sm text-yellow-600 border-b border-gray-200">
                      {entry.returned}
                    </td>
                    <td className="px-5 py-3 text-sm  border-b border-gray-200 text-red-600">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className=" cursor-pointer border rounded p-1"
                      >
                        Delete
                      </button>
                    </td>
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
