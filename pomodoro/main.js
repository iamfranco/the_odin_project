// default values (unit: minute)
var workTime = 25;
var breakTime = 5;
var timeChange = 5;
var maxTime = 99;

// rescale default values (minute to seconds)
workTime *= 60;
breakTime *= 60;
timeChange *= 60;
maxTime *= 60;

//////////////// model //////////////////
var seconds = workTime;
var pausing = false;
var workSession = true;


//////////////// view ///////////////////
var menu = $('.menu');
var menuBtn = $('.menuBtn');
var workIncBtn = $('.workIncBtn');
var workDecBtn = $('.workDecBtn');
var breakIncBtn = $('.breakIncBtn');
var breakDecBtn = $('.breakDecBtn');
var pauseBtn = $('.pauseBtn');

var container = $('.container');
var timeView = $('.timeView');
var workTimeView = $('.workTimeView');
var breakTimeView = $('.breakTimeView');
var currentSessionBtn = $('.currentSessionBtn');
var sessionBtn__words = $('.sessionWords');
function displayTime() {timeView.innerHTML = timeString()}
function displayWorkTime() {workTimeView.innerHTML = sessionTimeString(workTime)}
function displayBreakTime() {breakTimeView.innerHTML = sessionTimeString(breakTime)}

// onclick listener for btn
var btnActionArray = [
  [menuBtn, toggleMenu],
  [workIncBtn, workInc],
  [workDecBtn, workDec],
  [breakIncBtn, breakInc],
  [breakDecBtn, breakDec],
  ['.currentSessionBtn', toggleSession],
  [pauseBtn, togglePause],
  ['.restartBtn', restartTimer],
];
for (var i=0; i<btnActionArray.length; i++) {
  var btn = btnActionArray[i][0];
  if (typeof btn === 'string') $(btnActionArray[i][0]).addEventListener('mousedown', btnActionArray[i][1]);
  else btn.addEventListener('mousedown', btnActionArray[i][1]);
}

// special listener for session-toggler
sessionBtn__words.addEventListener('mouseenter', function() {
  sessionBtn__words.classList.toggle('breaking');
})
sessionBtn__words.addEventListener('mouseleave', function() {
  updateSessionName();
})

// update button active/inactive view
function updateAllBtn() {
  updateBtn(workIncBtn, workTime == maxTime);
  updateBtn(workDecBtn, workTime == 0);
  updateBtn(breakIncBtn, breakTime == maxTime);
  updateBtn(breakDecBtn, breakTime == 0);

  function updateBtn(btn, condition) {
    if (condition) btn.classList.add('inactive');
    else btn.classList.remove('inactive');
  }
}

////////////// controller (user input) ///////////////
function toggleMenu() {
  menuBtn.classList.toggle('active');
  menu.classList.toggle('active');
  container.classList.toggle('inactive');
}
function workInc() {
  if (workTime + timeChange <= maxTime) {
    workTime += timeChange;
    displayWorkTime();
  }
  updateAllBtn();
}
function workDec() {
  if (workTime >= timeChange) {
    workTime -= timeChange;
    displayWorkTime();
  }
  updateAllBtn();
}
function breakInc() {
  if (breakTime + timeChange <= maxTime) {
    breakTime += timeChange;
    displayBreakTime();
  }
  updateAllBtn();
}
function breakDec() {
  if (breakTime >= timeChange){
    breakTime -= timeChange;
    displayBreakTime();
  }
  updateAllBtn();
}
function togglePause() {
  pausing = !pausing;
  pauseBtn.classList.toggle('pausing');
  timeView.classList.toggle('pausing');
}
function restartTimer() {
  if (workSession) seconds = workTime;
  else seconds = breakTime;
  displayTime();
}

/////////////// auto processes ////////////////

// initial execution
displayTime();
displayWorkTime();
displayBreakTime();

// periodic execution
window.setInterval(tick, 1000);
function tick() {
  if (seconds == 0) toggleSession();
  else if (!pausing) seconds -= 1;
  displayTime();
}

function toggleSession() {
  workSession = !workSession;
  seconds = workSession ? workTime : breakTime;
  // session style
  document.title = workSession ? 'Pomodoro - Work' : 'Pomodoro - Break'
  $('body').classList.toggle('breaking');
  updateSessionName();
  displayTime();
}

function updateSessionName() {
  if (workSession) sessionBtn__words.classList.remove('breaking');
  else sessionBtn__words.classList.add('breaking');
}

//////////////// helper functions ////////////////////
function $(x) {return document.querySelector(x)}

// seconds (from model) -> "HH:MM:SS"
function timeString() {
  var s = seconds;
  var m = Math.floor(s/60);
  s %= 60;
  return timeFormat([m,s])
  function twoDigit(n) {
    if (n < 10) return "0"+n;
    return n;
  }
  function timeFormat(arr) {return arr.map(twoDigit).join(":")}
}

function sessionTimeString(s) {return Math.floor(s/60)}
