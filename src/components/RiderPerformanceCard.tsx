// components/RiderPerformanceCard.tsx

import React from "react";

type RiderPerformance = {
  name: string;
  total: number;
  success: number;
  failed: number;
  returned: number;
  successPercentage: number;
  days: number;
};

type RiderPerformanceCardProps = {
  performer: RiderPerformance;
  rank: number;
};

export default function RiderPerformanceCard({
  performer,
  rank,
}: RiderPerformanceCardProps) {
  const { name, total, success, failed, returned, successPercentage, days } =
    performer;

  // Calculate percentages for the progress bars
  const failedPercentage = total > 0 ? (failed / total) * 100 : 0;
  const returnedPercentage = total > 0 ? (returned / total) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 relative">
      {/* Rank Badge */}
      <span className="absolute top-0 right-0 bg-blue-600 text-white font-bold rounded-bl-xl rounded-tr-xl px-3 py-1 text-lg">
        #{rank}
      </span>

      {/* Rider Info */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">
          <span className="font-semibold">{days}</span> Days
        </p>
      </div>

      {/* Total Count */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600">Total: {total}</h4>
      </div>

      {/* Performance Breakdown */}
      <div className="space-y-4">
        {/* Success Bar */}
        <div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-green-700">Success</span>
            <span className="text-green-700">{success} ({successPercentage.toFixed(0)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${successPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Failed Bar */}
        <div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-orange-600">Failed</span>
            <span className="text-orange-600">{failed} ({failedPercentage.toFixed(0)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div
              className="bg-orange-500 h-2.5 rounded-full"
              style={{ width: `${failedPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Returned Bar */}
        <div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-red-600">Returned</span>
            <span className="text-red-600">{returned} ({returnedPercentage.toFixed(0)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div
              className="bg-red-500 h-2.5 rounded-full"
              style={{ width: `${returnedPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}