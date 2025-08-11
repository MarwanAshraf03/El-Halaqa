// const fs = require("fs");

// const filePath = "~/storage/documents/example.txt";
// if (fs.existsSync(filePath)) {
//   console.log("File exists");
// }
// fs.writeFileSync(filePath, "Hello, world!", (err) => {
//   if (err) {
//     console.error("Error writing file:", err);
//   } else {
//     console.log("File written successfully");
//   }
// });

const fs = require("fs");
const os = require("os");
const path = require("path");

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
