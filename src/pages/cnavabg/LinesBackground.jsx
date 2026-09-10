import React, { useRef, useEffect, useCallback } from "react";

/**
 * CyberSecurityBackground
 * ------------------------------------------------------------------
 * A "security operations center" style live backdrop:
 *   - a faint hex-grid lattice (drawn once to an offscreen canvas)
 *   - drifting network "host" nodes linked by data-flow lines with
 *     a traveling packet pulse along each active edge
 *   - one host occasionally gets "flagged" (amber), then resolves
 *     back to normal — a small detection/remediation narrative
 *     instead of generic decoration
 *   - a slow rotating perimeter scan (conic sweep) anchored in a
 *     corner, like a live monitoring radar
 *   - two narrow columns of faint hex telemetry near the edges,
 *     instead of a full-screen matrix-rain cliché
 *
 * Sits behind page content: fixed, zero pointer-events, negative z-index.
 * Respects prefers-reduced-motion (freezes to a calm static frame).
 *
 * Fixed appearance: this background does NOT read or react to the
 * site's dark/light mode, and it never paints its own opaque page
 * background either. The canvas stays transparent and is composited
 * with mix-blend-mode: screen — so only the bright glowing elements
 * (nodes, links, sweep, telemetry) show up, and they add light on
 * top of whatever is really behind them instead of overriding it.
 * That's what keeps it from "affecting the rest" of the page.
 *
 * Props:
 *   accent   css color string               — overrides the core teal
 *   density  "low" | "auto" | "high"        — node count preset
 */

const PALETTE = {
  grid: "rgba(94, 234, 212, 0.09)",
  telemetry: "rgba(143, 227, 255, 0.22)",
};

const DEFAULT_ACCENT = "#3fd6c4"; // core teal — healthy host / link
const ALERT_COLOR = "#ffb454"; // amber — flagged host
const SWEEP_COLOR = "#8fe3ff"; // pale cyan — scan sweep

const HEX_CHARS = "0123456789ABCDEF";
const HEX_SIZE = 42; // hex-grid cell radius, px

function densityFor(preset, width) {
  const base = width < 640 ? 34 : width < 1200 ? 60 : 90;
  if (preset === "low") return Math.round(base * 0.6);
  if (preset === "high") return Math.round(base * 1.4);
  return base;
}

export default function CyberSecurityBackground({
  accent = DEFAULT_ACCENT,
  density = "auto",
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const resizeTimerRef = useRef(null);

  // Build the static hex-grid lattice once per size, offscreen.
  const buildHexGrid = useCallback((width, height, color) => {
    const hexW = HEX_SIZE * 2;
    const hexH = Math.sqrt(3) * HEX_SIZE;

    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const octx = off.getContext("2d");
    octx.strokeStyle = color;
    octx.lineWidth = 1;

    const drawHex = (cx, cy) => {
      octx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        const x = cx + HEX_SIZE * Math.cos(a);
        const y = cy + HEX_SIZE * Math.sin(a);
        if (i === 0) octx.moveTo(x, y);
        else octx.lineTo(x, y);
      }
      octx.closePath();
      octx.stroke();
    };

    let row = 0;
    for (let y = -hexH; y < height + hexH; y += hexH * 0.75) {
      const xOffset = row % 2 === 0 ? 0 : hexW * 0.75;
      for (let x = -hexW; x < width + hexW; x += hexW * 1.5) {
        drawHex(x + xOffset, y);
      }
      row++;
    }
    return off;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const palette = PALETTE;

    const reduceMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    let reduceMotion = reduceMotionQuery.matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let hexGrid = buildHexGrid(width, height, palette.grid);

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      hexGrid = buildHexGrid(width, height, palette.grid);
      rebuildNodes();
      rebuildColumns();
    };

    // ── Network hosts ──────────────────────────────────────────
    let nodes = [];
    const CONNECT_DIST = 150;

    function rebuildNodes() {
      const count = densityFor(density, width);
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        flagged: false,
      }));
    }

    // ── Telemetry columns (sparse hex glyph streams) ───────────
    let columns = [];

    function rebuildColumns() {
      if (width < 900) {
        columns = [];
        return;
      }
      const fontSize = 13;
      const makeColumn = (x) => ({
        x,
        fontSize,
        drops: Array.from(
          { length: Math.ceil(height / fontSize) + 4 },
          () => Math.random() * -height
        ),
      });
      columns = [makeColumn(width * 0.035), makeColumn(width * 0.965)];
    }

    resizeCanvas();

    const onResize = () => {
      clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(resizeCanvas, 150);
    };
    window.addEventListener("resize", onResize);

    const onMotionChange = (e) => {
      reduceMotion = e.matches;
    };
    reduceMotionQuery.addEventListener?.("change", onMotionChange);

    // ── Pointer influence ───────────────────────────────────────
    const pointer = { x: null, y: null };
    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    // ── Flagged-host narrative ─────────────────────────────────
    let flagTimer = 3000 + Math.random() * 4000;
    let flaggedNode = null;

    function updateFlag(dt) {
      if (reduceMotion) return;
      flagTimer -= dt;
      if (flagTimer <= 0) {
        if (flaggedNode) flaggedNode.flagged = false;
        flaggedNode = nodes[Math.floor(Math.random() * nodes.length)] || null;
        if (flaggedNode) flaggedNode.flagged = true;
        flagTimer = 4000 + Math.random() * 5000;
        setTimeout(() => {
          if (flaggedNode) flaggedNode.flagged = false;
        }, 2200);
      }
    }

    // ── Scan sweep (feature-detected conic gradient) ───────────
    const sweepSupported = typeof ctx.createConicGradient === "function";
    let sweepAngle = 0;
    const sweepAnchor = { x: width * 0.86, y: height * 0.16 };

    function drawSweep() {
      if (!sweepSupported) return;
      const radius = Math.max(width, height) * 0.55;
      const grad = ctx.createConicGradient(
        sweepAngle,
        sweepAnchor.x,
        sweepAnchor.y
      );
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(0.04, hexToRgba(SWEEP_COLOR, 0.1));
      grad.addColorStop(0.09, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.save();
      ctx.beginPath();
      ctx.arc(sweepAnchor.x, sweepAnchor.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
      if (!reduceMotion) sweepAngle += 0.006;
    }

    function hexToRgba(hex, alpha) {
      const v = hex.replace("#", "");
      const r = parseInt(v.substring(0, 2), 16);
      const g = parseInt(v.substring(2, 4), 16);
      const b = parseInt(v.substring(4, 6), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    function drawTelemetry() {
      columns.forEach((col) => {
        ctx.font = `${col.fontSize}px monospace`;
        ctx.fillStyle = palette.telemetry;
        col.drops.forEach((y, i) => {
          const ch = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
          ctx.fillText(ch, col.x, y);
          if (!reduceMotion) {
            col.drops[i] += col.fontSize * 0.6;
            if (col.drops[i] > height && Math.random() > 0.985) {
              col.drops[i] = -col.fontSize;
            }
          }
        });
      });
    }

    let lastTime = performance.now();

    function frame(now) {
      const dt = now - lastTime;
      lastTime = now;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(hexGrid, 0, 0, width, height);

      drawSweep();
      drawTelemetry();
      updateFlag(dt);

      // Hosts: drift + gentle pointer attraction
      nodes.forEach((n) => {
        if (!reduceMotion) {
          if (pointer.x !== null) {
            const dx = pointer.x - n.x;
            const dy = pointer.y - n.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 200 * 200) {
              n.vx += dx * 0.000025;
              n.vy += dy * 0.000025;
            }
          }
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        }
      });

      // Links + traveling packet pulse
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > CONNECT_DIST * CONNECT_DIST) continue;

          const dist = Math.sqrt(distSq);
          const alpha = 1 - dist / CONNECT_DIST;
          const linkColor = a.flagged || b.flagged ? ALERT_COLOR : accent;

          ctx.beginPath();
          ctx.strokeStyle = hexToRgba(linkColor, alpha * 0.35);
          ctx.lineWidth = 0.6;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();

          if (!reduceMotion) {
            const phase = ((now * 0.00035 + i * 37 + j * 13) % 1 + 1) % 1;
            const px = a.x + (b.x - a.x) * phase;
            const py = a.y + (b.y - a.y) * phase;
            ctx.beginPath();
            ctx.arc(px, py, 1.4, 0, Math.PI * 2);
            ctx.fillStyle = hexToRgba(linkColor, alpha * 0.9);
            ctx.fill();
          }
        }
      }

      // Host markers
      nodes.forEach((n) => {
        const color = n.flagged ? ALERT_COLOR : accent;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.flagged ? 2.6 : 1.8, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowBlur = n.flagged ? 18 : 10;
        ctx.shadowColor = color;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimerRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      reduceMotionQuery.removeEventListener?.("change", onMotionChange);
    };
  }, [accent, density, buildHexGrid]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -10,
        pointerEvents: "none",
        background: "transparent",
        mixBlendMode: "screen",
      }}
    />
  );
}