class Rain {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.height = random(30, 50);
    this.fadePt = random(height - 280, height - 50)
    this.fadePt80 = this.fadePt + 80
  }

  show() {
    noStroke();
    if (this.y > this.fadePt) {
      fill(250, this.transparency * (this.fadePt80 - this.y) / 80);
    } else {
      fill(250, this.transparency);
    }
    ellipse(this.x, this.y, this.width, this.height)
  }

  move() {
    this.x += this.xv;
    this.y += this.yv;
    this.width = this.widthRespawn * sin(frameCount / 10);
    if (this.y > height) {
      this.x = this.xRespawn;
      this.y = this.yRespawn;
    }
  }
}

function toggleRain() {
  a = 0;
  if (c == 3) {
    c = 0
  } else {
    c++;
    cc = sliderCategory

    for (let i = 0; i < c * 25; i++) {
      rains[i].x = random(width)
      rains[i].y = random(height) - height
      rains[i].xRespawn = rains[i].x;
      rains[i].yRespawn = rains[i].y;
      rains[i].width = random(1, 4);
      rains[i].widthRespawn = rains[i].width;
      //rains[i].transparency = 70 + c * 50
      rains[i].transparency = 160 - (rains[i].width + rains[i].height)*2 + c * 40
      rains[i].xv = (rains[i].x - (width / 2)) / 2000
      rains[i].yv = (rains[i].width + rains[i].height) + random(6, 10) - 40;
    }
  }
  
  let elem = document.querySelector('#snow-rain-title');
  elem.textContent = 'Snow/Rain Lv:' + c;
}