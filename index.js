import crel from 'crel';

const el = crel.proxy;

import {matrix, normalizePage} from './util';

const w = DEBUG ? window : w;

var c_canvas;
var c_context;
const c_width = window.innerWidth;
const c_height = window.innerHeight;

const sqSize = 22;
var period = 20;
w.period = period;

var g_grid;
const g_width = Math.floor(c_width / sqSize);
const g_height = Math.floor(c_height / sqSize) + 1;

var l_line;
var redraw;

w.DEBUG = DEBUG;

w.w = w;
w.matrix = matrix;


var playing = 1;
var frame = 0;

class Line {
    constructor (w, l = null) {
        this.w = w;
        if (l === null) {
            this.l = matrix(0, [w]);
        } else {
            this.l = l;
        }
    } // b n a
    rule110 () {
        const w = this.w;
        return new Line(w, this.l.map((now, i) => {
            const before = this.l[(i + 1) % w];
            const after  = this.l[(i + w - 1) % w];
            return +(now != before || now == 1 && after == 0);
        }));
    }
}

class Grid {
    constructor (w, h, g = null) {
        this.w = w;
        this.h = h;
        if (g === null) {
            this.g = matrix(0, [h, w])
        } else {
            this.g = g;
        }
    }

    draw (sqSize, y_offset, more = false) {
        const ctx = c_context;

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, this.w * sqSize, this.h * sqSize);

        ctx.fillStyle = "#000000";
        for (let ky in Array(this.h).fill(0)) {
            for (let kx in Array(this.w).fill(0)) {
                //ctx.fillStyle = this.g[ky][kx] ? "#000000" : "#FFFFFF";
                if (this.g[ky][kx]) {
                    ctx.fillRect(kx * sqSize, ky * sqSize + y_offset, sqSize, sqSize);
                }
            }
        }
        if (more) {
            for (let kx in Array(this.w).fill(0)) {
                var ky = this.h;
                //ctx.fillStyle = this.g[ky - 1][kx] ? "#000000" : "#FFFFFF";
                if (this.g[ky - 1][kx]) {
                    ctx.fillRect(kx * sqSize, ky * sqSize + y_offset, sqSize, sqSize);
                }
            }
        }
    }
}

function clickEventListener(ev) {
    w.ev = ev;
    const x = ev.clientX;
    let kx = Math.floor(x / sqSize);
    l_line.l[kx] ^= 1;
    if (!playing) {
        if (redraw) redraw();
    }
}

function keyUpEventListener(ev) {
    w.ev = ev;
    playing ^= 1;
    if (playing) {
        requestAnimationFrame(window.d); // /!\ Not well managed. May cause d to be requested twice.
    }
}


// window.setup = function () {

//     normalizePage();

//     c_canvas = createCanvas(c_width, c_height);
//     l_line = new Line(g_width);
//     l_line.l[0] = 1;
//     g_grid = new Grid(g_width, g_height);
//     g_grid.g[g_height - 1] = l_line;
    
//     w.ll = l_line;
//     w.gg = g_grid;
// };

window.s = function () {

    normalizePage();

    c_canvas = el.canvas({
        "width": c_width,
        "height": c_height,
        "style": "position: absolute;",
    });
    c_canvas.addEventListener("click", clickEventListener);
    window.addEventListener("keyup", keyUpEventListener);

    c_context = c_canvas.getContext("2d");

    document.body.appendChild(c_canvas);


    l_line = new Line(g_width);
    l_line.l[g_width - 1] = 1;
    g_grid = new Grid(g_width, g_height);
    g_grid.g[g_height - 1] = l_line;

    w.ll = l_line;
    w.gg = g_grid;
};

window.update = function () {
    if (frame % period == 0) {
        g_grid.g.shift();
        l_line = l_line.rule110();
        g_grid.g.push(l_line.l);
    }
};

window.draw = function () {
    period = w.period;
    ++frame;
    let y_offset = - (frame % period) / period * sqSize;
    window.update();
    redraw = () => {
        g_grid.draw(sqSize, y_offset, true);
    }
    redraw();
};

window.d = function () {
    window.draw();
    if (playing) {
        requestAnimationFrame(window.d);
    }
};

// require('p5');
window.s()
window.d();