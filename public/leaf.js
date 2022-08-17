class Leaf {
  constructor(x, y, t) {
    this.x = x
    this.xStart = x
    this.y = y
    this.yStart = y
    this.bBase = random(150, 255) / 100
    this.rotate = PI * random(2)

    if (t == 1) {
      this.scale = random([random(1, 1.5), random(0.75, 0.9)])} 
    else if (t == 2) {this.scale = 1.15}

    this.yStartDiv5 = y / 5
    this.yStartDiv2 = y / 2
  }

  show() {
    noStroke();
    fill(sliderTreeR.value(), sliderTreeG.value(), sliderTreeB.value() * this.bBase, 120);

    push();
    translate(this.x, this.y);
    rotate(this.rotate);


    scale(1.15 + (sin((frameCount + this.xStart + this.yStartDiv5) / 35) + 1) * 0.09)


    beginShape();
    vertex(+5, -5);
    quadraticVertex(+20, +8, +5, +5);
    quadraticVertex(-8, +20, -5, +5);
    quadraticVertex(-20, -8, -5, -5);
    quadraticVertex(+8, -20, +5, -5);
    endShape();
    pop();
  }

  move() {
    this.xStart = 300 + this.spokeX * cos(this.depthAngle + sliderTreeDepthRotation.value());
    this.rotate += PI * 0.001
    this.x = this.xStart - sin((frameCount + this.xStart / 2) / 35) * 1.2
    this.y = this.yStart + sin((frameCount + this.yStartDiv2) / 35) * 1.2
  }

  findSpoke() {
    //find depth angle
    this.depthAngle = Math.atan((this.depthValue + random(-30, 30)) / (this.xStart - 300))

    //find spoke length
    this.spokeX = (this.xStart - 300) * 1 / (cos(this.depthAngle))
  }
}

function defaultLeavesColor() {
  sliderTreeR.value(250);
  sliderTreeG.value(150);
  sliderTreeB.value(100);
}