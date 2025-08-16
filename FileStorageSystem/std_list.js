import fs from "fs";
import os from "os";
import path, { join } from "path";

export function generateStdList() {
  const stdListDirectory = path.join(
    os.homedir(),
    "/storage/documents/El-Halaqa/students_list"
  );
  const stdListFilePath = path.join(stdListDirectory, "std_list.txt");
  const stdDirectory = path.join(
    os.homedir(),
    "/storage/documents/El-Halaqa/students"
  );
  const files = fs.readdirSync(stdDirectory);
  if (!fs.existsSync(stdListDirectory)) {
    fs.mkdirSync(stdListDirectory, { recursive: true });
  }
  let students = [];
  files.forEach((file) => {
    const filePath = path.join(stdDirectory, file);
    const studentData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const stdInfo = `${file.split(".")[0]} - ${studentData.name_arb} - ${
      studentData.name_eng
    }\n`;
    students.push(stdInfo);
  });

  fs.writeFileSync(stdListFilePath, students.join("\n"), "utf8");
  return students.join("\n");
}
