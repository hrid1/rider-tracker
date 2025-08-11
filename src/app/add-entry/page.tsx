'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

export default function AddEntryPage() {
  const [date, setDate] = useState('');
  const [rider, setRider] = useState('');
  const [delivered, setDelivered] = useState('');
  const [failed, setFailed] = useState('');
  const [returned, setReturned] = useState('');

  const handleAddEntry = async () => {
    try {
      await addDoc(collection(db, 'entries'), {
        date,
        rider,
        delivered: Number(delivered),
        failed: Number(failed),
        returned: Number(returned),
        createdAt: Timestamp.now(),
      });
      alert('Entry added successfully');
      setDate('');
      setRider('');
      setDelivered('');
      setFailed('');
      setReturned('');
    } catch (error) {
      console.error('Error adding entry:', error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add Rider Entry</h2>

        <div className="space-y-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Rider Name"
            value={rider}
            onChange={(e) => setRider(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Delivered"
            value={delivered}
            onChange={(e) => setDelivered(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Failed"
            value={failed}
            onChange={(e) => setFailed(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Returned"
            value={returned}
            onChange={(e) => setReturned(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  );
}
