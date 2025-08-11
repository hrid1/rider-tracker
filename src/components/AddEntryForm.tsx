"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { useAllRiders } from "@/hooks/useAllRiders";

interface RefreshEntriesType {
  refreshEntries: () => void;
}

export default function AddEntryForm({ refreshEntries }: RefreshEntriesType) {
  const [isOpen, setIsOpen] = useState(false);
  const { riders} = useAllRiders();

  const [date, setDate] = useState("");
  const [rider, setRider] = useState("");
  const [delivered, setDelivered] = useState("");
  const [failed, setFailed] = useState("");
  const [returned, setReturned] = useState("");

  const handleAddEntry = async () => {
    if (!date || !rider || !delivered || !failed || !returned) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await addDoc(collection(db, "entries"), {
        date: Timestamp.fromDate(new Date(date)),
        rider,
        delivered: Number(delivered),
        failed: Number(failed),
        returned: Number(returned),
        createdAt: Timestamp.now(),
      });

      console.log({
        date: Timestamp.fromDate(new Date(date)),
        rider,
        delivered: Number(delivered),
        failed: Number(failed),
        returned: Number(returned),
        createdAt: Timestamp.now(),
      });
      toast.success("Entry added successfully");
      refreshEntries();

      setDate("");
      setRider("");
      setDelivered("");
      setFailed("");
      setReturned("");
      setIsOpen(false);
      refreshEntries();
    } catch (error) {
      console.error("Error adding entry:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className=" ">
      {/* action button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-900 cursor-pointer transition-colors duration-300"
      >
        Add Rider +
      </button>

      {/* modal div */}
      {isOpen && (
        <div className=" bg-gray-900/50 fixed inset-0 backdrop-blur-[2px]">
          <div className="flex items-center justify-center h-full w-full">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-100 relative p-6">
              <div className=" relative">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Add Rider Entry
                </h2>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-black absolute -right-2 -top-2 text-xl font-bold bg-gray-100 px-2 rounded cursor-pointer hover:bg-gray-200"
                >
                  x
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <select
                  value={rider}
                  onChange={(e) => setRider(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Rider</option>
                  {riders.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Delivered"
                  value={delivered}
                  onChange={(e) => setDelivered(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Failed"
                  value={failed}
                  onChange={(e) => setFailed(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Returned"
                  value={returned}
                  onChange={(e) => setReturned(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <button
                  onClick={handleAddEntry}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
