// Frameworks
import React, { useRef, useEffect } from 'react';
import * as _ from 'lodash';

// https://codepen.io/plasm/pen/zwjMPy
class Particle {
    constructor(canvas, options) {
        this.canvas = canvas;
        this.x = _.random(0, options.width);
        this.y = _.random(0, options.height);
        this.s = (3 + Math.random());
        this.a = 0;
        this.w = options.width;
        this.h = options.height;
        this.radius = 0.5 + Math.random() * 20;
        this.color  = this.radius > 5 ? '#ff006c' : '#ff417d'
    }

    render() {
        this.canvas.beginPath();
        this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.canvas.lineWidth = 2;
        this.canvas.fillStyle = this.color;
        this.canvas.fill();
        this.canvas.closePath();
    }

    move() {
        this.x += Math.cos(this.a) * this.s;
        this.y += Math.sin(this.a) * this.s;
        this.a += Math.random() * 0.8 - 0.4;

        if (this.x < 0 || this.x > this.w - this.radius) {
            return false;
        }

        if (this.y < 0 || this.y > this.h - this.radius) {
            return false;
        }
        this.render();
        return true;
    }
}

function ParticleText({ text, width, height, fontSize, lineHeight }) {
    const canvasRef = useRef(null);

    let c1;
    let c2;
    let c3 = {};
    let particles = [];
    let frequency = 15;
    let aspectRatio = 1;
    let xPadding = 40;

    // Responsive Size Correction
    if (width > window.innerWidth - xPadding) {
        width = window.innerWidth - xPadding;
        aspectRatio = (height / (width + xPadding));
        height *= aspectRatio;
        fontSize *= (aspectRatio - 0.05);
        lineHeight *= aspectRatio;
    }

    useEffect(() => {
        c1 = createCanvas();
        c1.context.clearRect(0, 0, width, height);

        c2 = createCanvas();
        c2.context.clearRect(0, 0, width, height);

        c3.canvas = canvasRef.current;
        c3.canvas.width = width;
        c3.canvas.height = height;
        c3.context = c3.canvas.getContext('2d');
        c3.context.clearRect(0, 0, width, height);

        writeText(c2.canvas, c2.context, text);

        setInterval(populate, frequency);
        update();

    }, []);

    function createCanvas() {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext('2d');
        return {
            canvas: canvas,
            context: context
        }
    }

    function writeText(canvas, context, text){
        context.font = `bold ${fontSize}px Montserrat`;
        context.fillStyle = '#111111';
        context.textAlign = 'center';
        const lines = text.split('\\n');
        const offset = (lineHeight > fontSize) ? ((lineHeight - fontSize)) : 0;
        const cW = canvas.width / 2;
        const cH = canvas.height / 2;
        for (let i = 0; i < lines.length; i++) {
            context.fillText(lines[i], cW, cH + ((lineHeight - offset) * i));
        }
    }

    function maskCanvas() {
        c3.context.drawImage(c2.canvas, 0, 0, c2.canvas.width, c2.canvas.height);
        c3.context.globalCompositeOperation = 'source-atop';
        c3.context.drawImage(c1.canvas, 0, 0);
        blur(c1.canvas, c1.context, 2)
    }

    function blur(canvas, context, amt) {
        context.filter = `blur(${amt}px)`;
        context.drawImage(canvas, 0, 0);
        context.filter = 'none';
    }

    function populate() {
        particles.push(
            new Particle(c1.context, {width, height})
        );
    }

    function clear() {
        c1.context.globalAlpha = 0.03;
        c1.context.fillStyle = '#111111';
        c1.context.fillRect(0, 0, c1.canvas.width, c1.canvas.height);
        c1.context.globalAlpha = 1;
    }

    function update() {
        clear();
        particles = particles.filter(p => p.move());
        maskCanvas();
        requestAnimationFrame(update)
    }

    return (
        <div>
            <canvas ref={canvasRef} />
        </div>
    );
}

export { ParticleText };
