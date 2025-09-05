import { generateStdList } from "./std_list.js";
import { Attendance } from "./attendance.js";
import { User } from "./user.js";
import { Security } from "./security.js";
import { Student } from "./student.js";
// import fs from "fs";
// import os from "os";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
// import { Console } from "console";

export class FileStorageSystemController {
  // static #directory = path.join(os.homedir(), "/storage/documents/El-Halaqa");

  // attendance
  static take_attendance(std_names_list) {
    if (!Array.isArray(std_names_list) || std_names_list.length === 0) {
      throw new Error("Invalid student names list: std_names_list provided.");
    }
    const date = new Date().toISOString().split("T")[0];
    const attendance = new Attendance(date);
    attendance.save_attendance(std_names_list);
  }

  static get_attendance(date) {
    if (!date) {
      throw new Error("Must provide date to get attendance.");
    }
    const attendance = new Attendance(date);
    try {
      return attendance.get_attendance(date);
    } catch (Error) {
      console.log("Error getting attendance: " + Error.message);
      return null;
    }
  }

  static create_teacher(object) {
    const { userName, password, type } = object;
    if (!userName || !password || !type) {
      // console.log("inside create teacher of file storage system controller");
      throw new Error(
        "Invalid parameters. Must provide userName, password, and type."
      );
    }
    const passwordHashed = bcrypt.hashSync(password, 10);
    try {
      const teacher = new User({
        userName: userName,
        passwordHashed: passwordHashed,
        type: type,
      });
      teacher.saveUser(type);
      return teacher.get_id();
    } catch (Error) {
      console.log("Error creating teacher: " + Error.message);
      return null;
    }
  }

  static get_teacher(object) {
    const { id, userName } = object;
    if (!id && !userName) {
      throw new Error("Must provide either id or userName to get teacher.");
    }
    try {
      return User.getUser({ id: id, userName: userName });
    } catch (Error) {
      console.log("Error getting teacher: " + Error.message);
      return null;
    }
  }

  static authenticate_teacher(object) {
    const { userName, password } = object;
    if (!userName || !password) {
      throw new Error("Must provide userName and password to authenticate.");
    }
    try {
      return Security.authenticate(userName, password);
    } catch (Error) {
      console.log("Error authenticating teacher: " + Error.message);
      return false;
    }
  }

  static create_student(object) {
    const { name_eng, name_arb, bDate, logs, school, overAllMem, newMem } =
      object;
    if (
      !name_eng ||
      !name_arb ||
      !bDate ||
      !school ||
      overAllMem === undefined ||
      newMem === undefined
    ) {
      throw new Error(
        "Invalid parameters. Must provide name_eng, name_arb, bDate, logs, school, overAllMem, and newMem."
      );
    }
    try {
      const student = new Student({
        name_eng: name_eng,
        name_arb: name_arb,
        bDate: bDate,
        logs: logs,
        school: school,
        overAllMem: overAllMem,
        newMem: newMem,
      });
      student.save_student();
      generateStdList();
      return student.get_id();
    } catch (Errorr) {
      throw new Error("Error creating student: " + Errorr.message);
      return null;
    }
  }

  static get_student(id) {
    if (!id) {
      throw new Error("Must provide id to get student.");
    }
    try {
      return Student.get_student(id);
    } catch (Error) {
      console.log("Error getting student: " + Error.message);
      return null;
    }
  }

  static add_log_to_student(studentId, object) {
    const {
      teacherId,
      memDone,
      memGrade,
      newMem,
      revDone,
      revGrade,
      overAllMem,
      time,
      notes,
    } = object;
    if (
      !studentId ||
      !teacherId
      // memDone === undefined ||
      // memGrade === undefined ||
      // revDone === undefined ||
      // revGrade === undefined
      // !time
    ) {
      throw new Error(
        "Invalid parameters. Must provide studentId, teacherId, memDone, memGrade, revDone, revGrade, and time."
      );
    }
    try {
      const student = new Student({ id: studentId });
      // student.
      student.save_logs({
        teacherId: teacherId,
        memDone: memDone,
        memGrade: memGrade,
        newMem: newMem,
        revDone: revDone,
        revGrade: revGrade,
        overAllMem: overAllMem,
        time: time || new Date().toISOString(),
        notes: notes,
      });
      return true;
    } catch (Error) {
      console.log("Error adding log to student: " + Error.message);
      return false;
    }
  }

  static get_logs(studentId, date) {
    if (!studentId) {
      throw new Error("Must provide studentId to get logs.");
    }
    try {
      const student = new Student({ id: studentId });
      return student.get_logs(date);
    } catch (Error) {
      console.log("Error getting logs: " + Error.message);
      return null;
    }
  }

  static delete_log(studentId, logId) {
    if (!studentId || !logId) {
      throw new Error("Must provide studentId and logId to delete log.");
    }
    try {
      const student = new Student({ id: studentId });
      return student.delete_log(logId);
    } catch (Error) {
      console.log("Error deleting log: " + Error.message);
      return false;
    }
  }
  static add_group_to_teacher(object) {
    const { id, name, students } = object;
  }
}
