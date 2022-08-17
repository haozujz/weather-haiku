function Branch(start, firstSegEnd, thick, rotation, inheritance) {
  this.start = start
  this.end = []
  this.end[0] = firstSegEnd
  this.t = thick * 1.1
  this.ro = rotation
  this.inheritance = inheritance

  //re-attach trunk start pts after movement
  this.originTrunk = -1
  this.originEnd = -1
  this.secondOriginTrunk = -1
  this.secondOriginEnd = -1
  //

  let dir = p5.Vector.sub(this.end[0], this.start);
  dir.rotate(PI * random(-0.08, 0.08) * this.ro);
  this.end[1] = p5.Vector.add(this.end[0], dir);
  this.end[1].seed = random([false, false, true]);

  for (let i = 2; i < 4; i++) {
    let dir = p5.Vector.sub(this.end[i - 1], this.end[i - 2]);
    dir.rotate(PI * random(-0.07, 0.07) * this.ro);
    this.end[i] = p5.Vector.add(this.end[i - 1], dir);
    this.end[i].seed = random([false, false, true]);
  }

  for (let i = 4; i < 7; i++) {
    let dir = p5.Vector.sub(this.end[i - 1], this.end[i - 2]);
    dir.rotate(PI * random(-0.07, 0.07) * this.ro);
    this.end[i] = p5.Vector.add(this.end[i - 1], dir);
    this.end[i].seed = random([false, false, true]);
  }

  for (let i = 7; i < 9; i++) {
    let dir = p5.Vector.sub(this.end[i - 1], this.end[i - 2]);
    dir.rotate(PI * random(-0.07, 0.07) * this.ro);
    dir.mult(0.9);
    this.end[i] = p5.Vector.add(this.end[i - 1], dir);
    this.end[i].seed = random([false, false, true]);
  }

  for (let i = 9; i < 11; i++) {
    let dir = p5.Vector.sub(this.end[i - 1], this.end[i - 2]);
    dir.rotate(PI * random(-0.07, 0.07) * this.ro);
    dir.mult(0.9);
    this.end[i] = p5.Vector.add(this.end[i - 1], dir);
    this.end[i].seed = random([false, true]);
  }

  for (let i = 11; i < 12; i++) {
    let dir = p5.Vector.sub(this.end[i - 1], this.end[i - 2]);
    dir.rotate(PI * random(-0.07, 0.07) * this.ro);
    dir.mult(0.9);
    this.end[i] = p5.Vector.add(this.end[i - 1], dir);
    this.end[i].seed = random([false, true]);
  }

  for (let i = 12; i < 14; i++) {
    let dir = p5.Vector.sub(this.end[i - 1], this.end[i - 2]);
    dir.rotate(PI * random(-0.07, 0.07) * this.ro);
    dir.mult(0.9);
    this.end[i] = p5.Vector.add(this.end[i - 1], dir);
    this.end[i].seed = true;
  }

  // Assign zero end-seg speed and inherited speed
  for (let i = 12; i >= 0; i--) {
    this.end[i].v = 0
  }
  this.inheritedOriginV = 0
  this.inheritedSecondOriginV = 0

  this.show = function() {
    stroke(this.r, this.g, this.b);

    strokeWeight(this.t);
    line(this.start.x, this.start.y, this.end[0].x, this.end[0].y);

    for (let i = 1; i < 4; i++) {
      strokeWeight(this.t);
      line(this.end[i - 1].x, this.end[i - 1].y, this.end[i].x, this.end[i].y);
    }

    for (let i = 4; i < 7; i++) {
      strokeWeight(this.t * 3.5 / 4);
      line(this.end[i - 1].x, this.end[i - 1].y, this.end[i].x, this.end[i].y);
    }

    for (let i = 7; i < 9; i++) {
      strokeWeight(this.t * 3.0 / 4);
      line(this.end[i - 1].x, this.end[i - 1].y, this.end[i].x, this.end[i].y);
    }

    for (let i = 9; i < 11; i++) {
      strokeWeight(this.t * 2.45 / 4);
      line(this.end[i - 1].x, this.end[i - 1].y, this.end[i].x, this.end[i].y);
    }

    for (let i = 11; i < 12; i++) {
      strokeWeight(this.t * 1.8 / 4);
      line(this.end[i - 1].x, this.end[i - 1].y, this.end[i].x, this.end[i].y);
    }

    for (let i = 12; i < 13; i++) {
      strokeWeight(this.t * 1.1 / 4);
      line(this.end[i - 1].x, this.end[i - 1].y, this.end[i].x, this.end[i].y);
    }
  }
  
  this.mapColorForAll = function() {
    let TT = sliderTreeTrunkColor.value();
    let R = map(TT, 110, 200, 50, 200);
    let r = map(TT, 20, 110, 20, 50);

    let G = map(TT, 110, 200, 40, 200);
    let g = map(TT, 20, 110, 20, 40);

    let B = map(TT, 110, 200, 20, 200);
    let b = map(TT, 20, 110, 20, 20);

    if (TT >= 110) {
      for (i=0; i<trunk.length; i++){
      trunk[i].r = R;
      trunk[i].g = G;
      trunk[i].b = B;
      } 
    } else {
      for (i=0; i<trunk.length; i++){
      trunk[i].r = r;
      trunk[i].g = g;
      trunk[i].b = b;
      }    
    }
  }

  this.move = function() {
    let z = sliderTreeDepthRotation.value();
    let f = sin(frameCount / 60)

    //re-attach trunk start pts after movement, efficiency update: now identifies the origin-end-seg speed before updating this object's speed all at once, previously: updated this object's intrinsic speed and then identified origin-end-seg speed and then updated this object's speed a second time
    if (this.originTrunk > -1) {
      this.inheritedOriginV = trunk[this.originTrunk].end[this.originEnd].v
    }
    if (this.secondOriginTrunk > -1) {
      this.inheritedSecondOriginV = trunk[this.secondOriginTrunk].end[this.secondOriginEnd].v
    }
    this.inheritedTotalV = this.inheritedOriginV + this.inheritedSecondOriginV

    this.start.x = 300 + this.start.spokeX * cos(this.start.depthAngle + z);
    for (let i = 0; i < 13; i++) {
      this.end[i].x = 300 + this.end[i].spokeX * cos(this.end[i].depthAngle + z);
    }

    this.end[12].v = f / 13
    this.end[11].v = f / 20
    this.end[10].v = f / 35
    this.end[9].v = f / 45
    this.end[8].v = f / 60
    this.end[7].v = f / 78

    for (let i = 12; i >= 0; i--) {
      this.end[i].spokeX += -this.end[i].v - this.inheritedTotalV
      this.end[i].y += this.end[i].v + this.inheritedTotalV
    }
    this.start.spokeX += -this.inheritedTotalV
    this.start.y += this.inheritedTotalV
  }

  this.findSpoke = function() {
    let q = map(sliderTreeRotation.value(), 1, 4.5, 1, 2)

    //assign depthValue
    if (this.inheritance == 0) {
      this.start.depthValue = 0.1;
      this.end[0].depthValue = random(-10, 10) * q
      for (let i = 1; i < 14; i++) {
        this.end[i].depthValue = this.end[i - 1].depthValue + random(-2, 10) * q //+ random(-7,10)*i*0.1;
      }
    } else if (this.inheritance == 1) {
      this.start.depthValue = trunk[this.originTrunk].end[this.originEnd].depthValue;
      this.end[0].depthValue = this.start.depthValue + random(-10, 10) * q
      for (let i = 1; i < 14; i++) {
        this.end[i].depthValue = this.end[i - 1].depthValue + random(-10, 2) * q;
      }
    } else if (this.inheritance == 2) {
      this.start.depthValue = trunk[this.secondOriginTrunk].end[this.secondOriginEnd].depthValue;
      this.end[0].depthValue = this.start.depthValue + random(-10, 10) * q
      for (let i = 1; i < 14; i++) {
        this.end[i].depthValue = this.end[i - 1].depthValue + random(-10, 2) * q;
      }
    }

    //find depthAngle
    this.start.baseX = this.start.x;
    for (let i = 0; i < 14; i++) {
      this.end[i].baseX = this.end[i].x
    }
    this.start.depthAngle = Math.atan(this.start.depthValue / (this.start.baseX - 300))
    for (let i = 0; i < 14; i++) {
      this.end[i].depthAngle = Math.atan(this.end[i].depthValue / (this.end[i].baseX - 300))
    }

    //find spoke length
    this.start.baseX = this.start.x;
    for (let i = 0; i < 14; i++) {
      this.end[i].baseX = this.end[i].x
    }
    this.start.spokeX = (this.start.baseX - 300) * 1 / (cos(this.start.depthAngle))
    for (let i = 0; i < 14; i++) {
      this.end[i].spokeX = (this.end[i].baseX - 300) * 1 / (cos(this.end[i].depthAngle))
    }
  }
}

function growTrunk(x, y, t, r, l, rotation, inheritance) {
  let a = createVector(x, y)
  let b = createVector(x + l * sin(r), y - l * cos(r))
  z = new Branch(a, b, t, rotation, inheritance);
  trunk.push(z);
}

function startTree() {
  let q = sliderTreeRotation.value()
  let tMod = random([0, 0, 0, 0, 0, 0, 0, 0, -0.2, 0.2])

  clearTree();

  growTrunk(300, 500, 10 - tMod, 0, 20, q, 0);

  for (i = 1; i < 10; i++) {
    let iMapLength = map(i, 0, 9, 18, 7)
    if (trunk[0].end[i].seed == true) {
      growTrunk(trunk[0].end[i].x, trunk[0].end[i].y, 7 - tMod - (i * 0.1), PI * random(-0.3, 0.3), random(iMapLength - 2, iMapLength + 3), q, 1);

      trunk[trunk.length - 1].originTrunk = 0;
      trunk[trunk.length - 1].originEnd = i;
    }
  }

  for (j = trunk.length - 1; j > 0; j--) {
    for (i = 1; i < 10; i++) {
      let iMapLength = map(i, 0, 9, 18 * 0.8, 7 * 0.8);
      if (trunk[j].end[i].seed == true) {
        growTrunk(trunk[j].end[i].x, trunk[j].end[i].y, 6 - tMod - (i * 0.1), PI * random(-0.3, 0.3), random(iMapLength - 2, iMapLength + 5), q, 2);

        trunk[trunk.length - 1].secondOriginTrunk = j;
        trunk[trunk.length - 1].secondOriginEnd = i;

        //re-attached trunk start pts after movement
        trunk[trunk.length - 1].originTrunk = trunk[j].originTrunk;
        trunk[trunk.length - 1].originEnd = trunk[j].originEnd;
      }
    }
  }

  for (let i = 0; i < trunk.length; i++) {
    trunk[i].findSpoke();
  }

  for (let i = 1; i < trunk.length; i++) {
    for (let j = 3; j < 13; j++) {
      if (trunk[i].end[j].seed == true) {
        growTwig(trunk[i].end[j].x, trunk[i].end[j].y, PI * random(-2, 2), 8);
        twigs[twigs.length - 1].depthValue = trunk[i].end[j].depthValue
      }
    }
  }

  let Ltype = random([1,1,2])
  for (let i = 0; i < twigs.length; i++) {
    for (let j = 0; j < twigs[i].end.length; j++) {
      if (twigs[i].end[j].seed == true) {
        let leaf = new Leaf(twigs[i].end[j].x + random(-10, 10), twigs[i].end[j].y + random(-10, 10),Ltype);
        leaves.push(leaf);
        leaves[leaves.length - 1].depthValue = twigs[i].depthValue + random(-10, 10)
      }
    }
  }

  for (let i = 0; i < trunk.length; i++) {
    for (let j = 5; j < 13; j++) {
      if (trunk[i].end[j].seed == true && leaves.length < 300) {
        let leaf = new Leaf(trunk[i].end[j].x + random(-13, 13), trunk[i].end[j].y + random(-13, 13),Ltype);
        leaves.push(leaf);
        leaves[leaves.length - 1].depthValue = trunk[i].end[j].depthValue + random(-13, 13)
      }
    }   
  }

  for (let i = 0; i < leaves.length; i++) {
    leaves[i].findSpoke();
  }

  // print("trunk.length=" + trunk.length)
  // print("twigs.length=" + twigs.length)
  // print("leaves.length=" + leaves.length)
}

function clearTree() {
  trunk.splice(0, trunk.length);
  twigs.splice(0, twigs.length);
  leaves.splice(0, leaves.length);
}