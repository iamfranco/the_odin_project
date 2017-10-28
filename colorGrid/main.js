$(document).ready(function() {
  setContainerSize();
  populate();
});

var gridCount = 16;
var totalLength;
var length;

// set container size
function setContainerSize() {
  totalLength = Math.floor(Math.min(innerHeight, innerWidth)*0.8);
  length = totalLength/gridCount;
  $('.container').css({
    'height': totalLength + 'px',
    'width': totalLength + 'px'
  });
}

// populate container with grids
function populate() {
  var grid = '<div class="grid" data-opacity="0"></div>';
  var x = 0;
  var y = 0;
  for (var i=0; i<gridCount; i++) {
    for (var j=0; j<gridCount; j++) {
      $('.container').append($(grid).css({
        'width': length + 'px',
        'height': length + 'px',
        'left': x + 'px',
        'top': y + 'px'
      }));
      x += length;
    }
    x = 0;
    y += length;
  }
  $('.grid').on('mouseenter', updateColor);
}

// increase grid opacity by 10% (per mouseenter)
function updateColor() {
  var opacity = $(this).data('opacity')+0.1;
  $(this).css('opacity', opacity);
  $(this).data('opacity', opacity);
}

function btnClick() {
  var response = prompt('Enter # grids per side');
  if (response !== null) {
    gridCount = +response;
    if (gridCount>0 && gridCount<=128){
      $('.grid').remove();
      setContainerSize();
      populate();
    } else {
      alert('Please choose between 1 and 128')
    }
  }
}
