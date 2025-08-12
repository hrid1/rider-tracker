"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import AddRider from "./AddRider";
import toast from "react-hot-toast";


type Rider = {
  id: string;
  name: string;
  phone?: string;
};

export default function AllRidersTable() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRiders = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "riders"));
    const data: Rider[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Rider, "id">),
    }));
    setRiders(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this rider?")) {
      await deleteDoc(doc(db, "riders", id));
      toast.success("Rider deleted successfully")
      fetchRiders();
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8 container mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Riders</h2>
      <AddRider onRiderAdded={fetchRiders}/>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : riders.length === 0 ? (
        <p className="text-gray-500">No riders found.</p>
      ) : (
        <div className="overflow-x-auto max-w-3xl mx-auto border border-gray-300 rounded-md">
          <table className="min-w-full border border-gray-200 rounded overflow-hidden ">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="px-5 py-3 text-left border-b border-gray-200">Name</th>
                <th className="px-5 py-3 text-left border-b border-gray-200">Phone</th>
                <th className="px-5 py-3 text-right border-b border-gray-200 ">Action</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider, index) => (
                <tr
                  key={rider.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-5 py-3 text-sm text-gray-800 border-b border-gray-200">
                    {rider.name}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-800 border-b border-gray-200">
                    {rider.phone || "-"}
                  </td>
                  <td className="px-5 py-3 text-sm text-red-600 border-b border-gray-200 text-right">
                    <button
                      onClick={() => handleDelete(rider.id)}
                      className="cursor-pointer border rounded p-1 hover:bg-red-100 "
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
  );
}
