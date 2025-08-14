// utils/exportExcel.ts
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data: any[], filename: string = "data.xlsx") => {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Convert data to Excel-friendly format
  const formattedData = data.map((row) => {
    const newRow: Record<string, any> = {};
    for (const key in row) {
      if (row[key]?.toDate) {
        // Convert Firestore Timestamp to string
        newRow[key] = row[key].toDate().toLocaleDateString("en-CA");
      } else {
        newRow[key] = row[key];
      }
    }
    return newRow;
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate Excel file and save
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, filename);
};
