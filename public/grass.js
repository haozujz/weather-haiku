class Grass {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.X = 0
    this.Y = 0
  }

  show() {
    stroke(255, 20);
    fill(75 - 20 + (sliderSun.value() - 60) / 2, 67, 56);

    for (let i = 0; i < 3; i++) {
      this.X = this.x + this.xtuft * i
      if (i == 0) {
        this.ytuft = 0;
      } else if (i == 1) {
        this.ytuft = this.yspace;
      } else {
        this.ytuft = this.yspace * -1 + 5;
      }
      this.Y = this.y + this.ytuft

      beginShape();
      vertex(this.X, this.Y)
      quadraticVertex(this.X + 4, this.Y - 10, this.X - 5 - this.sway, this.Y - 40 + this.sway / 2)
      quadraticVertex(this.X + 4, this.Y - 10, this.X - 7, this.Y)
      vertex(this.X - 4, this.Y + 1)
      endShape();
    }
  }

  move() {
    this.sway = (sin((frameCount + this.xminusyDiv10) / 10) + 1) / 2 * this.maxSway;
  }
}

function toggleGrass() { 
  if (b == 3) {
    b = 0
  } else {
    b++;
    bb = sliderCategory;

    for (let i = 0; i < b * 7; i++) {
      grasses[i].x = random(75, 325);
      grasses[i].y = random(height - 210, height - 100);
      //relocate grass if behind tree
      if (grasses[i].x > 270 && grasses[i].y < 510) {
        grasses[i].y += 20
      }
      grasses[i].xminusyDiv10 = (grasses[i].x - grasses[i].y)/10

      grasses[i].maxSway = random(5, 20);
      grasses[i].xtuft = random(4, 10);
      grasses[i].yspace = random(4, 10);
    }
  }
  
  let elem = document.querySelector('#grass-title');
  elem.textContent = 'Grass Lv:' + b;
}