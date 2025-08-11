const fs = require("fs");

const filePath = "~/storage/documents/example.txt";
fs.writeFileSync(filePath, "Hello, world!", (err) => {
  if (err) {
    console.error("Error writing file:", err);
  } else {
    console.log("File written successfully");
  }
});
