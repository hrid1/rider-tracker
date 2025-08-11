import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

type AddRiderFormProps = {
  onRiderAdded: () => void;
};

export default function AddRider({ onRiderAdded }: AddRiderFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddRider = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await addDoc(collection(db, "riders"), {
        name,
        phone,
        createdAt: new Date(),
      });

      toast.success("Rider added successfully!");
      setName("");
      setPhone("");
      setIsOpen(false); // Close modal after adding
      onRiderAdded();
    } catch (error) {
      console.error("Error adding rider:", error);
      toast.error("Failed to add rider.");
    }
  };


  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
      >
        Add Rider
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold"
            >
              ×
            </button>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Add New Rider
            </h2>

            {/* Form */}
            <form onSubmit={handleAddRider}>
              <input
                type="text"
                placeholder="Name"
                className="border p-2 rounded w-full mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Phone"
                className="border p-2 rounded w-full mb-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                // onWheel={handleWheel}
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
              >
                Save Rider
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
