import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function MonthlyReport() {
  return (
    <div className="p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Monthly Report</h2>
        <p className="text-sm text-gray-500">
          View detailed performance reports and rankings for any month.
        </p>
      </header>

      <Link
        href="/report"
        className="inline-flex items-center gap-1 text-sm font-medium border bg-gray-800 text-white rounded-lg p-2 hover:text-gray-200 transition-colors"
      >
        View Reports
        <MoveRight size={16} />
      </Link>
    </div>
  );
}
