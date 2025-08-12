import fs from "fs";
import os from "os";
import path from "path";

const filePath = path.join(os.homedir(), "storage", "documents", "example.txt");

// Ensure the directory exists before writing
fs.mkdirSync(path.dirname(filePath), { recursive: true });

// Check if the file exists
if (fs.existsSync(filePath)) {
  console.log("File exists");
}

// Write to file (synchronously, no callback)
fs.writeFileSync(filePath, "Hello, worlds!");
console.log("File written successfully");
