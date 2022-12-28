// detecting button press
var noOfButtons = document.querySelectorAll(".drum").length;
var x = document.querySelectorAll(".drum");
for (var i = 0; i < noOfButtons; i++) {

  x[i].addEventListener("click", function() {
    var but = this.innerHTML;
    makeSound(but);
    animation(but);

  });
}

// detecting key press
document.addEventListener("keydown", function(event) {
  makeSound(event.key);
  animation(event.key);
});

function makeSound(ch) {
  switch (ch) {
    case 'w':
      var tom1 = new Audio("sounds/tom-1.mp3");
      tom1.play();
      break;

    case 'a':
      var tom2 = new Audio("sounds/tom-2.mp3");
      tom2.play();
      break;

    case 's':
      var tom3 = new Audio("sounds/tom-3.mp3");
      tom3.play();
      break;

    case 'd':
      var tom4 = new Audio("sounds/tom-4.mp3");
      tom4.play();
      break;

    case 'j':
      var snare = new Audio("sounds/snare.mp3");
      snare.play();
      break;

    case 'k':
      var crash = new Audio("sounds/crash.mp3");
      crash.play();
      break;

    case 'l':
      var kick = new Audio("sounds/kick-bass.mp3");
      kick.play();
      break;

    default:
      console.log("hein ??");
      break;

  }
}
function animation(key)
{
  var activebutton= document.querySelector("."+key);
  activebutton.classList.add("pressed");

  setTimeout(function(){
activebutton.classList.remove("pressed");},100);
}
