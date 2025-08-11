"use client";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase"; // Assuming this path is correct

import AddEntryForm from "./AddEntryForm";
import DatePicker from "react-datepicker";
import { useAllRiders } from "@/hooks/useAllRiders";
import RiderPerformanceCard from "./RiderPerformanceCard";

type RiderEntry = {
  id: string;
  date: Timestamp;
  rider: string;
  delivered: number;
  failed: number;
  returned: number;
};

type RiderPerformance = {
  name: string;
  total: number;
  success: number;
  failed: number;
  returned: number;
  successPercentage: number;
  days: number;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Hook to fetch all entries
const useAllEntries = () => {
  const [entries, setEntries] = useState<RiderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const q = query(collection(db, "entries"));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            date: data.date,
            rider: data.rider,
            delivered: data.delivered,
            failed: data.failed,
            returned: data.returned,
          } as RiderEntry;
        });
        setEntries(results);
      } catch (error) {
        console.error("Failed to fetch entries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  return { entries, loading };
};

export default function ReportGenerator() {
  const currentDate = new Date();
  const currentMonthName = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showTop10, setShowTop10] = useState(false);
  const [topPerformers, setTopPerformers] = useState<RiderPerformance[]>([]);
  const [reportLoading, setReportLoading] = useState(false);

  const { entries, loading: dataLoading } = useAllEntries();

  const generateReport = useCallback(() => {
    setReportLoading(true);

    const filteredEntries = entries.filter((entry) => {
      if (!entry.date || !(entry.date instanceof Timestamp)) return false;
      const entryDate = entry.date.toDate();
      const monthMatch = entryDate.getMonth() === months.indexOf(selectedMonth);
      const yearMatch = entryDate.getFullYear() === selectedYear;
      return monthMatch && yearMatch;
    });

    const aggregatedData: {
      [key: string]: {
        totalDelivered: number;
        totalFailed: number;
        totalReturned: number;
        totalEntries: number;
      };
    } = {};

    filteredEntries.forEach((entry) => {
      if (!aggregatedData[entry.rider]) {
        aggregatedData[entry.rider] = {
          totalDelivered: 0,
          totalFailed: 0,
          totalReturned: 0,
          totalEntries: 0,
        };
      }
      aggregatedData[entry.rider].totalDelivered += entry.delivered;
      aggregatedData[entry.rider].totalFailed += entry.failed;
      aggregatedData[entry.rider].totalReturned += entry.returned;
      aggregatedData[entry.rider].totalEntries += 1;
    });

    const formattedPerformers: RiderPerformance[] = Object.keys(
      aggregatedData
    ).map((riderName) => {
      const data = aggregatedData[riderName];
      const total =
        data.totalDelivered + data.totalFailed + data.totalReturned;
      const successPercentage = total > 0 ? (data.totalDelivered / total) * 100 : 0;
      return {
        name: riderName,
        total,
        success: data.totalDelivered,
        failed: data.totalFailed,
        returned: data.totalReturned,
        successPercentage,
        days: data.totalEntries,
      };
    });

    formattedPerformers.sort((a, b) => {
      if (b.successPercentage !== a.successPercentage) {
        return b.successPercentage - a.successPercentage;
      }
      return b.success - a.success;
    });

    const topCount = showTop10 ? 10 : 5;
    setTopPerformers(formattedPerformers.slice(0, topCount));
    setReportLoading(false);
  }, [entries, selectedMonth, selectedYear, showTop10]);

  // Regenerate report when dependencies change
  useEffect(() => {
    if (!dataLoading && entries.length > 0) {
      generateReport();
    }
  }, [dataLoading, entries, generateReport]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Monthly Performance Report
        </h1>

        {/* Filters and Generate button */}
        <div className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-md bg-gray-50 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              min={2000}
              max={2100}
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>
          <div className="flex-1 flex items-center mt-6 md:mt-0">
            <input
              type="checkbox"
              id="showTop10"
              checked={showTop10}
              onChange={(e) => setShowTop10(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showTop10" className="ml-2 block text-sm text-gray-900">
              Show Top 10
            </label>
          </div>
          <div className="flex-1 mt-6 md:mt-0">
            <button
              onClick={generateReport}
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Generate Report
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Top Performers {selectedMonth} {selectedYear}
          <span className="ml-4 text-sm text-gray-500 font-normal">
            ({entries.length} total entries)
          </span>
        </h2>

        {reportLoading || dataLoading ? (
          <p className="text-center text-gray-500">Loading report...</p>
        ) : topPerformers.length === 0 ? (
          <p className="text-center text-gray-500">
            No entries found for {selectedMonth} {selectedYear}.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPerformers.map((performer) => (
              <RiderPerformanceCard
                key={performer.name} // Use unique rider name as key
                performer={performer}
                rank={topPerformers.indexOf(performer) + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
