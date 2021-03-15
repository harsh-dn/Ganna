var albumName = ["Crazy Born - Leave", "Chase Forever", "King of the Ring", "Maddy"];
var albumArt = ["Beats-craze.jpeg", "Dream-chazers.jpeg", "King-com.jpeg", "Mad-real.jpeg"];
var title = ["Beats-craze", "Dream-chazers", "King-com", "Mad-real"];
var durationList = ["2:38", "2:54", "3:36", "2:49"];
var sequence = [];
var favList = [];

var favBtn = $(".unfav i");
var pauseAndPlay = $(".play i");
var nextBtn = $(".next i");
var prevBtn = $(".back i");
var repeatBtn = $(".repeat i");
var shuffleBtn = $(".shuffle i");
var scrollBar = $("#scroll input");
var noOfSongs = title.length;

//initializing sequence
for(var i=0; i<noOfSongs; i++){
  sequence.push(i);
}

//initializing favList
for(var i=0; i<noOfSongs; i++) {
  favList.push(0);
}

var song = new Audio();
var currentSong = 0;
var cTime = 0;
var repeat = false;

//playSong function with total time update
window.onload = playSong;
function playSong(){
  console.log("window is updated");
  song.src = "songs/" + title[sequence[currentSong]] + ".mp3";
  $(".albumArt img").attr("src", "images/"+albumArt[sequence[currentSong]]);
  $(".albumName").text(albumName[sequence[currentSong]]);
  $(".title").text(title[sequence[currentSong]]);

  if(favList[sequence[currentSong]]){
    favBtn.attr("class", "fas fa-heart");
  } else {
    favBtn.attr("class", "far fa-heart");
  }

  let temp = setInterval(function() {
    if(song.readyState>0){
      $(".totalTime").text(durationList[sequence[currentSong]]);
      song.play();
        updateQueue();
        clearInterval(temp);
    }
  },10);
}

//currentTime update function
var ct = setInterval(function(){
  let temp = timeString(song.currentTime);
  $(".currentTime").text(temp);
  let per = Math.round(1000*(song.currentTime/song.duration));
  scrollBar.prop("value",per);
  if(per>=1000){checkRepeat();}
},10);

//on input to scroll bar
scrollBar.on("input",function(){
  console.log("Yup");
  song.currentTime = scrollBar.prop("value")/10;
});

//pause and play button function
pauseAndPlay.on("click",function(){
  if(pauseAndPlay.attr("class") === "fas fa-pause-circle"){
    pauseAndPlay.attr("class","fas fa-play-circle");
    song.pause();
  } else {
    pauseAndPlay.attr("class","fas fa-pause-circle");
    song.play();
  }
});

//Next and previous button
nextBtn.on("click",function(){
  currentSong = currentSong + 1;
  currentSong = currentSong % noOfSongs;
  playSong();
});
prevBtn.on("click",function(){
  currentSong = currentSong - 1 + noOfSongs;
  currentSong = currentSong % noOfSongs;
  playSong();
});

//repeat button
repeatBtn.on("click",function(){
  if(repeat){
    repeat = false;
    $(".repeat span").attr("style","display: none !important");
  } else {
    repeat = true;
    $(".repeat span").attr("style","display: inline !important");
  }
});

//converting number to time string
function timeString(p) {
  let t = Math.round(p);
  let m = Math.floor(t/60);
  let s = t % 60;
  if(s<10){s = "0" + s;}
  return(m + ":" + s);
}

//repeat or not
function checkRepeat() {
  if(repeat){
    playSong();
  } else {
    currentSong = currentSong + 1;
    currentSong = currentSong % noOfSongs;
    playSong();
  }
}

//update queue
function updateQueue() {
  $(".queue #song_1 .songName").text(title[sequence[(currentSong+1)%noOfSongs]]);
  $(".queue #song_2 .songName").text(title[sequence[(currentSong+2)%noOfSongs]]);
  $(".queue #song_3 .songName").text(title[sequence[(currentSong+3)%noOfSongs]]);
  $(".queue #song_1 .duration").text(durationList[sequence[(currentSong+1)%noOfSongs]]);
  $(".queue #song_2 .duration").text(durationList[sequence[(currentSong+2)%noOfSongs]]);
  $(".queue #song_3 .duration").text(durationList[sequence[(currentSong+3)%noOfSongs]]);
}

//shuffle button
shuffleBtn.on("click",function() {
  var temp = Math.floor(Math.random()*10)%2;
  if(temp){
    swap(sequence,(currentSong+1)%noOfSongs,(currentSong+3)%noOfSongs);
  } else {
    swap(sequence,(currentSong+2)%noOfSongs,(currentSong+3)%noOfSongs);
  }
  updateQueue();
});

function swap(arr,a,b) {
  var temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}

//volume
var volBtn = $(".volume i");
var volSlider = $("#volSlider input");
var prevValue = 1.0;
volBtn.on("click",function() {
  if(song.volume == 0){
    volSlider.prop("value",prevValue);
    changeVol();
    volBtn.removeClass("fa-volume-mute");
    volBtn.addClass("fa-volume-up");
  } else {
    volSlider.prop("value",0);
    changeVol();
    volBtn.removeClass("fa-volume-up");
    volBtn.addClass("fa-volume-mute");
    console.log(song.volume);
  }
});

function changeVol() {
  prevValue = song.volume*10;
  song.volume = volSlider.prop("value")/10;
  if(song.volume == 0){
    volBtn.removeClass("fa-volume-up");
    volBtn.addClass("fa-volume-mute");
  }
  else{
    volBtn.removeClass("fa-volume-mute");
    volBtn.addClass("fa-volume-up");
  }
}

//favourite button
favBtn.on("click",function(){
  // making fav
  if(favBtn.attr("class")=="far fa-heart")
  { favBtn.removeClass("far fa-heart");
    favBtn.addClass("fas fa-heart");
    favList[sequence[currentSong]]=1;
  }
  // making unfav
  else{
    favBtn.removeClass("fas fa-heart");
    favBtn.addClass("far fa-heart");
    favList[sequence[currentSong]]=0;
  }
});

var sideBarFav = $("#sideBarFav");
var favouriteSong = $(".side-menu .side-popular-music");
var nowPlay = $("#nowPlay");
var searchSongs = $("#searchSongs");
var nowSearchSongs = $(".side-menu .side-search");
var currentlyPlay = $(".side-menu .side-currently-playing");

//sidebar visibility

$(".header .navi span").click(function() {
  $(".side-menu").animate({marginLeft: "0px"});
  $(".volume-slider").animate({marginTop: "0px"},500);
  sideBarFav.hide();
  nowPlay.hide();
});
$(".header .account span").click(function() {
  $(".user-menu").animate({marginLeft: "760px"});
});
$(".user-menu .close-icon i").click(function() {
  $(".user-menu").animate({marginLeft: "1000px"});
})

//sidebar disabling
$(".side-menu li a, .side-menu .close").click(function() {
  $(".side-menu").animate({marginLeft: "-310px"});
});

//update favourite song side bars

favouriteSong.on("click", function() {
  $("#sideBarFav").toggle();
  updateSideBar();
});

function updateSideBar()
{
  $('#sideBarFav .insideEle').remove();
  for(var i=0;i<noOfSongs;i++)
  { if(favList[i])
    { var favSong = "<div class='insideEle' id='"+sequence[i]+"'>"+title[i]+"</div>";
      sideBarFav.append(favSong);
    }
  }
}
var searchStatus = 0;
nowSearchSongs.on("click",function() {
  searchSongs.toggle();
  updateSearchSongs();
});
function updateSearchSongs() {
  if(searchStatus == 0){
    var search = "<input class='search-song' type='text' name='' value='' placeholder='e.g beats-craze'>";
    searchSongs.append(search);
    searchStatus = 1;
  }
}

currentlyPlay.on("click",function() {
  nowPlay.toggle();
  updateNowPlaying();
});

function updateNowPlaying(){
  nowPlay.append(title[sequence[currentSong]]);
}


//on click to the favourite song
$(document.body).on("click","#sideBarFav div",function() {
  console.log("button is clicked");
  currentSong = $(this).attr("id");
  playSong();
  $(".side-menu").animate({marginLeft: "-310px"},1000);
});
