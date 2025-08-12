import e from "express";
import { Attendance } from "./FileStorageSystem/attendance.js";

const AttendanceSystem = new Attendance("2023-10-01");
AttendanceSystem.save_attendance(["مروان", "احمد", "سمير"]);
console.log("Attendance saved successfully.");
try {
  console.log(
    "Attendance records for 2023-10-02:",
    AttendanceSystem.get_attendance("2023-10-02")
  );
} catch (error) {
  console.error("Error retrieving attendance records:", error.message);
}
