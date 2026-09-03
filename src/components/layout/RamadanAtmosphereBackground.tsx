import React, { useRef, useEffect } from 'react';

interface RamadanBackgroundProps {
  theme?: 'dark' | 'light';
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  alphaSpeed: number;
  isSparkle: boolean;
}

interface Moon {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  rotation: number;
  alpha: number;
}

interface Lantern {
  x: number;
  y: number;
  width: number;
  height: number;
  stringLength: number;
  swaySpeed: number;
  swayAngle: number;
  floatSpeed: number;
  glowIntensity: number;
  glowSpeed: number;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
}

export default function RamadanAtmosphereBackground({ theme = 'dark' }: RamadanBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const isDark = theme === 'dark';

    // ─── 1. Stars Setup ────────────────────────────────────────────────────────
    const starCount = window.innerWidth < 768 ? 40 : 80;
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.8,
        size: Math.random() * 2 + 0.8,
        alpha: Math.random(),
        alphaSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        isSparkle: Math.random() > 0.75,
      });
    }

    // ─── 2. Floating Crescent Moons ──────────────────────────────────────────
    const moonCount = window.innerWidth < 768 ? 2 : 4;
    const moons: Moon[] = [];
    for (let i = 0; i < moonCount; i++) {
      moons.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 8 + 10,
        speedY: (Math.random() * 0.15 + 0.05) * -1,
        speedX: Math.random() * 0.1 - 0.05,
        rotation: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.3,
      });
    }

    // ─── 3. Hanging & Floating Ramadan Lanterns (Fanous) ─────────────────────
    const lanternCount = window.innerWidth < 768 ? 3 : 6;
    const lanterns: Lantern[] = [];
    for (let i = 0; i < lanternCount; i++) {
      lanterns.push({
        x: (window.innerWidth / (lanternCount + 1)) * (i + 1) + (Math.random() - 0.5) * 60,
        y: Math.random() * (window.innerHeight * 0.4) + 40,
        width: Math.random() * 6 + 18,
        height: Math.random() * 10 + 26,
        stringLength: Math.random() * 80 + 30,
        swaySpeed: Math.random() * 0.015 + 0.008,
        swayAngle: Math.random() * Math.PI * 2,
        floatSpeed: Math.random() * 0.01 + 0.005,
        glowIntensity: Math.random() * 0.5 + 0.5,
        glowSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    // ─── 4. Gold Dust Particles ────────────────────────────────────────────────
    const particleCount = window.innerWidth < 768 ? 25 : 50;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() * -0.4) - 0.1,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ─── Helpers: Draw 4-Point Star Sparkle ────────────────────────────────────
    const drawStarSparkle = (cx: number, cy: number, size: number, opacity: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.translate(cx, cy);
      const color = isDark ? `rgba(251, 191, 36, ${opacity})` : `rgba(217, 119, 6, ${opacity * 0.6})`;
      ctx.fillStyle = color;
      ctx.shadowColor = isDark ? 'rgba(245, 158, 11, 0.8)' : 'rgba(217, 119, 6, 0.4)';
      ctx.shadowBlur = size * 3;

      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.lineTo(0, size * 2.5);
        ctx.lineTo(size * 0.4, size * 0.4);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // ─── Helpers: Draw Crescent Moon ───────────────────────────────────────────
    const drawCrescentMoon = (x: number, y: number, r: number, alpha: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);

      const color = isDark ? `rgba(253, 230, 138, ${alpha})` : `rgba(217, 119, 6, ${alpha * 0.5})`;
      ctx.fillStyle = color;
      ctx.shadowColor = isDark ? 'rgba(245, 158, 11, 0.6)' : 'rgba(217, 119, 6, 0.3)';
      ctx.shadowBlur = r * 1.5;

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2, false);
      ctx.arc(r * 0.35, -r * 0.2, r * 0.8, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // ─── Helpers: Draw Ramadan Fanous (Lantern) ──────────────────────────────
    const drawLantern = (l: Lantern) => {
      l.swayAngle += l.swaySpeed;
      l.glowIntensity += Math.sin(l.swayAngle * 2) * 0.005;
      const currentSway = Math.sin(l.swayAngle) * 8;

      const topX = l.x;
      const topY = 0;
      const lanternX = l.x + currentSway;
      const lanternY = l.y;

      ctx.save();

      // 1. Hanging String
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.lineTo(lanternX, lanternY - l.height / 2);
      ctx.strokeStyle = isDark ? 'rgba(217, 119, 6, 0.3)' : 'rgba(180, 83, 9, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. Outer Lantern Ambient Glow
      const glowRadius = l.width * 2.5;
      const glowGrad = ctx.createRadialGradient(lanternX, lanternY, 2, lanternX, lanternY, glowRadius);
      if (isDark) {
        glowGrad.addColorStop(0, `rgba(251, 191, 36, ${0.4 * l.glowIntensity})`);
        glowGrad.addColorStop(0.5, `rgba(245, 158, 11, ${0.15 * l.glowIntensity})`);
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        glowGrad.addColorStop(0, `rgba(217, 119, 6, ${0.25 * l.glowIntensity})`);
        glowGrad.addColorStop(0.5, `rgba(245, 158, 11, ${0.08 * l.glowIntensity})`);
        glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(lanternX, lanternY, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Top Handle Ring & Cap
      const strokeColor = isDark ? 'rgba(251, 191, 36, 0.85)' : 'rgba(180, 83, 9, 0.7)';
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = isDark ? 'rgba(245, 158, 11, 0.9)' : 'rgba(217, 119, 6, 0.8)';
      ctx.lineWidth = 1.5;

      // Top Ring
      ctx.beginPath();
      ctx.arc(lanternX, lanternY - l.height / 2 - 4, 3, 0, Math.PI * 2);
      ctx.stroke();

      // Top Dome Cap
      ctx.beginPath();
      ctx.moveTo(lanternX - l.width * 0.4, lanternY - l.height * 0.35);
      ctx.lineTo(lanternX + l.width * 0.4, lanternY - l.height * 0.35);
      ctx.lineTo(lanternX, lanternY - l.height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 4. Glass Lantern Body (Hexagonal Shape)
      const w = l.width / 2;
      const h = l.height / 2;

      ctx.beginPath();
      ctx.moveTo(lanternX, lanternY - h * 0.7);
      ctx.lineTo(lanternX + w, lanternY - h * 0.2);
      ctx.lineTo(lanternX + w * 0.8, lanternY + h * 0.6);
      ctx.lineTo(lanternX - w * 0.8, lanternY + h * 0.6);
      ctx.lineTo(lanternX - w, lanternY - h * 0.2);
      ctx.closePath();

      // Inner Flame Glass Fill
      const glassGrad = ctx.createLinearGradient(lanternX, lanternY - h, lanternX, lanternY + h);
      if (isDark) {
        glassGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
        glassGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.9)');
        glassGrad.addColorStop(1, 'rgba(217, 119, 6, 0.85)');
      } else {
        glassGrad.addColorStop(0, 'rgba(253, 230, 138, 0.9)');
        glassGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.85)');
        glassGrad.addColorStop(1, 'rgba(180, 83, 9, 0.8)');
      }
      ctx.fillStyle = glassGrad;
      ctx.shadowColor = isDark ? 'rgba(251, 191, 36, 0.9)' : 'rgba(217, 119, 6, 0.5)';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.stroke();

      // Inner Flame Core
      ctx.beginPath();
      ctx.arc(lanternX, lanternY, w * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fill();

      // 5. Bottom Base & Tassel
      ctx.beginPath();
      ctx.moveTo(lanternX - w * 0.6, lanternY + h * 0.6);
      ctx.lineTo(lanternX + w * 0.6, lanternY + h * 0.6);
      ctx.lineTo(lanternX + w * 0.3, lanternY + h * 0.8);
      ctx.lineTo(lanternX - w * 0.3, lanternY + h * 0.8);
      ctx.closePath();
      ctx.fillStyle = strokeColor;
      ctx.fill();

      // Bottom Tassel Threads
      ctx.beginPath();
      ctx.moveTo(lanternX, lanternY + h * 0.8);
      ctx.lineTo(lanternX, lanternY + h * 0.8 + 6);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();
    };

    // ─── Main Animation Loop ───────────────────────────────────────────────────
    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Ambient Background Halo Overlay
      const bgGrad = ctx.createRadialGradient(
        window.innerWidth / 2,
        window.innerHeight * 0.25,
        50,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerWidth * 0.75
      );

      if (isDark) {
        bgGrad.addColorStop(0, 'rgba(245, 158, 11, 0.07)');
        bgGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.03)');
        bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        bgGrad.addColorStop(0, 'rgba(251, 191, 36, 0.05)');
        bgGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.02)');
        bgGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // 2. Draw Twinkling Stars & Sparkles
      stars.forEach((s) => {
        s.alpha += s.alphaSpeed;
        if (s.alpha >= 1 || s.alpha <= 0.1) {
          s.alphaSpeed *= -1;
        }

        const opacity = Math.max(0.1, Math.min(1, s.alpha));

        if (s.isSparkle) {
          drawStarSparkle(s.x, s.y, s.size, opacity);
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? `rgba(254, 240, 138, ${opacity * 0.8})`
            : `rgba(217, 119, 6, ${opacity * 0.4})`;
          ctx.fill();
        }
      });

      // 3. Draw Floating Crescent Moons
      moons.forEach((m) => {
        m.y += m.speedY;
        m.x += m.speedX;

        // Wrap around top/bottom edges
        if (m.y < -30) {
          m.y = window.innerHeight + 30;
          m.x = Math.random() * window.innerWidth;
        }

        drawCrescentMoon(m.x, m.y, m.radius, m.alpha, m.rotation);
      });

      // 4. Draw Hanging & Floating Lanterns
      lanterns.forEach((l) => {
        drawLantern(l);
      });

      // 5. Draw Gold Dust Particles
      particles.forEach((p) => {
        // Subtle mouse repulsion effect
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = window.innerHeight;
          p.x = Math.random() * window.innerWidth;
        }
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(251, 191, 36, ${p.alpha * 0.7})`
          : `rgba(217, 119, 6, ${p.alpha * 0.35})`;
        ctx.shadowColor = isDark ? 'rgba(245, 158, 11, 0.6)' : 'rgba(217, 119, 6, 0.2)';
        ctx.shadowBlur = 4;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <>
      {/* Subtle Ramadan ambient radial vignette */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            theme === 'dark'
              ? 'radial-gradient(ellipse at 50% 15%, rgba(245, 158, 11, 0.06) 0%, rgba(0, 0, 0, 0) 75%)'
              : 'radial-gradient(ellipse at 50% 15%, rgba(251, 191, 36, 0.04) 0%, rgba(255, 255, 255, 0) 75%)',
          zIndex: -11,
          pointerEvents: 'none',
        }}
      />

      {/* Canvas Element */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -10,
          pointerEvents: 'none',
        }}
      />
    </>
  );
}
