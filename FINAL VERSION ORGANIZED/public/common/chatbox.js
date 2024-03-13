

function chatBox() {
  var chatbox = document.getElementById("chatbox");
  if (chatbox.style.display === "block") {
    chatbox.style.display = "none";
  } else {
    chatbox.style.display = "block";
  }
}

function changeTab(old_div_id,new_div_id){
  div1 = document.getElementById(old_div_id);
  div2 = document.getElementById(new_div_id);
  div1.style.display = "none";
  div2.style.display = "block";
}

function textLong(text, length) {
  if (text == null) {
      return "";
  }
  if (text.length <= length) {
      return text;
  }
  text = text.substring(0, length);
  last = text.lastIndexOf(" ");
  text = text.substring(0, last);
  return text + "...";

}

function playMusic(){
  let myAudio = document.querySelector('#audio');
myAudio.play();
}
