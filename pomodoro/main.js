// default values (unit: minute)
var workTime = 25;
var breakTime = 5;
var workTimeChange = 5;
var breakTimeChange = 1;
var maxTime = 99;

// rescale default values (minute to milliseconds)
workTime *= 60*1000;
breakTime *= 60*1000;
workTimeChange *= 60*1000;
breakTimeChange *= 60*1000;
maxTime *= 60*1000;

//////////////// model //////////////////
var duration = workTime;
var seconds = workTime;
var pausing = false;
var restarted = false;
var pausedTime;
var workSession = true;
var startTime = Date.now();


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
var timeBar = $('.timeBar');
var workTimeView = $('.workTimeView');
var breakTimeView = $('.breakTimeView');
var currentSessionBtn = $('.currentSessionBtn');
var sessionBtn__words = $('.sessionWords');

function displayTime() {timeView.innerHTML = timeString(); updateTimeBar()}
function updateTimeBar() {timeBar.style.width = (seconds/duration*100).toFixed(2) + '%';}
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
  if (workTime + workTimeChange <= maxTime) {
    workTime += workTimeChange;
    displayWorkTime();
  }
  updateAllBtn();
}
function workDec() {
  if (workTime >= workTimeChange) {
    workTime -= workTimeChange;
    displayWorkTime();
  }
  updateAllBtn();
}
function breakInc() {
  if (breakTime + breakTimeChange <= maxTime) {
    breakTime += breakTimeChange;
    displayBreakTime();
  }
  updateAllBtn();
}
function breakDec() {
  if (breakTime >= breakTimeChange){
    breakTime -= breakTimeChange;
    displayBreakTime();
  }
  updateAllBtn();
}
function togglePause() {
  pausing = !pausing;
  pauseBtn.classList.toggle('pausing');
  timeView.classList.toggle('pausing');
  if (!pausing & !restarted) {
    startTime += Date.now() - pausedTime;
  }
  if (!pausing & restarted) {
    startTime = Date.now();
    restarted = false;
  }
  if (pausing) {
    pausedTime = Date.now();
  }

}
function restartTimer() {
  startTime = Date.now();
  if (pausing) restarted = true;
  duration = workSession? workTime : breakTime;
  seconds = duration;
  displayTime();
}

/////////////// auto processes ////////////////

// initial execution
displayTime();
displayWorkTime();
displayBreakTime();

// periodic execution
window.setInterval(tick, 111);
function tick() {
  if (seconds <= 0) toggleSession();
  else if (!pausing) {
    var timeDiff = Date.now() - startTime;
    seconds = duration - timeDiff;
  }
  displayTime();
}

function toggleSession() {
  startTime = Date.now();
  workSession = !workSession;
  duration = workSession ? workTime : breakTime;
  seconds = duration;
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
  var s = Math.ceil(seconds/1000);
  var m = Math.floor(s/60);
  s %= 60;
  return timeFormat([m,s])
  function twoDigit(n) {
    if (n < 10) return "0"+n;
    return n;
  }
  function timeFormat(arr) {return arr.map(twoDigit).join(":")}
}

function sessionTimeString(s) {return Math.floor(s/60/1000)}
