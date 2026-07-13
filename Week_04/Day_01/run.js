const display = document.getElementById("display");

const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

let minutes = 0;
let seconds = 0;
let milliseconds = 0;

let timer = null;
let isRunning = false;

function updateDisplay() {
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    const ms = String(milliseconds).padStart(2, "0");

    display.textContent = `${mm}:${ss}:${ms}`;
}

function startTimer() {
    if (isRunning) return;

    isRunning = true;

    timer = setInterval(() => {
        milliseconds++;

        if (milliseconds === 100) {
            milliseconds = 0;
            seconds++;
        }

        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }

        updateDisplay();
    }, 10);
}

function stopTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;

    minutes = 0;
    seconds = 0;
    milliseconds = 0;

    updateDisplay();
}

startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);