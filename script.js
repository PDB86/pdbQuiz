// Select key elements from the HTML
const questionText = document.getElementById("question-text");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-button");
const progressText = document.getElementById("current-question");
const totalQuestionsText = document.getElementById("total-questions");
const scoreText = document.getElementById("score");
const scoreContainer = document.getElementById("score-container");
const finalScoreText = document.getElementById("final-score");
const totalQuestionsFinalText = document.getElementById(
  "total-questions-final"
);
const restartButton = document.getElementById("restart-button");

// Question bank
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Function to load questions dynamically based on the selected course
async function loadQuestions(course) {
  try {
    const response = await fetch("questions.json");
    const data = await response.json();

    console.log("Fetched data:", data);
    console.log("Looking for course:", course);

    if (data[course] && data[course].length > 0) {
      questions = data[course];
      document.getElementById("course-title").innerText = course; // ✅ Update H1 dynamically
      console.log("Loaded questions:", questions);
      startQuiz();
    } else {
      console.error("Course not found or no questions available:", course);
      questions = [];
      document.getElementById("question-text").innerText =
        "No questions available.";
      document.getElementById("answer-buttons").innerHTML = "";
      document.getElementById("next-button").style.visibility = "hidden";
    }
  } catch (error) {
    console.error("Error loading questions:", error);
  }
}

function getCourseFromPath() {
  const path = window.location.pathname; // Get the URL path (e.g., "/armonia-1")
  const segments = path.split("/"); // Split the path by "/"
  const lastSegment = segments.pop() || segments.pop(); // Get the last segment (handles trailing slash)

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
    "guitarra-2": "Guitarra II",
    "groove-1": "Groove I",
    "amplificadores-1": "Amplificadores I",
    "walking-1": "Walking I",
    "melodia-1": "Melodía I",
    "lectura-1": "Lectura I",
    "lectura-2": "Lectura II",
    "lectura-3": "Lectura III",
  };

  return courseMap[lastSegment] || "Armonia I"; // Default to "Armonia I" if not found
}

function showQuestion() {
  let currentQuestion = questions[currentQuestionIndex];

  // Apply fade-in animation
  questionText.style.animation = "none";
  void questionText.offsetWidth;
  questionText.style.animation = "fadeIn 0.5s ease-in-out";

  // Update the question text
  questionText.innerText = currentQuestion.question;

  // Update the question number
  progressText.innerText = currentQuestionIndex + 1;
  totalQuestionsText.innerText = questions.length;

  // Clear previous answer buttons
  answerButtons.innerHTML = "";

  // Generate new answer buttons with animation
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("answer-btn");
    button.addEventListener("click", () => selectAnswer(answer));
    answerButtons.appendChild(button);
  });

  // Reset Next button
  nextButton.innerText = "Siguiente";
  nextButton.style.visibility = "hidden";
  nextButton.style.opacity = "0";
  nextButton.removeEventListener("click", handleNextQuestion);
  nextButton.addEventListener("click", handleNextQuestion);
}

function selectAnswer(answer) {
  // Disable all buttons after selection
  document.querySelectorAll(".answer-btn").forEach((button) => {
    button.classList.add("disabled");
    button.style.pointerEvents = "none";
  });

  // Ensure the correct answer gets updated visually
  document.querySelectorAll(".answer-btn").forEach((button) => {
    if (button.innerText === answer.text) {
      button.classList.add(answer.correct ? "correct" : "wrong");
    }
  });

  // ✅ Fix: Ensure the score increments and updates the UI
  if (answer.correct) {
    score++; // ✅ Increase the score
    scoreText.innerText = score; // ✅ Update the UI
  }

  // Show the Next button
  nextButton.style.visibility = "visible";
  nextButton.style.opacity = "1";

  // Handle Next or Restart
  nextButton.removeEventListener("click", handleNextQuestion);
  nextButton.removeEventListener("click", startQuiz);

  if (currentQuestionIndex === questions.length - 1) {
    nextButton.innerText = "Reiniciar Quiz"; // ✅ Ensure this is set IMMEDIATELY
    nextButton.style.backgroundColor = "#FFD166";
    nextButton.style.color = "#0D1B2A";
    nextButton.style.boxShadow = "2px 4px 8px rgba(255, 209, 102, 0.2)";
    nextButton.addEventListener("click", startQuiz);
  } else {
    nextButton.innerText = "Siguiente";
    nextButton.style.backgroundColor = "#FF6F61";
    nextButton.style.color = "white";
    nextButton.style.boxShadow = "2px 4px 8px rgba(255, 111, 97, 0.2)";
    nextButton.addEventListener("click", handleNextQuestion);
  }
}

function handleNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
    nextButton.style.visibility = "hidden";
    nextButton.style.opacity = "0";
  }
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById("score").innerText = score;
  document.getElementById("total-questions").innerText = questions.length;

  // 🚀 Remove next button from the DOM before resetting
  if (nextButton.parentNode) {
    nextButton.parentNode.removeChild(nextButton);
  }

  // ✅ Reset UI without the button interfering
  if (questions.length > 0) {
    setTimeout(() => {
      showQuestion();

      // 🚀 Re-add button after UI is fully set
      answerButtons.after(nextButton);
      nextButton.style.visibility = "hidden";
      nextButton.style.opacity = "0";
    }, 50); // Small delay prevents flickering
  } else {
    document.getElementById("question-text").innerText =
      "No questions available.";
  }
}

// Initialize the quiz
startQuiz();

loadQuestions(getCourseFromPath());
