class Particle {
    constructor(p, v, maxSpeed) {
        this.vel = v;
        this.pos = p;
        this.time = 0;
        this.maxSpeed = maxSpeed;
        this.lifeTime = Math.random() * 2000;
        // this.positionBuffer = [];
        // this.positionBuffer.push(p.copy());

        if (lifeTime < 200)
            lifeTime = 200;

        // this.trailLength = Math.floor(Math.random() * 1) + 1;
    }

    getPosition() {
        return this.pos;
    }

    getVelocity() {
        return this.vel;
    }

    setVelocity(v) {
        this.vel = v;
    }

    setPosition(p) {
        let copy = this.pos.copy();
        this.pos = p;

        this.time++;
    }

    draw() {
        for (let i = 0; i < this.positionBuffer.length; i++) {
            const pos = this.positionBuffer[i];

            ctx.beginPath();
            ctx.strokeStyle = "#ee1400";
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(pos.x + 1, pos.y + 1);
            ctx.stroke();
        }
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const mag = this.mag();
        this.x /= mag;
        this.y /= mag;
    }

    equals(v) {
        return this.x === v.x && this.y === v.y;
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    static scale(s, v) {
        return new Vector(v.x * s, v.y * s);
    }

    static lerp(v1, v2, t) {
        if (t > 1.0)
            t = 1.0;
        else if (t < 0.0)
            t = 0.0;

        let v = new Vector(0, 0);

        v.x = v1.x + (v2.x - v1.x) * t;
        v.y = v1.y + (v2.y - v1.y) * t;
        return v;
    }
}

const canvas = document.getElementById("canvas");
// Set canvas to size of window

console.log('WRF bef: ' + canvas.getAttribute('willReadFrequently'));

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.setAttribute('willReadFrequently', 'true');
console.log('WRF aft: ' + canvas.getAttribute('willReadFrequently'));

var ctx/* : CanvasRenderingContext2D */ = canvas.getContext("2d", { willReadFrequently: true });
const width = canvas.width;
const height = canvas.height;

// fill with black
ctx.fillStyle = "#1c1e25";
ctx.fillRect(0, 0, width, height);

console.log('WRF: ');
console.log(ctx.getContextAttributes())

// create a grid of points
const resolution = 10;
const columns = width / resolution;
const rows = height / resolution;

let x1Offset = 1.19 + Math.random() * 15.23;
let y1Offset = 3.3 + Math.random() * 2.4;

let x2Offset = 2.2 + Math.random() * 0.24;
let y2Offset = .15 + Math.random() * 22.15904;

const maxParticles = 1500;
const maxParticleLifetime = 10000000;
const physicsHertz = 70000;
const minSpeed = 1200;
const maxParticleSpeed = 5500;
let particles = [];

const velLerpFactor = .1;
const debugField = false;
const fieldInfluence = 1;

let lifeTime = 0;

const noiseScale = 0.015;

let gameTime = 0;

const good_seeds =
    [7.5611379414587745, 147.5530635548854, 51.12451387823036, 59.48958479963245, 2.796706347054606, 91.89877454034043, 34.82049151886012, 83.62571783824464,
        192.1925199044309, 125.20211146432405, 106.36199518091105, 165.46418103924395, 98.8982135350049, 81.00903811138537, 104.98361939117109, 189.5903789950696,
        52.335546401589596, 153.45241287522936, 53.69236029680923, 149.98975691933782, 156.83224236057225, 73.26809509753691, 92.70108053542445, 155.85054814808657,
        156.40055104482474, 169.2760158905349, 163.95847849355488, 62.787874068870025, 195.43189487265357, 148.72560264090296, 152.32696855199842, 194.6337409413344,
        185.6271497937412, 4.218232032380527, 113.83091265029914, 110.18122725611843, 15.432167091927234, 196.32948636862142, 106.97977392829117, 111.02547820977276,
        139.17685628576243, 139.26583904874622, 87480444.48420529, 48447657.9594363, 34675187.87409691, 32362956.27117419, 16399607.897616055, 121700011.70971851,
        56614346.05140292, 63731964.872115776, 85897780.47922423, 140658731.98418522, 97909077.42854221, 38725501.524942674, 35822718.13788023, 61446558.71929718,
        76594323.0291905, 739026.0697808124, 125422529.30466682, 92864149.55410199, 71810057.85700741, 104170433.2652783, 86554121.04121995, 108705914.26348217,
        28569411.81591424, 76130599.86028916, 60543155.8219279, 53294684.33028255, 130632965.76479393, 116430140.67561427, 149537952.24100998, 113774565.2989038,
        151423515.09302598, 68774161.59074566, 138205118.89543995, 131261623.66177824, 103074199.91226506, 71002282.62871762, 143884131.5843435, 105354559.83976807,
        65287651.19590625, 59190773.9246049, 24255211.175727453, 104669874.07412794, 132950361.20335919, 123972001.15000054, 35990431.72332735, 50922683.64635647,
        31388981.81958946, 490787.4140126719, 77713882.88788465, 112380935.20546508, 42487942.81501588, 12629718.699981073];

// generate random seed (not from good_seeds array)
const seed = Math.random() * 158390578;
noise.seed(seed)
console.log('Seed: ' + seed);

ctx.globalAlpha = .15;
// const maxAlpha = 1;
const drawGrid = () => {
    const grid = [];
    // ctx.reset();

    gameTime += 0.01
    if (gameTime >= 55)
        clearInterval(id);

    for (let i = 0; i < columns; i++) {
        grid[i] = [];
        for (let j = 0; j < rows; j++) {

            const x = noise.perlin2((i + x1Offset) * noiseScale, (j + y1Offset) * noiseScale);
            const y = noise.perlin2((i + x2Offset) * noiseScale, (j + y2Offset) * noiseScale);

            let v = new Vector(x * 0.001, y * 0.001);

            v.normalize();
            v = Vector.scale(0.0004, v);

            grid[i].push(v);
        }
    }

    // Debug vector field
    if (debugField) {
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * resolution;
                const y = j * resolution;

                const vel = grid[i][j];

                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + (vel.x * 30000), y + (vel.y * 30000));
                ctx.stroke();
            }
        }
    }

    const getClosestVelocity = (p) => {
        if (p.x >= width || p.x <= 0 || p.y >= height || p.y <= 0)
            return undefined;

        const closestX = Math.floor(p.x / resolution);
        const closestY = Math.floor(p.y / resolution);

        const vel = grid[closestX][closestY];
        return vel;
    }

    // spawn particles if less than cap
    // const start = performance.now();
    for (let i = 0; i < 500; i++) {
        if (particles.length < maxParticles) {
            // vector of random position in canvas
            const pos = new Vector(Math.random() * width, Math.random() * height);

            const vel = Vector.scale(10, getClosestVelocity(pos));
            const p = new Particle(pos, vel, Math.random() * maxParticleSpeed);

            particles.push(p);
        }
    }

    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        if (particle.time >= particle.lifeTime) {
            const posNew = new Vector(Math.random() * width, Math.random() * height);

            particle.setPosition(posNew);
            particle.time = 0;
        }

        const pos = particle.getPosition();
        let closestVel = getClosestVelocity(pos);

        if (!closestVel) {
            particles.splice(i, 1);
            continue;
        }

        let speed = particle.getVelocity().mag();
        let newSpeed = closestVel.mag();

        closestVel.normalize();
        closestVel = Vector.scale(fieldInfluence, closestVel);
        let currVel = particle.getVelocity();
        currVel.normalize();

        // if speed is too close to zero, add a random vector to it

        // lerp velocity
        closestVel = Vector.lerp(currVel, closestVel, velLerpFactor);

        if (closestVel.mag() == 0)
            console.log('CLOSEST VECTOR 0');

        if (particle.vel.mag() >= particle.maxSpeed) {
            closestVel = Vector.scale(particle.maxSpeed, closestVel);
            particle.setVelocity(closestVel);

        } else if (particle.vel.mag() < minSpeed) {
            closestVel = Vector.scale(minSpeed, closestVel);
            particle.setVelocity(closestVel);
        } else {
            // update direction and increase speed according to closest velocity
            closestVel = Vector.scale(newSpeed + speed, closestVel);
            particle.setVelocity(closestVel);
        }

        const updPosition = particle.getPosition();
        updPosition.add(Vector.scale(60 / physicsHertz, particle.getVelocity()));
        particle.setPosition(updPosition);

        // !---Old-Method---!
        ctx.beginPath();
        // set color to #e4846f
        // ctx.fillStyle = "#fe382a"; red
        ctx.fillStyle = "#44485d";

        ctx.arc(particle.pos.x, particle.pos.y, 1, 0, 2 * Math.PI);
        ctx.fill();
    }
}

const id = setInterval(drawGrid, 1000 / physicsHertz);
