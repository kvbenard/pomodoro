const timer = document.querySelector('#timer');
const startButton = document.querySelector('#startButton');
const settingsOk = document.querySelector('#settings_ok');

let workDuration = 0;
let shortBreakDuration = 0;
let longBreakDuration = 0;
let longBreakAfter = 0;

let intervalBeforePause = 0;

let currentState = "stopped";

const minutesSpan = document.querySelector('#minutes');
const secondsSpan = document.querySelector('#seconds');

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

// Set the current timer's state
const setCurrentState = (newState) => {
    switch (newState) {
        case "work":
            currentState = "work";
            changeText(currentStateDiv, `Time to work ! ${intervalBeforePause} intervals before a long break !`);
            currentTime = workDuration * 60;
            startButton.disabled = false;
            break;
        case "shortBreak":
            currentState = "shortBreak";
            changeText(currentStateDiv, "Take a short break !")
            currentTime = shortBreakDuration * 60;
            startButton.disabled = false;
            break;
        case "longBreak":
            currentState = "longBreak";
            changeText(currentStateDiv, "Take a Long Break !")
            currentTime = longBreakDuration * 60;
            startButton.disabled = false;
            break;
        case "ready":
            currentState = "ready";
            changeText(currentStateDiv, `Ready to start !`);
            currentTime = workDuration * 60;
            startButton.disabled = false;
            break;
        default:
            break;
    }
}

// Update the current time displayed
const updateTime = () => {
    let minutes = Math.floor(currentTime / 60);
    let seconds = currentTime % 60;

    changeText(minutesSpan, twoDigits(minutes) + ":" + twoDigits(seconds));
}

// Update continuously the timer
const runTimer = () => {

    updateTime();

    currentTime--;
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
    workDuration = document.querySelector('#work_duration').value;
    shortBreakDuration = document.querySelector('#short_break_duration').value;
    longBreakDuration = document.querySelector('#long_break_duration').value;
    longBreakAfter = document.querySelector('#long_break_after').value;

    currentTime = Number(workDuration) * 60;
    intervalBeforePause = longBreakAfter;

    updateTime();
    setCurrentState("ready");
});

// Run the timer
startButton.addEventListener("click", () => {
    setCurrentState("work");
    runTimer();
});