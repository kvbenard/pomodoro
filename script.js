const timerContainer = document.querySelector('.timer');
const settingsContainer = document.querySelector('.settings');

const startButton = document.querySelector('.start');
const settingsOk = document.querySelector('.validate_settings');

const plusButtons = document.querySelectorAll(".plus");
const minusButtons = document.querySelectorAll(".minus");

const workDurationElem = document.querySelector('#work_duration');
const shortBreakDurationElem = document.querySelector('#short_break_duration');
const longBreakDurationElem = document.querySelector('#long_break_duration');
const longBreakAfterElem = document.querySelector('#long_break_after');

let workDuration = 0;
let shortBreakDuration = 0;
let longBreakDuration = 0;
let longBreakAfter = 0;

let intervalBeforePause = 0;

let currentState = "stopped";

const digitElem = document.querySelector('.digit');

const currentStateDiv = document.querySelector("#current_state");

let currentTime = 0;

// convert a string into 2 digits 
const twoDigits = (num) => {
    if (num.toString().length === 1) {
        num = "0" + num;
    }
    return num;
}

// Set an element text
const changeText = (div, newText) => {
    div.replaceChild(document.createTextNode(newText), div.firstChild);
}

// Update the current time displayed
const updateTime = (time) => {
    currentTime = time;
    let minutes = Math.floor(currentTime / 60);
    let seconds = currentTime % 60;

    changeText(digitElem, twoDigits(minutes) + ":" + twoDigits(seconds));
}

// Set the current timer's state
const setCurrentState = (newState) => {

    switch (newState) {
        case "work":
            currentState = "work";
            changeText(currentStateDiv, `Time to work !`);
            updateTime(workDuration * 60);
            startButton.disabled = false;
            break;
        case "shortBreak":
            currentState = "shortBreak";
            changeText(currentStateDiv, "Take a short break !")
            updateTime(shortBreakDuration * 60);
            startButton.disabled = false;
            break;
        case "longBreak":
            currentState = "longBreak";
            intervalBeforePause = longBreakAfter;
            changeText(currentStateDiv, "Take a Long Break !")
            updateTime(longBreakDuration * 60);
            startButton.disabled = false;
            break;
        case "ready":
            currentState = "ready";
            changeText(currentStateDiv, `Ready to start !`);
            updateTime(workDuration * 60);
            startButton.disabled = false;
            break;
        default:
            break;
    }
}

// Update continuously the timer
const runTimer = () => {

    updateTime(currentTime - 1);

    if (currentTime >= 0) {
        time();
    } else {
        if (currentState === "work") {
            intervalBeforePause--;
            // Set a short break
            if (intervalBeforePause > 0) {
                setCurrentState("shortBreak");
            } else {
                setCurrentState("longBreak");
            }
        } else if (currentState === "shortBreak" || currentState === "longBreak") {
            setCurrentState("work");
        }
    }
}

// set a timeout
const time = () => {
    t = setTimeout(runTimer, 1000);
}

// Validate the settings and prepare the timer
settingsOk.addEventListener("click", () => {
    workDuration = parseInt(workDurationElem.textContent);
    shortBreakDuration = parseInt(shortBreakDurationElem.textContent);
    longBreakDuration = parseInt(longBreakDurationElem.textContent);
    longBreakAfter = parseInt(longBreakAfterElem.textContent);

    currentTime = workDuration * 60;
    intervalBeforePause = longBreakAfter;

    settingsContainer.classList.add("hidden");
    timerContainer.classList.remove("hidden");

    updateTime();
    setCurrentState("work");
});

// Run the timer
startButton.addEventListener("click", () => {
    runTimer();
});

for (plusButton of plusButtons) {
    plusButton.addEventListener('click', (event) => {
        let correspondingValueElem = event.target.parentNode.querySelector(".value");
        let currentValue = parseInt(correspondingValueElem.textContent);
        if (currentValue < 60) {
            currentValue++;
            changeText(correspondingValueElem, twoDigits(currentValue));
        }
    })
}

for (minusButton of minusButtons) {
    minusButton.addEventListener('click', (event) => {
        let correspondingValueElem = event.target.parentNode.querySelector(".value");
        let currentValue = parseInt(correspondingValueElem.textContent);
        if (currentValue > 1) {
            currentValue--;
            changeText(correspondingValueElem, twoDigits(currentValue));
        }
    })
}