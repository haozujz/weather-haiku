class Snow {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  show() {
    noStroke();
    if (this.y > this.fadePt) {
      fill(250, this.transparency * (this.fadePt120 - this.y) / 120);
    } else {
      fill(250, this.transparency);
    }
    ellipse(this.x, this.y, this.width, this.height)
  }

  move() {
    this.x += sin((frameCount + this.xtime) / 100) * this.xoscillate + this.xv
    this.y += this.yv;
    if (this.y > height) {
      this.x = this.xRespawn;
      this.y = this.yRespawn;
    }
  }
}

function toggleSnow() {
  c = 0;
  if (a == 3) {
    a = 0
  } else {
    a++;
    aa = sliderCategory

    for (let i = 0; i < a * 20; i++) {
      snows[i].x = random(width) - 36
      snows[i].y = random(height) - height
      snows[i].xRespawn = snows[i].x
      snows[i].yRespawn = snows[i].y
      snows[i].width = random(10, 20);
      snows[i].height = random(10, 20);
      snows[i].xv = random(10) / 10 * 0.3;
      snows[i].yv = (snows[i].width + snows[i].height) / 5 - 3.5 + random(10) / 10 * (2 + a);
      snows[i].xtime = random(100);
      snows[i].xoscillate = random(2,10) / 10 * 2
      snows[i].transparency = 180 + a * 40 - (snows[i].width + snows[i].height) * 4
      snows[i].fadePt = 120 + snows[i].width * 25
      snows[i].fadePt120 = snows[i].fadePt + 120
    }
  }
  
  let elem = document.querySelector('#snow-rain-title');
  elem.textContent = 'Snow/Rain Lv:' + a;
}