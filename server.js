import { generateStdList } from "./FileStorageSystem/std_list.js";
import { FileStorageSystemController } from "./FileStorageSystem/FileStorageSystemController.js";
import express from "express";
// import router from "./server/routes/index.js";
import cors from "cors";

const app = express();
const port = 3000;
const routes = [
  "/ => get",
  "/std_list => get",
  "/take_attendance => post",
  "/create_teacher => post",
  "/get_teacher => get",
  "/create_student => post",
  "/get_student => get",
  "/authenticate_teacher => post",
  "/add_log_to_student => post",
  "/get_logs => get",
];

//enable cors
app.use(cors());

// app.use(app.json());
app.use(express.json());
// app.use(app.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Welcome to El-Halaqa File Storage System!");
});
app.get("/std_list", (req, res) => {
  try {
    const stdList = generateStdList();
    res.send(stdList);
  } catch (error) {
    res.status(500).send("Error generating student list: " + error.message);
  }
});

app.post("/take_attendance", (req, res) => {
  const { std_names_list } = req.body;
  try {
    FileStorageSystemController.take_attendance(std_names_list);
    res.send("Attendance taken successfully.");
  } catch (error) {
    res.status(500).send("Error taking attendance: " + error.message);
  }
});

app.post("/create_teacher", (req, res) => {
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

app.get("/get_teacher", (req, res) => {
  const { id, userName } = req.query;
  try {
    const teacher = FileStorageSystemController.get_teacher({ id, userName });
    res.send(teacher);
  } catch (error) {
    res.status(500).send("Error getting teacher: " + error.message);
  }
});

app.post("/create_student", (req, res) => {
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
app.get("/get_student", (req, res) => {
  const { id } = req.query;
  try {
    const student = FileStorageSystemController.get_student(id);
    res.send(student);
  } catch (error) {
    res.status(500).send("Error getting student: " + error.message);
  }
});
app.post("/authenticate_teacher", (req, res) => {
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
app.post("/add_log_to_student", (req, res) => {
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

app.get("/get_logs", (req, res) => {
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

app.listen(port, () => {
  console.log(
    `Server is running on http://localhost:${port}, with routes:\n${routes.join(
      "\n"
    )}`
  );
});
