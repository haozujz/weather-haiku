// jshint esversion:8

const PI = 22 / 7

let sliderSun, sl
let sliderCategory = 0

let sliderTreeR, sliderTreeG, sliderTreeB
let sliderTreeTrunkColor, sliderTreeRotation, sliderTreeDepthRotation

let sunR, sunx, suny, sunSize

let fakeSunX, fakeSunY, flareSize

let clouds = []

let snowButton
let snows = []
let a = 0
let aa = 0

let grassButton
let grasses = []
let b = 0
let bb = 0

let rainButton
let rains = []
let c = 0
let cc = 0

let treeButton, treeRemoveButton, treeLeavesColorButton

let trunk = []
let twigs = []
let leaves = []

let birds = []
let abortKey = 0

async function setup() {
  createCanvas(900, 700);
  
  sliderSun = createSlider(0, 130, 65, 0.2);
  sliderSun.position(925, 350);
  
  sliderTreeR = createSlider(0, 250, 250);
  sliderTreeR.position(1245, 350);
  sliderTreeG = createSlider(0, 250, 150);
  sliderTreeG.position(1245, 400);
  sliderTreeB = createSlider(0, 100, 100);
  sliderTreeB.position(1245, 450);
  sliderTreeTrunkColor = createSlider(20, 200, 80); 
  sliderTreeTrunkColor.position(1080, 500);
  sliderTreeRotation = createSlider(1, 4.5, 2, 0.05); 
  sliderTreeRotation.position(1080, 350);
  sliderTreeDepthRotation = createSlider(0, 2 * PI, 0, 0.01);
  sliderTreeDepthRotation.position(1080, 600);
  
  for (const el of [sliderSun, sliderTreeR, sliderTreeG, sliderTreeB, sliderTreeTrunkColor, sliderTreeRotation, sliderTreeDepthRotation]) {
    el.addClass("slider")
  }

  snowButton = createButton("Snow");
  snowButton.position(935, 445);
  snowButton.mousePressed(toggleSnow);
  rainButton = createButton("Rain");
  rainButton.position(1000, 445);
  rainButton.mousePressed(toggleRain);
  grassButton = createButton("Grass");
  grassButton.position(965, 550);
  grassButton.mousePressed(toggleGrass);
  birdButton = createButton("Birds");
  birdButton.position(965, 655);
  birdButton.mousePressed(animateBirds);
  treeButton = createButton("Grow");
  treeButton.position(1090, 380);
  treeButton.mousePressed(startTree);
  treeRemoveButton = createButton("Clear");
  treeRemoveButton.position(1150, 380);
  treeRemoveButton.mousePressed(clearTree);
  treeLeavesColorButton = createButton("Default Sakura");
  treeLeavesColorButton.position(1270, 500);
  treeLeavesColorButton.mousePressed(defaultLeavesColor);
  
  for (const el of [snowButton, rainButton, grassButton, birdButton, treeButton, treeRemoveButton, treeLeavesColorButton]) {
    el.addClass("button")
  } 
  treeLeavesColorButton.style('width', '90px')

  for (let i = 0; i < 15; i++) {
    clouds[i] = new Cloud((random([40, 340])), 620);
  }
  for (let i = 0; i < 60; i++) {
    snows[i] = new Snow(random(width) - 36, random(height) - height)
  }
  for (let i = 0; i < 21; i++) {
    grasses[i] = new Grass(random(75, 325), random(height - 210, height - 100))
  }
  for (let i = 0; i < 75; i++) {
    rains[i] = new Rain(random(width), random(height) - height)
  }
  
  for (let i = 0; i < 40; i++) {
    birds[i] = new Bird(-200, height + 100, 2, 1)
  }
    
  animateBirds(isFirst = true)
  startTree()
}


function draw() {
  sl = sliderSun.value()

  if (sl <= 65 && sl > 45) {
      background(sl + (sl - 45) / 4, 88 + (sl - 45) / 4, 150 + (sl - 45) / 4);
  } else if (sl >= 65 && sl < 85) {
      background(sl + (85 - sl) / 4, 90 + (85 - sl) / 4, 150 + (85 - sl) / 4);
  } else if (sl<45) {
    background(sl,88, 150);
  } else {
    background(sl, 90, 150);
}

  for (let i = 0; i < 10; i++) {
    clouds[i].show();
    clouds[i].move();
  }

  //planet render
  push();
  noStroke();
  translate(0, -5);
  fill(255, 10);
  for (let i = 0; i < 200; i++) {
    translate(0, 5)
    ellipse(width / 2, height + 500, 3000, 1500)
  }
  pop();

  //shadow render (450,190 is sun midpoint)
  fakeSunX = map(sl, 0, 130, 35, 865)
  fakeSunY = map(sl, 0, 130, 245, 135)

  noStroke();
  fill(100, 15 * (sl + 1) / 100)
  beginShape();
  vertex(42, 620);
  vertex(42, 600);
  vertex(340, 600);
  vertex(340, 625);

  vertex(680 - fakeSunX + (65 - sl) * -2, 1250 - fakeSunY);
  vertex(82 - fakeSunX + (65 - sl) * 2, 1240 - fakeSunY);
  endShape();

  //sun render
  sunR = sl * 2 + 60

  push();
  noStroke();
  translate(450, 190);
  rotate(-0.5);

  if (sl > 65) {
    sunx = (sl * 6 - 390) + (sl - 65) * 4
  } else {
    sunx = sl * 6 - 390
  }
  suny = sunx * sunx / -1000;

  if (sl > 65) {
    sunSize = sl + 35 + (sl - 65) * 20
  } else {
    sunSize = sl + 35
  }

  for (let i = 0; i < 5; i++) {
    fill(sunR, 220, 120, 255 - 40 * i);
    ellipse(sunx, suny, sunSize + 2 * i, sunSize + 2 * i);
  }

  //flare render
  flSize = 10000 / (sunSize) - 6;

  fill(sunR, 220, 220, sin((frameCount + 100) / 50) * 90 + 100);
  ellipse(-sunx, -suny, flSize, flSize);

  fill(sunR, 180, 120, sin(frameCount / 50) * 90 + 100);
  ellipse(-sunx * 0.65, -suny * 0.65, flSize * 0.25, flSize * 0.25);

  fill(sunR + 100, 220, 220, sin((frameCount + 50) / 50) * 90 + 100);
  ellipse(-sunx * 0.5, -suny * 0.5, flSize * 0.5, flSize * 0.5);

  fill(sunR + 40, 220, 220, sin((frameCount + 80) / 50) * 90 + 100);
  ellipse(-sunx * 0.2, -suny * 0.2, flSize * 0.4, flSize * 0.4);

  fill(sunR + 140, 220, 220, sin((frameCount + 200) / 50) * 90 + 100);
  ellipse(sunx * 0.4, suny * 0.4, flSize * 0.2, flSize * 0.2);

  fill(sunR, 150, 150, sin((frameCount + 300) / 50) * 90 + 100);
  ellipse(sunx * 0.5, suny * 0.5, flSize * 0.25, flSize * 0.25);
  pop();

  //animate birds behind mountain
  for (let i = birds.length-1; i >= 0; i--) {
    if (birds[i].x > (width + 100) || birds[i].x < -100) {continue}
    birds[i].move();
    if (birds[i].scale < 1)
      birds[i].show();
  }

  //mountain render
  push();
  noStroke();
  translate(30, -76);
  for (let i = 2; i < 27; i++) {
    translate(0, -3)
    fill(75 - i * 0.5 + (sl - 60) / 10 - 4, 87 - i * 0.5 - 4, 76 - i * 0.5 - 4, (i * i) / 2.5);
    beginShape();
    vertex(10, height);
    bezierVertex(80, height - 160, 135, height - 50, 290, height - 80);
    bezierVertex(320, height - 30, 320, height - 30, 310, height);
    bezierVertex(320, height + 100, 10, height + 100, 10, height);
    endShape();
  }
  pop();

  //determine 'sliderCategory'
  if (sl > 80) {
    sliderCategory = 3
  } else if (sl > 40) {
    sliderCategory = 2
  } else {
    sliderCategory = 1
  }

  //animate trunk
  if (trunk.length > 0){
    trunk[0].mapColorForAll();
  }
  for (let i = 0; i < trunk.length * 1; i++) {
    trunk[i].move();
    trunk[i].show();
  }

  //animate grass according to 'b'
  //i < b * 7
  for (let i = 0; i < b * 6; i++) {
    grasses[i].show();
    grasses[i].move();
  }


  //animate limited leaves
  for (let i = 0; i < leaves.length; i++) {
    if (i < 8) {
      leaves[i].move();
      leaves[i].show();
    } else if (i < 60 && i % 2 == 0) {
      leaves[i].move();
      leaves[i].show();
    } else if (i < 78 && i > 60) {
      leaves[i].move();
      leaves[i].show();
    } else if (i < 100 && i % 2 == 0) {
      leaves[i].move();
      leaves[i].show();
    } else if (i < 110 && i > 100) {
      leaves[i].move();
      leaves[i].show();
    } else if (i < 280 && i % 2 == 0) {
      leaves[i].move();
      leaves[i].show();
    } else if (i > 280 && i % 2 == 0) {
      leaves[i].move();
      leaves[i].show();  
    }
  }


  //animate rain according to 'c'
  for (let i = 0; i < c * 13; i++) {
    rains[i].move();
    rains[i].show();
  }

  //animate snow according to 'a'
  for (let i = 0; i < a * 10; i++) {
    snows[i].move();
    snows[i].show();
  }

  //animate birds in front of other elements according to bird scale
  for (let i = birds.length-1; i >= 0; i--) {
    if (birds[i].x > (width + 100) || birds[i].x < -100) {continue}
    if (birds[i].scale >= 1) {
      birds[i].show();
    }
  }
  
  // if (frameCount % 120 == 0){
  //   print ("frameRate = " + frameRate())
  // }
}

// testing birds
// function keyPressed() {
  //f
  // if (keyCode == 70) {
  //   print("frameRate = " + frameRate())
  // }
  //l
  // if (keyCode == 76) {
  //   print("trunk.length = " + trunk.length)
  //   print("leaves.length = " + leaves.length)
  // }
  //m
  // if (keyCode == 77) {
  //   print("mouse = " + mouseX + " " + mouseY)
  // }
  //b bird flock 1, attach 'no tree' condition?
  // if (keyCode == 66) {
  //   let bird = new Bird(mouseX, mouseY, 1, 1)
  //   birds.push(bird)
  //   print(birds.length)
  // }
  //v bird flock 2
  // if (keyCode == 86) {
  //   let bird = new Bird(mouseX, mouseY, 2, 1)
  //   birds.push(bird)
  //   print(birds.length)
  // }
  //c bird flock 3
  // if (keyCode == 67) {
  //   let bird = new Bird(mouseX, mouseY, 3, -1)
  //   birds.push(bird)
  //   print(birds.length)
  // }
  //x bird flock 4
  // if (keyCode == 88) {
  //   let bird = new Bird(mouseX, mouseY, 3, 1)
  //   birds.push(bird)
  //   print(birds.length)
  // }
  //z bird flock 10, demo
  // if (keyCode == 90) {
  //   let bird = new Bird(mouseX, mouseY, 10, 1)
  //   birds.push(bird)
  //   print(birds.length)
  // }
  //n, remove birds
  // if (keyCode == 78) {
  //   for (let i = 0; i < birds.length; i++) {
  //     birds.splice(0, birds.length)
  //     print(birds.length)
  //   }
  // }
// }