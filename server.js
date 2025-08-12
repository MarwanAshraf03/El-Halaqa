import { Attendance } from "./FileStorageSystem/attendance.js";
import { User } from "./FileStorageSystem/user.js";
import { Security } from "./FileStorageSystem/security.js";
import bcrypt from "bcrypt";

const AttendanceSystem = new Attendance("2023-10-01");
AttendanceSystem.save_attendance(["مروان", "احمد", "سمير"]);
console.log("Attendance saved successfully.");
try {
  console.log(
    "Attendance records for 2023-10-01:",
    AttendanceSystem.get_attendance("2023-10-01")
  );
} catch (error) {
  console.error("Error retrieving attendance records:", error.message);
}
let user;
try {
  user = new User({
    userName: "mohame",
    passwordHashed: bcrypt.hashSync("password1233", 10),
    type: "Mem",
  });
} catch (error) {
  console.error("Error creating user:", error.message);
}
// const user = new User({ id: "bbb81271-7b9d-49ef-9451-78e3638f9897" });
if (user) {
  console.log("User created successfully:", user.getUserInfo());
  try {
    const retrievedUser = User.getUser({ userName: "mohamedd" });
    console.log("Retrieved user:", retrievedUser);
  } catch (error) {
    console.error("Error retrieving user:", error.message);
  }
  const isAuthenticated = Security.authenticate("mohamedd", "password123");
  console.log(
    "User authentication status:",
    isAuthenticated ? "Authenticated" : "Not authenticated"
  );
}
