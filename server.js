const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5500;

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(__dirname));

// Load the questions JSON file
const questionsFile = path.join(__dirname, "questions.json");

// Function to get course name from URL
function getCourseFromPath(courseSlug) {
  const courseMap = {
    "armonia-1": "Armonia I",
    "armonia-2": "Armonia II",
    "armonia-3": "Armonia III",
    "armonia-4": "Armonia IV",
    "armonia-5": "Armonia V",
    "armonia-6": "Armonia VI",
    "armonia-7": "Armonia VII",
    "armonia-8": "Armonia VIII",
    "armonia-9": "Armonia IX",
    "bajo-1": "Bajo I",
    "bajo-2": "Bajo II",
    "groove-1": "Groove I",
    "amplificadores-1": "Amplificadores I",
    "walking-1": "Walking I",
    "melodia-1": "Melodía I",
    "lectura-1": "Lectura I",
    "lectura-2": "Lectura II",
    "lectura-3": "Lectura III",
  };

  return courseMap[courseSlug] || null; // Return null if not found
}

// Route to serve quiz data based on course
app.get("/quiz/:course", (req, res) => {
  const courseSlug = req.params.course;
  const courseName = getCourseFromPath(courseSlug);

  if (!courseName) {
    return res.status(404).json({ error: "Course not found." });
  }

  fs.readFile(questionsFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading questions file." });
    }

    try {
      const quizData = JSON.parse(data);
      if (!quizData[courseName]) {
        return res
          .status(404)
          .json({ error: "Quiz not found for this course." });
      }

      res.json(quizData[courseName]); // Return quiz questions
    } catch (parseError) {
      res.status(500).json({ error: "Error parsing questions file." });
    }
  });
});

// Route to serve index.html for any course page
app.get("/:course", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
