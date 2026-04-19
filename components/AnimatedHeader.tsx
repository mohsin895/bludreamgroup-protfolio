'use client';

import { useEffect, useRef } from 'react';

interface Point {
    x: number;
    y: number;
    originX: number;
    originY: number;
    active: number;
    closest: Point[];
    circle: CircleObj;
    _startX: number;
    _startY: number;
    _targetX: number;
    _targetY: number;
    _progress: number;
    _duration: number;
}

interface CircleObj {
    pos: Point;
    radius: number;
    active: number;
    draw: () => void;
}

export default function AnimatedHeader({ children }: { children?: React.ReactNode }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const state = {
            points: [] as Point[],
            target: { x: 0, y: 0 },
            width: 0,
            height: 0,
            rafId: 0,
            lastTime: 0,
            ctx: null as CanvasRenderingContext2D | null,
        };

        const ctx = canvas.getContext('2d')!;
        state.ctx = ctx;

        // ── helpers ──────────────────────────────────────────────────────────────

        function getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
            return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
        }

        function circEaseInOut(t: number) {
            t *= 2;
            if (t < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
            t -= 2;
            return 0.5 * (Math.sqrt(1 - t * t) + 1);
        }

        function makeCircle(pos: Point, rad: number): CircleObj {
            const circle: CircleObj = {
                pos,
                radius: rad,
                active: 0,
                draw() {
                    if (!circle.active) return;
                    ctx.beginPath();
                    ctx.arc(circle.pos.x, circle.pos.y, circle.radius, 0, 2 * Math.PI, false);
                    ctx.fillStyle = `rgba(156,217,249,${circle.active})`;
                    ctx.fill();
                },
            };
            return circle;
        }

        // ── init ─────────────────────────────────────────────────────────────────

        function init() {
            const W = window.innerWidth;
            const H = window.innerHeight;
            state.width = W;
            state.height = H;
            state.target = { x: W / 2, y: H / 2 };

            canvas.width = W;
            canvas.height = H;

            state.points = [];

            const cols = 20;
            const rows = 20;

            for (let x = 0; x < W; x += W / cols) {
                for (let y = 0; y < H; y += H / rows) {
                    const px = x + Math.random() * (W / cols);
                    const py = y + Math.random() * (H / rows);
                    const p = {
                        x: px, originX: px,
                        y: py, originY: py,
                        active: 0,
                        closest: [] as Point[],
                        circle: null as unknown as CircleObj,
                        _startX: px, _startY: py,
                        _targetX: px, _targetY: py,
                        _progress: 1,
                        _duration: 1,
                    } as Point;
                    state.points.push(p);
                }
            }

            for (let i = 0; i < state.points.length; i++) {
                const closest: Point[] = [];
                const p1 = state.points[i];
                for (let j = 0; j < state.points.length; j++) {
                    const p2 = state.points[j];
                    if (p1 === p2) continue;
                    let placed = false;
                    for (let k = 0; k < 5; k++) {
                        if (!placed && closest[k] == null) {
                            closest[k] = p2;
                            placed = true;
                        }
                    }
                    for (let k = 0; k < 5; k++) {
                        if (!placed && getDistance(p1, p2) < getDistance(p1, closest[k])) {
                            closest[k] = p2;
                            placed = true;
                        }
                    }
                }
                p1.closest = closest;
                p1.circle = makeCircle(p1, 2 + Math.random() * 2);
            }

            for (const p of state.points) startShift(p);
        }

        // ── wandering tween ───────────────────────────────────────────────────────

        function startShift(p: Point) {
            p._startX = p.x;
            p._startY = p.y;
            p._targetX = p.originX - 50 + Math.random() * 100;
            p._targetY = p.originY - 50 + Math.random() * 100;
            p._progress = 0;
            p._duration = 1000 + Math.random() * 1000;
        }

        function tickPoint(p: Point, dt: number) {
            if (p._progress >= 1) { startShift(p); return; }
            p._progress = Math.min(1, p._progress + dt / p._duration);
            const e = circEaseInOut(p._progress);
            p.x = p._startX + (p._targetX - p._startX) * e;
            p.y = p._startY + (p._targetY - p._startY) * e;
        }

        // ── draw ─────────────────────────────────────────────────────────────────

        function drawLines(p: Point) {
            if (!p.active) return;
            for (const neighbour of p.closest) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(neighbour.x, neighbour.y);
                ctx.strokeStyle = `rgba(156,217,249,${p.active})`;
                ctx.stroke();
            }
        }

        // ── animation loop — always runs, no scroll gate ──────────────────────────

        function animate(time: number) {
            const dt = state.lastTime ? time - state.lastTime : 16;
            state.lastTime = time;

            ctx.clearRect(0, 0, state.width, state.height);

            for (const p of state.points) {
                tickPoint(p, dt);

                const dist = getDistance(state.target, p);
                if (dist < 4000)       { p.active = 0.3;  p.circle.active = 0.6; }
                else if (dist < 20000) { p.active = 0.1;  p.circle.active = 0.3; }
                else if (dist < 40000) { p.active = 0.02; p.circle.active = 0.1; }
                else                   { p.active = 0;    p.circle.active = 0;   }

                drawLines(p);
                p.circle.draw();
            }

            state.rafId = requestAnimationFrame(animate);
        }

        // ── events ────────────────────────────────────────────────────────────────

        function onMouseMove(e: MouseEvent) {
            state.target.x = e.clientX;
            state.target.y = e.clientY;
        }

        function onResize() {
            state.width = window.innerWidth;
            state.height = window.innerHeight;
            canvas.width = state.width;
            canvas.height = state.height;
            // Re-init points on resize so they cover the new dimensions
            init();
        }

        const isTouchDevice = 'ontouchstart' in window;
        if (!isTouchDevice) window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', onResize);

        init();
        state.rafId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(state.rafId);
            if (!isTouchDevice) window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <>
            {/* Fixed canvas sits behind everything — pointer-events: none so clicks pass through */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            />
            {/* All page content renders on top */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                {children}
            </div>
        </>
    );
}