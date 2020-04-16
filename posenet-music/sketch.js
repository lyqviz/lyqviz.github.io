let canvas;
let video;
let poseNet;
let poses = [];
let sucess;
let songOne, songTwo, songThree, songFour;
let soundNames = ['MINIONS', 'DORAEMON', 'CONAN', 'PIKACHU'];
//let imageOne;

function preload(){
	songOne = loadSound('pikachu.mp3');
  songTwo = loadSound('detective_conan.mp3');
  songThree = loadSound('doraemon.mp3');
  songFour = loadSound('minions_banana.mp3');
  //songOne = loadSound('shin_chan.mp3');
  //imageOne = loadImage('sailor_moon_icon.png');
}

function setup() {
  canvas = createCanvas(1200, 700);
  canvas.position((windowWidth - width)/2, 100);

  //Capture the video and hide it.
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function (results) {
    poses = results;
 });
 // Hide the video element, and just show the canvas

}

function modelReady() {
  success = createP('Raise your right hand to begin playing');
  success.class('success');
}

function draw() {

      //Push the hidden video onto the canvas
			push();
			translate(video.width , 0);
			scale(-1, 1);
      image(video, 0, 0, width, height);
			pop();


      // Function to draw multiple rectangles onto the screen
      drawRect();

      // Function to draw the nose ellipse and logics for music playing
      posePlayer();

      //Function to draw text onto the rectangles
      writeText();

}


function drawRect() {
	for(let i = 0; i < width; i = i + width/4){
    let colR = map(i, 0, width, 0, 150);
    let colG = map(i, 0, width, 100, 100);
    let colB = map(i, 0, width, 100, 50);
    noStroke();
  	fill(colR, colG, colB, 200);
    rect(i, 0, width/4, height);
  }
}

function writeText(){
  fill(255, 150);
  textAlign(CENTER);
  textSize(20);
  text(soundNames[0] , width/8, height/2);
  text(soundNames[1] , 3*width/8, height/2);
  text(soundNames[2] , 5*width/8, height/2);
  text(soundNames[3] , 7*width/8, height/2);
  //text(soundNames[4] , 9*width/10, height/2);
}



function posePlayer()  {

  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      let pose = poses[i].pose;
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      //let nose = pose.keypoints[0];
			let leftWrist = pose.keypoints[9];
			let rightWrist = pose.keypoints[10];

      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (rightWrist.score > 0.5) {
        //Draw an ellipse at the nose
        fill(255, 0, 0, 150);
        noStroke();
        ellipse(width - rightWrist.position.x, rightWrist.position.y, 30, 30);
				fill(0, 0, 255, 150);
				ellipse(width - leftWrist.position.x, leftWrist.position.y, 30, 30);
        //image(imageOne, width);

        //The conditions for the different sounds to load.
        if (rightWrist.position.x < width/4  &&  !songOne.isPlaying()) {
          songTwo.pause();
          songThree.pause();
          songFour.pause();
          songOne.play();
          //songFive.pause();
        } else if(rightWrist.position.x >= width/4  &&  rightWrist.position.x < width/2 && !songTwo.isPlaying()) {
          songOne.pause();
          songFour.pause();
          songThree.pause();
          songTwo.play();
          //songFive.pause();
        } else if(rightWrist.position.x >= width/2  &&  rightWrist.position.x < 3*width/4 && !songThree.isPlaying() ){
          songOne.pause();
          songTwo.pause();
          songFour.pause();
          songThree.play();
          //songFive.pause();
        } else if(rightWrist.position.x >= 3*width/4  &&  rightWrist.position.x < width && !songFour.isPlaying() ){
          songOne.pause();
          songTwo.pause();
          songThree.pause();
          songFour.play();
          //songFive.pause();
        } /*else if(rightWrist.position.x >= width/5 &&  rightWrist.position.x < width/2 && !songFive.isPlaying() ){
          songOne.pause();
          songTwo.pause();
          songThree.pause();
          songFour.pause();
          songFive.play();
        }*/

      }
  }

}
