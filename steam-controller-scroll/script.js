var touchpad = document.getElementById('touchpad');
var sensitivityRange = document.getElementById('sensitivity');
var sensitivity = parseInt(sensitivityRange.value,10);
var delayRange = document.getElementById('delay');
var delay = parseInt(delayRange.value,10);
var scroller = document.getElementById('scroller');
function eventQueue(callback) {
  var callbacksInQueue = 0;
  var drainId = null;
  function fire() {
    callback();
    drainId = setTimeout(drain,delay);
  }
  function drain() {
    callbacksInQueue--;
    if (callbacksInQueue) {
      fire();
    } else {
      drainId = null;
    }
  }
  return {
    trigger: function() {
      callbacksInQueue++;
      if (!drainId) fire();
    }
  };
}

var cwq = eventQueue(function scrollDown() {
  scroller.scrollBy(0,100);
  //scroller.scrollBy({behavior: 'smooth', top:100});
});
var ccwq = eventQueue(function scrollUp() {
  scroller.scrollBy(0,-100);
  //scroller.scrollBy({behavior: 'smooth', top:-100});
});

delayRange.addEventListener('input',function(evt) {
  delay = parseInt(delayRange.value, 10);
});
sensitivityRange.addEventListener('input',function(evt) {
  sensitivity = parseInt(sensitivityRange.value, 10);
});

var mouseIsDown = false;
var lastActuatedAngle;

function getTouchAngle(evt) {
  var padRect = touchpad.getBoundingClientRect();
  return Math.atan2(
    (padRect.top + padRect.height / 2) - evt.clientY,
    evt.clientX - (padRect.left + padRect.width / 2)) * 180 / Math.PI;
}

function normalAngle(a) {
  return a + ((a > 180) ? -360 : (a < -180) ? 360 : 0);
}

touchpad.addEventListener('mousedown', function(evt) {
  mouseIsDown = true;
  lastActuatedAngle = getTouchAngle(evt);
});
touchpad.addEventListener('mouseup', function(evt) {
  mouseIsDown = false;
});
touchpad.addEventListener('mousemove', function(evt) {
  if (mouseIsDown) {
    var downAngle = getTouchAngle(evt);
    var actuationDelta = normalAngle(downAngle - lastActuatedAngle);
    while (Math.abs(actuationDelta) > sensitivity) {
      (actuationDelta > 0 ? ccwq : cwq).trigger();
      lastActuatedAngle = normalAngle(lastActuatedAngle +
        (actuationDelta > 0 ? sensitivity : -sensitivity));
      actuationDelta = normalAngle(downAngle - lastActuatedAngle);
    }
  }
});
