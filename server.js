// import { generateStdList } from "./FileStorageSystem/std_list.js";
// import { FileStorageSystemController } from "./FileStorageSystem/FileStorageSystemController.js";
// import express from "express";
// // import router from "./server/routes/index.js";
// import cors from "cors";

// const app = express();
// const port = 3000;
// const routes = [
//   "/ => get",
//   "/std_list => get",
//   "/take_attendance => post",
//   "/create_teacher => post",
//   "/get_teacher => get",
//   "/create_student => post",
//   "/get_student => get",
//   "/authenticate_teacher => post",
//   "/add_log_to_student => post",
//   "/get_logs => get",
// ];

// //enable cors
// app.use(cors());

// // app.use(app.json());
// app.use(express.json());
// // app.use(app.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true }));

import { generateStdList } from "./FileStorageSystem/std_list.js";
import { FileStorageSystemController } from "./FileStorageSystem/FileStorageSystemController.js";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
// const port = 3000;
const port = 3000;

// For ES modules, we need to recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS + body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.g/et("/", (req, res) => {
//   res.send("Welcome to El-Halaqa File Storage System!");
// });
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/api/std_list", (req, res) => {
  try {
    const stdList = generateStdList();
    res.send(stdList);
  } catch (error) {
    res.status(500).send("Error generating student list: " + error.message);
  }
});

app.post("/api/take_attendance", (req, res) => {
  const { std_names_list } = req.body;
  try {
    FileStorageSystemController.take_attendance(std_names_list);
    res.send("Attendance taken successfully.");
  } catch (error) {
    res.status(500).send("Error taking attendance: " + error.message);
  }
});

app.post("/api/get_attendance", (req, res) => {
  const { date } = req.body;
  if (!date) {
    return res.status(400).send("Must provide name.");
  }
  try {
    const attendance = FileStorageSystemController.get_attendance(date);
    res.send(attendance);
  } catch (error) {
    res.status(500).send("Error getting attendance: " + error.message);
  }
});

app.post("/api/create_teacher", (req, res) => {
  const { userName, password, type } = req.body;
  try {
    const teacherId = FileStorageSystemController.create_teacher({
      userName,
      password,
      type,
    });
    res.send({ teacherId });
  } catch (error) {
    console.log(error.stack);
    console.log(error.name);
    console.log(error.message);
    res.status(500).send("Error creating teacher: " + error.message);
  }
});

app.get("/api/get_teacher", (req, res) => {
  const { id, userName } = req.query;
  try {
    const teacher = FileStorageSystemController.get_teacher({ id, userName });
    res.send(teacher);
  } catch (error) {
    res.status(500).send("Error getting teacher: " + error.message);
  }
});

app.post("/api/create_student", (req, res) => {
  const { name_eng, name_arb, bDate, logs, school, overAllMem, newMem } =
    req.body;
  try {
    const studentId = FileStorageSystemController.create_student({
      name_eng,
      name_arb,
      bDate,
      logs,
      school,
      overAllMem,
      newMem,
    });
    res.send({ studentId });
  } catch (error) {
    res.status(500).send("Error creating student: " + error.message);
  }
});
app.get("/api/get_student", (req, res) => {
  const { id } = req.query;
  try {
    const student = FileStorageSystemController.get_student(id);
    res.send(student);
  } catch (error) {
    res.status(500).send("Error getting student: " + error.message);
  }
});
app.post("/api/authenticate_teacher", (req, res) => {
  const { userName, password } = req.body;
  try {
    const isAuthenticated = FileStorageSystemController.authenticate_teacher({
      userName,
      password,
    });
    res.send({ isAuthenticated });
  } catch (error) {
    res.status(500).send("Error authenticating teacher: " + error.message);
  }
});
app.post("/api/add_log_to_student", (req, res) => {
  const { studentId, log } = req.body;
  if (!studentId || !log) {
    return res.status(400).send("Must provide studentId and log.");
  }
  try {
    FileStorageSystemController.add_log_to_student(studentId, log);
    res.send("Log added to student successfully.");
  } catch (error) {
    res.status(500).send("Error adding log to student: " + error.message);
  }
});

app.get("/api/get_logs", (req, res) => {
  const { studentId, date } = req.query;
  if (!studentId) {
    return res.status(400).send("Must provide studentId.");
  }
  try {
    const logs = FileStorageSystemController.get_logs(studentId, date);
    res.send(logs);
  } catch (error) {
    res.status(500).send("Error getting logs: " + error.message);
  }
});

app.post("/api/delete_log", (req, res) => {
  const { studentId, logId } = req.body;
  if (!studentId || !logId) {
    return res.status(400).send("Must provide studentId and logId.");
  }
  try {
    FileStorageSystemController.delete_log(studentId, logId);
    res.json({ message: "Log deleted successfully." });
  } catch (error) {
    res.status(500).send("Error deleting log: " + error.message);
  }
});

// app.g/apiet("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

// // app.listen(port, () => {
// //   console.log(
// //     `Server is running on http://localhost:${port}, with routes:\n${routes.join(
// //       "\n"
// //     )}`
// //   );
// // });

// app.listen(port, "0.0.0.0", () => {
//   console.log(
//     `Server running at http://0.0.0.0:${port}, with routes:\n${routes.join(
//       "\n"
//     )}`
//   );
// });

// ... (all your other API endpoints unchanged) ...

// ================= FRONTEND =================
// Serve static files from React/Vite build
app.use(express.static(path.join(__dirname, "dist"))); // if Vite build
// app.use(express.static(path.join(__dirname, "build"))); // if CRA build

// Catch-all route: send index.html for React router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ================= START SERVER =================

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
