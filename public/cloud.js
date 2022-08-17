class Cloud {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.transparency = 70
    this.width = random(5, 20);
    this.height = random(5, 20);
    this.xv = -1
    this.yv = random(0, 1)
  }

  show() {
    noStroke();
    fill(250, this.transparency);
    ellipse(this.x, this.y, this.width, this.height)
  }

  move() {
    this.x += this.xv + random(-0.5, 0.5)
    this.y += this.yv + random(-0.5, 0.5)
    if (this.y > height) {
      this.x = random([40, 340]);
      this.y = 620;
    }
  }
}