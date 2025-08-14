"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { useAllRiders } from "@/hooks/useAllRiders";

interface EditEntryFormProps {
  entry: {
    id: string;
    date: string | Date | any;
    rider: string;
    delivered: number;
    failed: number;
    returned: number;
  };
  refreshEntries: () => void;
  onClose: () => void;
}

export default function EditEntryForm({
  entry,
  refreshEntries,
  onClose,
}: EditEntryFormProps) {
  const { riders } = useAllRiders();

  const [date, setDate] = useState("");
  const [rider, setRider] = useState("");
  const [delivered, setDelivered] = useState("");
  const [failed, setFailed] = useState("");
  const [returned, setReturned] = useState("");

  console.log("entry", entry);
  useEffect(() => {
    if (entry) {
      let formattedDate = "";
      if (typeof entry.date === "string") {
        // If it's already a string like "2025-08-14"
        formattedDate = entry.date;
      } else if (entry.date.seconds) {
        // Firestore Timestamp -> JS Date -> YYYY-MM-DD
        formattedDate = new Date(entry.date.seconds * 1000)
          .toISOString()
          .split("T")[0];
      } else {
        // Fallback for normal Date object
        formattedDate = new Date(entry.date).toISOString().split("T")[0];
      }

      //
      setDate(formattedDate);
      setRider(entry.rider);
      setDelivered(entry.delivered.toString());
      setFailed(entry.failed.toString());
      setReturned(entry.returned.toString());
    }
  }, [entry]);

  const handleUpdateEntry = async () => {
    if (!date || !rider || !delivered || !failed || !returned) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await updateDoc(doc(db, "entries", entry.id), {
        date: Timestamp.fromDate(new Date(date)),
        rider,
        delivered: Number(delivered),
        failed: Number(failed),
        returned: Number(returned),
      });

      toast.success("Entry updated successfully");
      refreshEntries();
      onClose();
    } catch (error) {
      console.error("Error updating entry:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="z-50 bg-gray-900/50 fixed inset-0 backdrop-blur-[2px]">
      <div className="flex items-center justify-center h-full w-full">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-100 relative p-6">
          <div className="relative">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Edit Rider Entry
            </h2>
            <button
              onClick={onClose}
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
              className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <label  className="mb-1 font-medium">Deliverd</label>
            <input
              type="number"
              placeholder="Delivered"
              value={delivered}
              onChange={(e) => setDelivered(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
             <label className="mb-1 font-medium">Failed</label>
            <input
              type="number"
              placeholder="Failed"
              value={failed}
              onChange={(e) => setFailed(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
             <label className="mb-1 font-medium">Returned</label>
            <input
              type="number"
              placeholder="Returned"
              value={returned}
              onChange={(e) => setReturned(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              onClick={handleUpdateEntry}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
