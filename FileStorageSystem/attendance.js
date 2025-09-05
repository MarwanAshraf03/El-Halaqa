import fs from "fs";
import os from "os";
import path from "path";

export class Attendance {
  #name;
  #directory;
  #filePath;

  constructor(name) {
    // create a directory for attendance records if not exists then create a file for a date
    // name is the date of the attendance record
    this.#name = name;
    this.#directory = path.join(
      os.homedir(),
      "/storage/documents/El-Halaqa/attendance"
    );
    if (!fs.existsSync(this.#directory)) {
      fs.mkdirSync(this.#directory, { recursive: true });
    }
    this.#filePath = path.join(this.#directory, `${this.#name}.txt`);
  }

  save_attendance(records) {
    // Save attendance records to a file
    // records is list of names, it should be saved to the file with each name followed by new line
    fs.writeFileSync(this.#filePath, records.join("\n"), "utf8");
  }

  get_attendance(name) {
    if (!fs.existsSync(this.#directory + `/${name}.txt`)) {
      throw new Error(`Attendance record for ${name} does not exist.`);
    }
    let ret = fs.readFileSync(
      path.join(this.#directory, `${name}.txt`),
      "utf8"
    );
    // ret = ret.split("\n");
    // return ret.filter((item) => item.trim() !== ""); // filter out empty lines
    return ret;
  }
}

// markAttendance(studentId, date) {
//     const record = { studentId, date };
//     this.attendanceRecords.push(record);
//     return record;
// }

// getAttendance(studentId) {
//     return this.attendanceRecords.filter(record => record.studentId === studentId);
// }

// getAllAttendance() {
//     return this.attendanceRecords;
// }
