// List of words for the game
let currentIndex = 0;
let timeRemaining = 60;
let timerInterval;
let score = 0;

// Arrays to store words based on user actions
const correctWords = [];
const passedWords = [];

// Initialize audio elements with a fallback in case they aren’t available yet
const sound1 = document.getElementById('sound1'); // Correct sound
const sound2 = document.getElementById('sound2'); // Pass sound
const sound3 = document.getElementById('sound3'); // Timer sound
const sound4 = document.getElementById('sound4'); // Game finished sound

// Function to play a sound without interruption
function playSound(sound) {
    const soundClone = sound.cloneNode(); // Clone the audio element
    soundClone.play();
}

function adjustFontSize() {
    const wordElement = document.querySelector('.word');
    const fontSize = Math.min(window.innerWidth, window.innerHeight) * 0.08;
    wordElement.style.fontSize = `${fontSize}px`;
}

function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        // Show a warning message to rotate the device
        document.getElementById("rotate-notice").style.display = "flex"; // Show the notice
    } else {
        document.getElementById("rotate-notice").style.display = "none"; // Hide the notice
    }
}

// Start the game and initialize the game page
function startGame() {
    // Show game page and hide end page
    document.querySelector(".container").style.display = "flex";
    document.getElementById("endPage").style.display = "none";

    // Reset variables
    timeRemaining = 60;
    score = 0;
    currentIndex = 0;

    // Clear previous words
    correctWords.length = 0;
    passedWords.length = 0;

    // Display the first word and reset the timer display
    document.getElementById("wordText").innerText = words[currentIndex];
    document.getElementById("timer").innerText = "1:00";

    // Start the countdown timer
    timerInterval = setInterval(updateTimer, 1000);

    // Adjust font size for the first word
    adjustFontSize();
}

// Function to change to the next word
function nextWord(action) {
    if (action === 'correct') {
        score++;
        correctWords.push(words[currentIndex]);
        playSound(sound1);
    } else if (action === 'pass') {
        passedWords.push(words[currentIndex]);
        playSound(sound2);
    }

    currentIndex = (currentIndex + 1) % words.length;

    if (currentIndex === 0) {
        endGame();
    } else {
        document.getElementById("wordText").innerText = words[currentIndex];
    }
}

// Function to update the timer every second
function updateTimer() {
    timeRemaining--;
    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining % 60;
    document.getElementById("timer").innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (timeRemaining <= 10 && timeRemaining > 0) {
        sound3.play();
    }

    if (timeRemaining === 0) {
        endGame(); // Call endGame directly; sound4 will be played there
    }
}

// Function to end the game and show the end page with the score
function endGame() {
    clearInterval(timerInterval);
    playSound(sound4);
    document.querySelector(".container").style.display = "none";
    document.getElementById("endPage").style.display = "flex";

    document.getElementById("finalScore").innerText = `Score: ${score}`;
    displayResults();
}

// Function to display the results on the end page
function displayResults() {
    const correctList = document.getElementById("correctWords");
    const passedList = document.getElementById("passedWords");

    correctList.innerHTML = '';
    passedList.innerHTML = '';

    correctWords.forEach(word => {
        const li = document.createElement("li");
        li.innerText = word;
        li.style.color = "green";
        correctList.appendChild(li);
    });

    passedWords.forEach(word => {
        const li = document.createElement("li");
        li.innerText = word;
        li.style.color = "red";
        passedList.appendChild(li);
    });
}

// Function to restart the game
function restartGame() {
    startGame();
}

// Consolidated window load events
window.onload = function() {
    startGame();
    adjustFontSize();
    checkOrientation();
};

window.onresize = function() {
    adjustFontSize();
    checkOrientation();
};