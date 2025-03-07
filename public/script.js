// Select key elements from the HTML
const questionText = document.getElementById("question-text")
const answerButtons = document.getElementById("answer-buttons")
const nextButton = document.getElementById("next-button")
const progressText = document.getElementById("current-question")
const totalQuestionsText = document.getElementById("total-questions")
const scoreText = document.getElementById("score")
const scoreContainer = document.getElementById("score-container")
const finalScoreText = document.getElementById("final-score")
const totalQuestionsFinalText = document.getElementById("total-questions-final")
const restartButton = document.getElementById("restart-button")
const progressBar = document.querySelector(".progress-bar")
const resultMessage = document.getElementById("result-message")

// Question bank
let questions = []
let currentQuestionIndex = 0
let score = 0

// Function to load questions dynamically based on the selected course
async function loadQuestions(course) {
  try {
    const response = await fetch("questions.json")
    const data = await response.json()

    console.log("Fetched data:", data)
    console.log("Looking for course:", course)

    if (data[course] && data[course].length > 0) {
      questions = data[course]
      document.getElementById("course-title").innerText = course
      console.log("Loaded questions:", questions)
      startQuiz()
    } else {
      console.error("Course not found or no questions available:", course)
      questions = []
      document.getElementById("question-text").innerText = "No questions available."
      document.getElementById("answer-buttons").innerHTML = ""
      document.getElementById("next-button").style.visibility = "hidden"
    }
  } catch (error) {
    console.error("Error loading questions:", error)
  }
}

function getQueryParams() {
  const params = new URLSearchParams(window.location.search)
  const queryParams = {}

  for (const [key, value] of params.entries()) {
    queryParams[key] = value
  }

  return queryParams
}

function getCourseFromPath() {
  const lastSegment = getQueryParams()["course"]

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
  }

  return courseMap[lastSegment] || "Armonia I" // Default to "Armonia I" if not found
}

function updateProgressBar() {
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  progressBar.style.width = `${progress}%`
}

function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex]

  // Apply fade-in animation
  questionText.style.animation = "none"
  void questionText.offsetWidth
  questionText.style.animation = "fadeIn 0.5s ease-in-out"

  // Update the question text
  questionText.innerText = currentQuestion.question

  // Update the question number and progress bar
  progressText.innerText = currentQuestionIndex + 1
  totalQuestionsText.innerText = questions.length
  updateProgressBar()

  // Clear previous answer buttons
  answerButtons.innerHTML = ""

  // Generate new answer buttons with animation
  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement("button")
    button.innerText = answer.text
    button.classList.add("answer-btn")
    button.style.animationDelay = `${index * 0.1}s`
    button.addEventListener("click", () => selectAnswer(answer))
    answerButtons.appendChild(button)
  })

  // Reset Next button
  nextButton.innerText = "Siguiente"
  nextButton.style.visibility = "hidden"
  nextButton.style.opacity = "0"
  nextButton.classList.remove("show")
  nextButton.removeEventListener("click", handleNextQuestion)
  nextButton.addEventListener("click", handleNextQuestion)
}

function selectAnswer(answer) {
  // Disable all buttons after selection
  document.querySelectorAll(".answer-btn").forEach((button) => {
    button.classList.add("disabled")
    button.style.pointerEvents = "none"
  })

  // Ensure the correct answer gets updated visually
  document.querySelectorAll(".answer-btn").forEach((button) => {
    if (button.innerText === answer.text) {
      button.classList.add(answer.correct ? "correct" : "wrong")
    }
  })

  // Increase the score and update the UI if correct
  if (answer.correct) {
    score++
    scoreText.innerText = score

    // Add a small animation to the score
    scoreText.classList.add("animate-pulse")
    setTimeout(() => {
      scoreText.classList.remove("animate-pulse")
    }, 1000)
  }

  // Show the Next button
  nextButton.style.visibility = "visible"
  nextButton.classList.add("show")
  nextButton.style.opacity = "1"

  // Handle Next or Restart
  nextButton.removeEventListener("click", handleNextQuestion)
  nextButton.removeEventListener("click", showResults)

  if (currentQuestionIndex === questions.length - 1) {
    nextButton.innerText = "Ver Resultados"
    nextButton.style.backgroundColor = "hsl(var(--accent))"
    nextButton.style.color = "hsl(var(--accent-foreground))"
    nextButton.addEventListener("click", showResults)
  } else {
    nextButton.innerText = "Siguiente"
    nextButton.style.backgroundColor = "hsl(var(--secondary))"
    nextButton.style.color = "hsl(var(--secondary-foreground))"
    nextButton.addEventListener("click", handleNextQuestion)
  }
}

function handleNextQuestion() {
  currentQuestionIndex++
  if (currentQuestionIndex < questions.length) {
    showQuestion()
    nextButton.style.visibility = "hidden"
    nextButton.style.opacity = "0"
    nextButton.classList.remove("show")
  }
}

function showResults() {
  document.getElementById("question-container").style.display = "none"
  nextButton.style.display = "none"
  scoreContainer.style.display = "block"

  finalScoreText.innerText = score
  totalQuestionsFinalText.innerText = questions.length

  // Calculate percentage and show appropriate message
  const percentage = (score / questions.length) * 100
  let message = ""

  if (percentage >= 90) {
    message = "¡Excelente! Has dominado este tema."
    createConfetti()
  } else if (percentage >= 70) {
    message = "¡Muy bien! Tienes un buen conocimiento del tema."
  } else if (percentage >= 50) {
    message = "Bien. Sigue practicando para mejorar."
  } else {
    message = "Necesitas repasar este tema. ¡No te rindas!"
  }

  resultMessage.innerText = message
}

function createConfetti() {
  const confettiContainer = document.getElementById("confetti-container")
  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div")
    confetti.classList.add("confetti")
    confetti.style.left = `${Math.random() * 100}%`
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.width = `${Math.random() * 10 + 5}px`
    confetti.style.height = `${Math.random() * 10 + 5}px`
    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`
    confetti.style.animationDelay = `${Math.random() * 2}s`

    // Random shapes
    const shapeType = Math.floor(Math.random() * 3)
    if (shapeType === 0) {
      confetti.style.borderRadius = "50%" // Circle
    } else if (shapeType === 1) {
      confetti.style.borderRadius = "0" // Square
    } else {
      confetti.style.width = "0"
      confetti.style.height = "0"
      confetti.style.borderLeft = `${Math.random() * 5 + 5}px solid transparent`
      confetti.style.borderRight = `${Math.random() * 5 + 5}px solid transparent`
      confetti.style.borderBottom = `${Math.random() * 10 + 10}px solid ${colors[Math.floor(Math.random() * colors.length)]}`
      confetti.style.backgroundColor = "transparent"
    }

    confettiContainer.appendChild(confetti)
  }

  // Remove confetti after animation completes
  setTimeout(() => {
    confettiContainer.innerHTML = ""
  }, 5000)
}

function startQuiz() {
  currentQuestionIndex = 0
  score = 0
  document.getElementById("score").innerText = score
  document.getElementById("total-questions").innerText = questions.length

  // Reset UI
  document.getElementById("question-container").style.display = "block"
  nextButton.style.display = "block"
  scoreContainer.style.display = "none"

  if (questions.length > 0) {
    showQuestion()
    nextButton.style.visibility = "hidden"
    nextButton.style.opacity = "0"
    nextButton.classList.remove("show")
  } else {
    document.getElementById("question-text").innerText = "No questions available."
  }
}

// Initialize the quiz
document.addEventListener("DOMContentLoaded", () => {
  loadQuestions(getCourseFromPath())

  // Add event listener for restart button
  restartButton.addEventListener("click", startQuiz)
})

