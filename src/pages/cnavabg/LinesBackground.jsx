import React, { useRef, useEffect } from "react";

const LinesBackground = ({ theme = "dark" }) => {
  const canvasRef = useRef(null);
  const matrixRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // ───── Neural Nodes ─────
    const nodes = [];
    const NODE_COUNT = window.innerWidth < 768 ? 50 : 100;

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      });
    }

    const mouse = { x: null, y: null };

    // ───── MATRIX RAIN ─────
    const letters = "01";
    const fontSize = 14;
    const columns = Math.floor(window.innerWidth / fontSize);
    const drops = Array(columns).fill(1);

    const drawMatrix = () => {
      ctx.fillStyle =
        theme === "dark"
          ? "rgba(0, 0, 0, 0.08)"
          : "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.fillStyle = "rgba(0, 255, 150, 0.6)";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    let angle = 0;

    const drawRadar = () => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      ctx.beginPath();
      ctx.arc(cx, cy, 180, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,255,150,0.05)";
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(angle) * 180,
        cy + Math.sin(angle) * 180
      );

      ctx.strokeStyle = "rgba(0,255,150,0.3)";
      ctx.stroke();

      angle += 0.03;
    };

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      drawMatrix();
      drawRadar();

      const color = "rgba(0,255,150,0.8)";

      // ───── Nodes ─────
      nodes.forEach((n) => {
        if (mouse.x !== null) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = dx * dx + dy * dy;

          if (dist < 180 * 180) {
            n.vx += dx * 0.00003;
            n.vy += dy * 0.00003;
          }
        }

        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > window.innerWidth) n.vx *= -1;
        if (n.y < 0 || n.y > window.innerHeight) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.fill();
      });

      ctx.shadowBlur = 0;

      // ───── Connections ─────
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = dx * dx + dy * dy;

          if (dist < 150 * 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,255,150,${
              1 - Math.sqrt(dist) / 150
            })`;

            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    const move = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return (
    <>
      {/* glitch overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(circle, rgba(0,255,150,0.05) 0%, transparent 70%)",
          zIndex: -11,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -10,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

export default LinesBackground;