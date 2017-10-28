function $(x) {return document.querySelector(x)}
var displaySum = $('.displaySum');
var inputFactors = $('.inputFactors');
var inputMin = $('.inputMin');
var inputMax = $('.inputMax');
var factorsShow = $("#factorsShow");
var minShow = $("#minShow");
var maxShow = $("#maxShow");

inputFactors.addEventListener('keyup', function(){
  getFactors();
  printSum();
})

inputMin.addEventListener('keyup', function() {
  getMin();
  printSum();
})

inputMax.addEventListener('keyup', function() {
  getMax();
  printSum();
})

function getFactors() {
  var arr = inputFactors.value.split(',');
  for (var i=0; i<arr.length; i++) {
    arr[i] = parseInt(arr[i]);
  }
  factors = arr;
}

function getMin() {minNumber = parseInt(inputMin.value)}
function getMax() {maxNumber = parseInt(inputMax.value)}

var factors; getFactors();
var minNumber; getMin();
var maxNumber; getMax();

function isMultiple(n) {
  for (var i=0; i<factors.length; i++) {
    if (n%factors[i]===0) return true;
  }
  return false;
}

function printSum() {
  factorsShow.innerHTML = inputFactors.value;
  minShow.innerHTML = minNumber;
  maxShow.innerHTML = maxNumber;
  var sum = 0;
  for (var n=minNumber; n<=maxNumber; n++) {
    if (isMultiple(n)) {
      sum += n;
    }
  }
  displaySum.innerHTML = sum;
}

printSum();
