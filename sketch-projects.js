let branches = [];
const initialCount = 12;
const stepSize     = 1.5;
const branchProb   = 0.025;
const maxLifeMin   = 100;
const maxLifeMax   = 140;
const maxBranches  = 400;
const fadeAlpha    = 5;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.id('mycelium-canvas');
  background(255); // white background
  frameRate(30);
  spawnCluster();
}

function draw() {
  noStroke();
  fill(255, 255, 255, fadeAlpha); // white fade
  rect(0, 0, width, height);

  for (let i = branches.length - 1; i >= 0; i--) {
    let b = branches[i];
    b.grow();
    if (b.finished) branches.splice(i, 1);
  }

  if (branches.length === 0) {
    spawnCluster();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function spawnCluster() {
  let center = createVector(random(width), random(height));
  for (let i = 0; i < initialCount; i++) {
    let angle = map(i, 0, initialCount, 0, TWO_PI);
    let dir = p5.Vector.fromAngle(angle).setMag(stepSize);
    branches.push(new Branch(center, dir, 0));
  }
}

class Branch {
  constructor(pos, dir, depth) {
    this.pos      = pos.copy();
    this.dir      = dir.copy();
    this.depth    = depth;
    this.life     = 0;
    this.maxLife  = random(maxLifeMin, maxLifeMax);
    this.finished = false;
    this.weight   = map(depth, 0, 7, 3, 0.3);
  }

  grow() {
    if (this.finished) return;

    let next = p5.Vector.add(this.pos, this.dir);
    strokeWeight(this.weight);
    stroke(20, map(this.depth, 0, 7, 0, 200)); // black mycelium
    line(this.pos.x, this.pos.y, next.x, next.y);

    this.pos = next;
    this.life++;

    if (branches.length < maxBranches && this.depth < 7 && random() < branchProb) {
      let a = random(-PI/3, PI/3);
      let nd = this.dir.copy().rotate(a).setMag(stepSize);
      branches.push(new Branch(this.pos, nd, this.depth + 1));
    }

    this.dir.rotate(random(-0.1, 0.1));

    if (
      this.life > this.maxLife ||
      this.pos.x < 0 || this.pos.x > width ||
      this.pos.y < 0 || this.pos.y > height
    ) {
      this.finished = true;
    }
  }
} 