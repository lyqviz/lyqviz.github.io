

let canvas;
let video;
let poseNet;
let poses = [];
let sucess;
let guitar, base, drum, party, volin, cello;

function preload(){
	guitar = loadSound('guitar_morning_tone.mp3');
  base = loadSound('base_hip_hop.mp3');
  drum = loadSound('drum_music.mp3');
  party = loadSound('party_rock_club.mp3');
  volin = loadSound('violin_sound.mp3');
  cello = loadSound('cello.mp3');
}

function setup() {
  canvas = createCanvas(1200, 1000);
  canvas.position((windowWidth - width)/2, 100);

  //Capture the video and hide it.
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function (results) {
    poses = results;
 });

}

function modelReady() {
  success = createP('Move around to play music!');
  success.class('success');
}

function draw() {

      //Push the hidden video onto the canvas
			push();
			translate(video.width , 0);
			scale(-1, 1);
      background(255, 255);
			pop();
      // Function to draw multiple rectangles onto the screen
      drawBody();

      // Function to draw the nose ellipse and logics for music playing
      posePlayer();

}


function drawBody() {
	for(let i = 0; i < poses.length; i++){
    let pose = poses[i].pose;

    // Seperating out the 17 keypoints posenet returns
    let nose = pose.keypoints[0];
    let leftEye = pose.keypoints[1];
    let rightEye = pose.keypoints[2];
    let leftEar = pose.keypoints[3];
    let rightEar = pose.keypoints[4];
    let leftShoulder = pose.keypoints[5];
    let rightShoulder = pose.keypoints[6];
    let leftElbow = pose.keypoints[7];
    let rightElbow = pose.keypoints[8];
    let leftWrist = pose.keypoints[9];
    let rightWrist = pose.keypoints[10];
    let leftHip = pose.keypoints[11];
    let rightHip = pose.keypoints[12];
    let leftKnee = pose.keypoints[13];
    let rightKnee = pose.keypoints[14];

    if (nose.score > 0.5) {
      strokeWeight(5)
      strokeCap(ROUND);
      stroke(223, 207, 190);
      //line joining right shouder and elbow
      line(width - rightShoulder.position.x, rightShoulder.position.y, width - rightElbow.position.x, rightElbow.position.y);
      //line joining left shoulder to elbow
      line(width - leftShoulder.position.x, leftShoulder.position.y, width - leftElbow.position.x, leftElbow.position.y);

      // right shoulder
      noStroke();
      fill(239, 192, 80);
      ellipse(width - rightShoulder.position.x, rightShoulder.position.y, 30, 30);
      //left shoulder
      ellipse(width - leftShoulder.position.x, leftShoulder.position.y, 30, 30);

      // Socket to elbow
      stroke(0, 255, 239, 135);
      line(width - rightElbow.position.x, rightElbow.position.y, width - rightWrist.position.x, rightWrist.position.y);
      line(width - leftElbow.position.x, leftElbow.position.y, width - leftWrist.position.x, leftWrist.position.y);

      //Elbows
      fill(0, 255, 239, 127);
      noStroke();
      ellipse(width - leftElbow.position.x, leftElbow.position.y, 30, 30);
      ellipse(width - rightElbow.position.x, rightElbow.position.y, 30, 30);

      // Wrists
      fill(88, 147, 212, 127);
      ellipse(width - rightWrist.position.x, rightWrist.position.y, 30, 30);
      ellipse(width - leftWrist.position.x, leftWrist.position.y, 30, 30);


      //quardilateral
      //stroke(36, 112, 160, 135);
      fill(250, 114, 104);
      quad(width - rightShoulder.position.x, rightShoulder.position.y,width - leftShoulder.position.x,leftShoulder.position.y, width - leftHip.position.x, leftHip.position.y, width - rightHip.position.x, rightHip.position.y);

      //stroke(255, 118, 87, 135);
      fill(255, 118, 87, 127);

      let faceRadius = dist(width - nose.position.x, nose.position.y, width - leftEar.position.x, leftEye.position.y);
      ellipse(width - nose.position.x, nose.position.y, faceRadius, faceRadius+ 60);

      //Hips
      //noStroke();
      fill(124, 71, 137, 127)
      ellipse(width - rightHip.position.x, rightHip.position.y, 30, 30);
      ellipse(width - leftHip.position.x, leftHip.position.y, 30, 30);

      // lines from hips to knees
      stroke(167, 209, 41, 127);
      line(width - rightHip.position.x, rightHip.position.y, width - rightKnee.position.x, rightKnee.position.y);
      line(width - leftHip.position.x, leftHip.position.y, width - leftKnee.position.x, leftKnee.position.y);

    }

  }
}

function posePlayer()  {

  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      let pose = poses[i].pose;
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      //let nose = pose.keypoints[0];
	    let nose = pose.keypoints[0];
      let leftEye = pose.keypoints[1];
      let rightEye = pose.keypoints[2];
      let leftEar = pose.keypoints[3];
      let rightEar = pose.keypoints[4];
      let leftShoulder = pose.keypoints[5];
      let rightShoulder = pose.keypoints[6];
      let leftElbow = pose.keypoints[7];
      let rightElbow = pose.keypoints[8];
      let leftWrist = pose.keypoints[9];
      let rightWrist = pose.keypoints[10];
      let leftHip = pose.keypoints[11];
      let rightHip = pose.keypoints[12];
      let leftKnee = pose.keypoints[13];
      let rightKnee = pose.keypoints[14];

      // Only draw an ellipse is the pose probability is bigger than 0.5
      if (nose.score > 0.5) {

        //The conditions for the different sounds to load.
        //Right wrist playing conditions
        if( width - rightWrist.position.x > width - 200 && rightWrist.position.x > 0  && !drum.isPlaying()){
        drum.play();
        rectMode(CENTER);
        noStroke();
        fill(88, 147, 212, 100)
        rect(700, 280, 150, height);
      } else if(width - rightWrist.position.x < width - 200 && rightWrist.position.x < 800 && drum.isPlaying()){
        drum.stop();
      }

//Left wrist playing conditions
        if(width - leftWrist.position.x < width - 600 && leftWrist.position.x < 800 && !guitar.isPlaying()){
        rectMode(CENTER);
        noStroke();
        fill(88, 147, 212, 100)
        rect(100, 280, 150, height);
        guitar.play();
      } else if(width - leftWrist.position.x > width - 600 && leftWrist.position.x > 0 && guitar.isPlaying()){
        guitar.stop();
      }

      // Nose playing condition 1
        if(nose.position.y > 0 && nose.position.y <= height/4 && !base.isPlaying()){
        noStroke();
        fill(222,205,195, 100);
        rectMode(CENTER);
        rect(width/2, height/8, width, height/4);
        base.play();
      } else if(nose.position.y > height/4 && nose.position.y < height && base.isPlaying()){
        base.stop();
      }

        // Nose playing condition 2
      if(nose.position.y > height/4 && nose.position.y <= height/2 && !party.isPlaying()){
        noStroke();
        fill(222,205,195, 100);
        rectMode(CENTER);
        rect(width/2, 3*height/8, width, height/4);
        party.play();
      } else if(nose.position.y <= height/4 && nose.position.y > height/2 && nose.position.y < height && party.isPlaying()){
        party.stop();
      }

        // Nose playing condition 3
      if(nose.position.y > height/2 && nose.position.y <= 3*height/4 && !volin.isPlaying()){
        noStroke();
        fill(222,205,195, 100);
        rectMode(CENTER);
        rect(width/2, 5*height/8, width, height/4);
        volin.play();
      } else if(nose.position.y < height/2 && nose.position.y > 3*height/4 && nose.position.y < height && volin.isPlaying()){
        volin.stop();
      }


      // Nose playing condition 4
      //
      if(nose.position.y > 3*height/4 && nose.position.y <= height && !cello.isPlaying()){
        noStroke();
        fill(222,205,195, 100);
        rectMode(CENTER);
        rect(width/2, 7*height/8, width, height/4);
        cello.play();
      } else if(nose.position.y < 3*height/4 && nose.position.y > 0 && nose.position.y < height && cello.isPlaying()){
        cello.stop();
      }


      }
  }

}
