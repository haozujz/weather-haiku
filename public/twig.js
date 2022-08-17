function Twig(start, segEnd) {
  this.start = start
  this.end = []
  this.end[0] = segEnd
  this.dir = 0

  dir = p5.Vector.sub(this.end[0], this.start);
  dir.rotate(PI * random(-0.07, 0.07));
  this.end[1] = p5.Vector.add(this.end[0], dir);
  this.end[1].seed = random([false, false, true]);

  for (let i = 2; i < 4; i++) {
    dir = p5.Vector.sub(this.end[i - 1], this.end[i - 2]);
    dir.rotate(PI * random(-0.07, 0.07));
    dir.mult(0.9);
    this.end[i] = p5.Vector.add(this.end[i - 1], dir);
    this.end[i].seed = random([false, false, true]);
  }

  for (let i = 4; i < 5; i++) {
    dir = p5.Vector.sub(this.end[i - 1], this.end[i - 2]);
    dir.rotate(PI * random(-0.07, 0.07));
    dir.mult(0.75);
    this.end[i] = p5.Vector.add(this.end[i - 1], dir);
    this.end[i].seed = random([false, false, true]);
  }

  for (let i = 5; i < 6; i++) {
    dir = p5.Vector.sub(this.end[i - 1], this.end[i - 2]);
    dir.rotate(PI * random(-0.07, 0.07));
    dir.mult(0.5);
    this.end[i] = p5.Vector.add(this.end[i - 1], dir);
    this.end[i].seed = true;
  }
  
}

function growTwig(x, y, r, l) {
  let a = createVector(x, y)
  let b = createVector(x + l * sin(r), y - l * cos(r))
  z = new Twig(a, b);
  twigs.push(z);
}