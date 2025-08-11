const fs = require("fs");

const filePath = "~/storage/documents/example.txt";
if (fs.existsSync(filePath)) {
  console.log("File exists");
} else {
  console.log("File does not exist, creating directory...");
  fs.mkdirSync(filePath, { recursive: true });
  console.log("Directory created");
}
fs.writeFileSync(filePath, "Hello, world!", (err) => {
  if (err) {
    console.error("Error writing file:", err);
  } else {
    console.log("File written successfully");
  }
});
