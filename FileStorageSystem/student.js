import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import os from "os";
import path from "path";

export class Student {
  // strcuture of student data
  //   stdData = {
  //     id: "uuid",
  //     name_eng: "Ahmed",
  //     name_arb: "احمد",
  //     bDate: "01-01-2000",
  //     logs: {
  //       "uuid@Date": {
  //         teacherId: "uuid",
  //         memDone: true,
  //         memGrade: "10/10",
  //         revDone: false,
  //         revGrade: "8.5/10",
  //         time: "time",
  //         notes: "null = (optional)",
  //       },
  //     },
  //     school: "El Nasr Boys School",
  //     overAllMem: "From page 1 to 30",
  //     newMem: "page 31",
  //   };
  #id;
  #name_eng;
  #name_arb;
  #bDate;
  #logs = {};
  #school;
  #overAllMem;
  #newMem;
  #directory = path.join(os.homedir(), "/storage/documents/El-Halaqa/students");
  #filePath;
  //   #filePath = path.join(this.#directory, "users.json");

  constructor(object) {
    const { id, name_eng, name_arb, bDate, logs, school, overAllMem, newMem } =
      object;
    if (id) {
      this.#filePath = path.join(this.#directory, `${id}.json`);
      if (!fs.existsSync(this.#filePath)) {
        throw new Error(`Student with id ${id} does not exist.`);
      }
      const studentData = JSON.parse(fs.readFileSync(this.#filePath, "utf8"));
      this.#name_eng = studentData.name_eng;
      this.#name_arb = studentData.name_arb;
      this.#bDate = studentData.bDate;
      this.#school = studentData.school;
      this.#overAllMem = studentData.overAllMem;
      this.#newMem = studentData.newMem;
    } else if (
      name_eng &&
      name_arb &&
      bDate &&
      school &&
      overAllMem &&
      newMem
    ) {
      this.#id = uuidv4();
      this.#filePath = path.join(this.#directory, `${this.#id}.json`);
      this.#name_eng = name_eng;
      this.#name_arb = name_arb;
      this.#bDate = bDate;
      this.#school = school;
      this.#overAllMem = overAllMem;
      this.#newMem = newMem;
    } else {
      throw new Error(
        "Invalid parameters. Must provide ( id ) or ( name_eng ,name_arb ,bDate ,logs ,school ,overAllMem , and newMem )."
      );
    }
  }

  get_id() {
    return this.#id;
  }

  static get_student(id) {
    const directory = path.join(
      os.homedir(),
      "/storage/documents/El-Halaqa/students"
    );
    const filePath = path.join(directory, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Student with id ${id} does not exist.`);
    }
    const studentData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return studentData;
  }

  save_student() {
    if (!fs.existsSync(this.#directory)) {
      fs.mkdirSync(this.#directory, { recursive: true });
    }
    if (fs.existsSync(this.#filePath)) {
      throw new Error(`Student with id ${this.#id} already exists.`);
    }
    const studentData = {
      id: this.#id,
      name_eng: this.#name_eng,
      name_arb: this.#name_arb,
      bDate: this.#bDate,
      logs: this.#logs,
      school: this.#school,
      overAllMem: this.#overAllMem,
      newMem: this.#newMem,
    };
    fs.writeFileSync(this.#filePath, JSON.stringify(studentData, null, 2));
    return studentData;
  }

  save_logs(log) {
    const { teacherId, memDone, memGrade, revDone, revGrade, time, notes } =
      log;
    console.log("save_logs called with parameters:", {
      teacherId,
      memDone,
      memGrade,
      revDone,
      revGrade,
      time,
      notes,
    });
    if (!(teacherId && memDone && memGrade && revGrade && time)) {
      throw new Error(
        "Invalid log parameters. Must provide teacherId, memDone, memGrade, revGrade, and time."
      );
    }
    if (!fs.existsSync(this.#directory)) {
      fs.mkdirSync(this.#directory, { recursive: true });
    }
    const studentData = JSON.parse(fs.readFileSync(this.#filePath, "utf8"));
    studentData.logs[`${uuidv4()}@${new Date().toISOString().split("T")[0]}`] =
      {
        teacherId: teacherId,
        memDone: memDone,
        memGrade: memGrade,
        revDone: revGrade !== "false" ? "-1/10" : revDone,
        revGrade: revGrade,
        time: time,
        notes: notes || "null",
      };
    this.#logs = studentData.logs;
    fs.writeFileSync(this.#filePath, JSON.stringify(studentData, null, 2));
  }

  get_logs(date) {
    if (!fs.existsSync(this.#filePath)) {
      throw new Error(`Student with id ${this.#id} does not exist.`);
    }
    const studentData = JSON.parse(fs.readFileSync(this.#filePath, "utf8"));
    if (date) {
      const logs = Object.entries(studentData.logs).filter(([key]) =>
        key.includes(date)
      );
      return Object.fromEntries(logs);
    }
    return studentData.logs;
  }
}
