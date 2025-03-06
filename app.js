const express = require("express");
const path = require("path");

const app = express();
const PORT = 5500;

// Serve static files (CSS, JS, images, etc.)
app.use(express.static("public"));

// Route to serve index.html for any course page
app.get("/:course", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
