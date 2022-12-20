var randomNumber1 =Math.floor(Math.random()*6 )+1;
var diceno = "dice"+ randomNumber1+".png";

var ele1= document.querySelector(".img1");
ele1.setAttribute("src","images/"+diceno);

var randomNumber2 =Math.floor(Math.random()*6 )+1;
var diceno2 = "dice"+ randomNumber2+".png";

var ele2= document.querySelector(".img2");
ele2.setAttribute("src","images/"+diceno2);

var heading= document.querySelector("h1");

if(randomNumber1==randomNumber2)
{
  heading.innerHTML="Its a Draw!!";
}
else if (randomNumber1 > randomNumber2)
{
  heading.innerHTML="🚩 Player 1 Wins!";
}
else
{
  heading.innerHTML="Player 2 Wins! 🚩";
}
