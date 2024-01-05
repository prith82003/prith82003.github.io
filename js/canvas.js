class Particle {
    constructor(p, v, maxSpeed) {
        this.vel = v;
        this.pos = p;
        this.prevPos = p;
        this.time = 0;
        this.maxSpeed = maxSpeed;
        this.lifeTime = Math.random() * 3000;
    }

    getPosition() {
        return this.pos;
    }

    getPrevPosition() {
        return this.prevPos;
    }

    getVelocity() {
        return this.vel;
    }

    setVelocity(v) {
        this.vel = v;
    }

    setPosition(p) {
        this.prevPos = this.pos;
        this.pos = p;
        this.time++;
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

var ctx = canvas.getContext("2d", { willReadFrequently: true });
const width = canvas.width;
const height = canvas.height;

console.log('WRF: ');
console.log(ctx.getContextAttributes())

// create a grid of points
const resolution = 15;
const columns = width / resolution;
const rows = height / resolution;

let x1Offset = 1.19 + Math.random() * 15.23;
let y1Offset = 3.3 + Math.random() * 2.4;

let x2Offset = 2.2 + Math.random() * 0.24;
let y2Offset = .15 + Math.random() * 22.15904;

const maxParticles = 1000;
const maxParticleLifetime = 10000000;
const physicsHertz = 70000;
const minSpeed = 2000;
const maxParticleSpeed = 5500;
let particles = [];

const velLerpFactor = .2;
const debugField = false;

let lifeTime = 0;

const noiseScale = 0.02;

let gameTime = 0;

const seed = Math.random() * 208;
noise.seed(7.5611379414587745)
console.log('Seed: ' + seed);

const bgColor = 'rgba(28, 30, 37, 0.1)';

ctx.globalAlpha = .2;
const drawGrid = () => {
    const grid = [];
    // const start = performance.now();

    // ctx.globalAlpha = 0.1;
    // ctx.fillStyle = bgColor;
    // ctx.fillRect(0, 0, width, height);

    /* let imgData = ctx.getImageData(0, 0, width, height);
    // I want to set each of the pixels in the img to a bit lower than it is currently
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            let a = imgData.data[j * (imgData.width * 4) + i * 4 + 3];
            a -= .5;
            if (a < 0)
                a = 0;

            // console.log('a: ' + a);
            imgData.data[j * (imgData.width * 4) + i * 4 + 3] = a;
        }
    }
    ctx.putImageData(imgData, 0, 0); */

    // x1Offset += noise.perlin2(gameTime + 1.59981, gameTime + 94.28841) * 0.05;
    // y1Offset += noise.perlin2(gameTime + 1.59981, gameTime + 94.28841) * 0.05;

    // x2Offset += noise.perlin2(gameTime, gameTime) * 0.05;
    // y2Offset += noise.perlin2(gameTime, gameTime) * 0.05;

    // y1Offset += 0.01;
    // x1Offset += 0.01;

    // x2Offset += 0.01;
    // y2Offset += 0.01;

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
            const velNew = Vector.scale(10, getClosestVelocity(posNew));

            particle.setPosition(posNew);
            particle.setVelocity(velNew);
            particle.time = 0;

            ctx.beginPath();
            ctx.arc(particle.pos.x, particle.pos.y, 1, 0, 2 * Math.PI);
            ctx.fill();
            continue;
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
        let currVel = particle.getVelocity();
        currVel.normalize();

        // if speed is too close to zero, add a random vector to it
        // if (newSpeed < 0.0004) {
        //     let rand = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
        //     rand.normalize();
        //     rand = Vector.scale(500, rand);
        //     currVel.add(rand);
        // }


        // lerp velocity
        closestVel = Vector.lerp(currVel, closestVel, velLerpFactor);

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

        ctx.beginPath();
        // set color to #e4846f
        ctx.fillStyle = "#b8473d";
        ctx.arc(particle.pos.x, particle.pos.y, 1, 0, 2 * Math.PI);
        ctx.fill();
    }

    // const end = performance.now();

    // console.log('Exec Time: ' + (end - start) + 'ms')
}

setInterval(drawGrid, 1000 / physicsHertz);
