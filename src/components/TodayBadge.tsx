export const TodayBadge = ({ entryDate }: { entryDate: string }) => {
  const isToday = () => {
    const today = new Date();
    const localDate = today.toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
    return entryDate === localDate;
  };

  if (!isToday()) return null;

  return (
    <span className="text-white bg-blue-600 rounded-full px-1.5 py-1 text-xs font-medium ml-2">
      Today
    </span>
  );
};
