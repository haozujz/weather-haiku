class Bird {
  constructor(x, y, flocktype, polarity) {
    this.x = x
    this.y = y
    this.startX = x
    this.startY = y
    this.rotXvAdjust = false
    this.flocktype = flocktype
    this.polarity = polarity

    if (this.flocktype == 1) {
      this.xv = random(0, 0.1)
      this.yv = random(0, -0.2)
      this.xa = random(0.001, 0.005)
      this.ya = random(-0.0008, 0.003)

      this.scale = 0.01
      this.scalev = (this.xa + this.ya) / random(0.9, 2.8)

      this.rotX = 0
      this.rotXv = -this.xa / 5
      this.rotY = 0
      this.rotYv = -this.ya / 5
      this.countS = PI
      this.countSv = (this.xa + this.ya) * 5 * 10

    } else if (this.flocktype == 2) {
      this.xv = random(0, 0.1) * this.polarity
      this.yv = random(0, -0.2) * this.polarity
      this.xa = random(0.001, 0.005) * this.polarity
      this.ya = random(0.001, 0.003) * this.polarity

      this.scale = 0.01
      this.scalev = (this.xa + this.ya) * this.polarity / random(0.9, 2.8)

      this.rotX = 0
      this.rotXv = ((-this.xa * this.polarity) / 5 - 0.001) * this.polarity
      this.rotY = 0
      this.rotYv = -this.ya / 5
      this.countS = PI
      this.countSv = (this.xa + this.ya) * 5 * 10 * this.polarity

    } else if (this.flocktype == 3) {
      this.xv = random(0, 0.1) * this.polarity
      this.yv = random(0, -0.2) * this.polarity
      this.xa = random(0.002, 0.005) * this.polarity
      this.ya = random(0.001, 0.0025) * this.polarity

      this.scale = 0.01
      this.scalev = (this.xa-0.001* this.polarity - this.ya) * this.polarity / random(0.9, 2.8)

      this.rotX = 0
      this.rotXv = ((-this.xa * this.polarity) / 5) * this.polarity
      this.rotY = 0
      this.rotYv = -this.ya / 5
      this.countS = PI
      this.countSv = (this.xa + this.ya) * 5 * 10 * this.polarity

    } else if (this.flocktype == 10) {
      this.xv = 0
      this.yv = 0
      this.xa = 0
      this.ya = 0

      this.scale = 1
      this.scalev = 0

      this.rotX = 0
      this.rotXv = -0.02
      this.rotY = 0
      this.rotYv = 0
      this.countS = PI
      this.countSv = 0.05
    }
    this.r = random(180, 210)
    this.g = random(180, 210)
    this.b = random(180, 230)
  }

  show() {
    this.countS += this.countSv
    this.S = sin(this.countS)
    this.C = cos(this.countS / 2)

    if (this.countS > 3 * PI) {
      this.countS = PI
    }

    //old: 40 
    this.tailSpokeX = 30 * sin(this.rotX)
    this.tailX = this.tailSpokeX * cos(this.rotY)
    this.tailY = 30 * sin(this.rotY)

    this.wingMod = this.tailX - this.tailSpokeX

    //old: 60, this.C * horizontal wing motion
    this.wingSpokeXLMod = (this.C * 45 * -cos(this.rotX - PI / 7))
    this.wingXL = this.tailSpokeX + this.wingSpokeXLMod + this.wingMod


    this.wingSpokeXRMod = (this.C * -45 * -cos(this.rotX + PI / 7))
    this.wingXR = this.tailSpokeX + this.wingSpokeXRMod + this.wingMod

    //old: 60 40, this.S * vertical wing motion + body length * sin(this.rotY)
    this.wingY = this.S * 45 + 30 * sin(this.rotY)

    push();
    stroke(200, 100)
    strokeWeight(1)
    // fill(210,200,210)
    fill(this.r, this.g, this.b)
    translate(this.x, this.y)
    scale(this.scale)
    triangle(0, 0, this.tailX, this.tailY, this.wingXL, this.wingY)
    triangle(0, 0, this.tailX, this.tailY, this.wingXR, this.wingY)

    pop();
  }

  move() {
    //Adjust x rotation for correct bird orientation
    if (this.rotX < -PI) {
      this.rotX = 0
      this.rotXvAdjust = !this.rotXvAdjust
    } else if (this.rotX > PI) {
      this.rotX = 0
      this.rotXvAdjust = !this.rotXvAdjust
    }

    //Update bird rotation
    if (!this.rotXvAdjust) {
      this.rotX += this.rotXv
    } else if (this.rotXvAdjust) {
      this.rotX += -this.rotXv
    }
    this.rotY += this.rotYv

    //Adjust bird y accel to fly above mountain
    if (this.x < 350 && this.scale > 0.1) {
      this.ya += -0.00005 * (width - this.startX) / width
      this.rotYv += 0.000005
    }

    //Update bird xy accel, speed, pos
    this.xv += this.xa
    this.yv += this.ya
    this.x += this.xv
    this.y += this.yv

    //Additional scale adjustment per bird orientation
    if (this.rotX > -PI / 2 && this.rotX < PI / 2) {
      this.scale += this.scalev
    } else if (this.rotX < -PI / 2 || this.rotX > PI / 2) {
      this.scale += -this.scalev
    }

    //Flock-type behaviour
    if (this.flocktype == 1) {
      if (this.scale < 0.5) {
        this.scale += this.scalev * 0.5
      } else
      if (this.scale < 1) {
        this.scale += this.scalev * 0.75
      } else if (this.scale > 1) {
        this.scale += this.scalev * 1
        this.xa += 0.00013
        this.ya = this.ya * 1.023
      }
    } else if (this.flocktype == 2 || this.flocktype == 3) {
      this.scale += this.scalev * (width - this.startX) / width
      if (this.scale < 0.5) {
        this.xa += 0.0001 * this.polarity
      } else if (this.scale < 1) {
        this.xa += 0.0002 * this.polarity
      } else if (this.scale < 1.2) {
        this.xa += 0.0004 * this.polarity
      } else if (this.scale < 10) {
        this.xa += 0.0008 * this.polarity
      }
    }
  }

}

async function animateBirds(isFirst = false) {
  abortKey++
  const savedKey = abortKey
  const type = Math.floor(Math.random() * 3)
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }    
    
  for (let i = 0; i < 40; i++) {
    if (savedKey != abortKey) {break}
      birds[i].x = await -200;
  }
  
  if (type==0 || isFirst) {
    for (let i = 0; i < 40; i++) {
      if (savedKey != abortKey) {break}
      birds[i] = new Bird(50, height - 250, 2, 1);
      await sleep(120);
    }
  } else if (type==1) {
    for (let i = 0; i < 40; i++) {
      if (savedKey != abortKey) {break}
      birds[i] = new Bird(Math.floor(Math.random() * 800) + 50, height - 250 - Math.floor(Math.random() * 100), 1, 1);
      await sleep(120);
    }
  } else {
    for (let i = 0; i < 40; i++) {
      if (savedKey != abortKey) {break}
      birds[i] = new Bird(width/2, height - 270, 3, i%2 == 0 ? 1 : -1);
      await sleep(120);
    }
  }

}