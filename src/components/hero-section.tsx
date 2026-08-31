"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { PostMetadata } from "../lib/blog";

type HeroSectionProps = {
  posts: PostMetadata[];
};

export function HeroSection({ posts }: HeroSectionProps) {
  const welcome = posts.find((post) => post.slug === "welcome-to-ixraellee-journal") ?? posts[0];
  const cardPosts = welcome ? [welcome, ...posts.filter((post) => post.slug !== welcome.slug)].slice(0, 3) : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const pointerTarget = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (cardPosts.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % cardPosts.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [cardPosts.length]);

  useEffect(() => {
    const canvasElement = particleCanvasRef.current;
    const heroElement = heroRef.current;
    if (!canvasElement || !heroElement) return;
    const context = canvasElement.getContext("2d");
    if (!context) return;
    const stableCanvas: HTMLCanvasElement = canvasElement;
    const stableHero: HTMLElement = heroElement;
    const drawingContext: CanvasRenderingContext2D = context;

    const count = 200;
    const particles = Array.from({ length: count }, (_, index) => ({
      angle: (index / count) * Math.PI * 2,
      radius: 40 + ((index * 23) % 340),
      size: 2.0 + ((index * 13) % 10) / 3,
      depth: 0.35 + ((index * 17) % 65) / 100,
      square: index % 4 === 0,
      tone: index % 3,
      baseX: 0,
      baseY: 0,
      x: 0,
      y: 0,
      velocityX: 0,
      velocityY: 0,
    }));

    let animationFrameId: number | null = null;
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    const pointer = { x: 0, y: 0 };
    let particlesInitialized = false;
    const fieldCenter = { x: 0, y: 0 };
    let isVisible = true;

    function resizeCanvas() {
      const bounds = stableHero.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      fieldCenter.x = width * 0.73;
      fieldCenter.y = height * 0.5;
      for (const particle of particles) {
        const spread = Math.sin(indexedNoise(particle.angle) * Math.PI) * 32;
        particle.baseX = fieldCenter.x + Math.cos(particle.angle) * (particle.radius + spread);
        particle.baseY = fieldCenter.y + Math.sin(particle.angle) * (particle.radius + spread) * 0.62;
        if (!particlesInitialized) {
          particle.x = particle.baseX;
          particle.y = particle.baseY;
        }
      }
      particlesInitialized = true;
      stableCanvas.width = width * ratio;
      stableCanvas.height = height * ratio;
      stableCanvas.style.width = `${width}px`;
      stableCanvas.style.height = `${height}px`;
      drawingContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function indexedNoise(value: number) {
      return Math.abs(Math.sin(value * 12.9898) * 43758.5453) % 1;
    }

    const tones = [
      "rgba(30, 64, 175, 0.65)",
      "rgba(37, 99, 235, 0.7)",
      "rgba(15, 23, 42, 0.5)",
    ];

    function render() {
      if (!isVisible) return;

      pointer.x += (pointerTarget.current.x - pointer.x) * 0.16;
      pointer.y += (pointerTarget.current.y - pointer.y) * 0.16;
      drawingContext.clearRect(0, 0, width, height);

      if (pointerTarget.current.active) {
        fieldCenter.x += (pointer.x - fieldCenter.x) * 0.09;
        fieldCenter.y += (pointer.y - fieldCenter.y) * 0.09;
      }

      for (const particle of particles) {
        const breathing = Math.sin(animationFrame / 55 + particle.angle * 5) * (2 + particle.depth * 4);
        const fieldWave = Math.sin(animationFrame / 65 + particle.angle * 3) * (4 + particle.depth * 8);
        const fieldTargetX = fieldCenter.x + Math.cos(particle.angle) * (particle.radius + fieldWave);
        const fieldTargetY = fieldCenter.y + Math.sin(particle.angle) * (particle.radius + fieldWave) * 0.62;
        particle.baseX += (fieldTargetX - particle.baseX) * 0.065;
        particle.baseY += (fieldTargetY - particle.baseY) * 0.065;
        let targetX = particle.baseX;
        let targetY = particle.baseY + breathing;

        if (pointerTarget.current.active) {
          const distanceX = particle.baseX - pointer.x;
          const distanceY = particle.baseY - pointer.y;
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          const influence = Math.max(0, 1 - distance / 280);
          if (influence > 0) {
            const strength = influence * influence * (34 + particle.depth * 36);
            targetX += (distanceX / Math.max(distance, 1)) * strength - distanceY * 0.08 * influence;
            targetY += (distanceY / Math.max(distance, 1)) * strength + distanceX * 0.08 * influence;
          }
        }

        particle.velocityX += (targetX - particle.x) * 0.03;
        particle.velocityY += (targetY - particle.y) * 0.03;
        particle.velocityX *= 0.82;
        particle.velocityY *= 0.82;
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;

        const x = particle.x;
        const y = particle.y;
        const size = particle.size * (0.4 + particle.depth * 1.1);

        drawingContext.save();
        drawingContext.translate(x, y);
        drawingContext.fillStyle = tones[particle.tone];
        if (particle.square) {
          drawingContext.fillRect(-size / 2, -size / 2, size, size);
        } else {
          drawingContext.beginPath();
          drawingContext.arc(0, 0, size / 2, 0, Math.PI * 2);
          drawingContext.fill();
        }
        drawingContext.restore();
      }

      animationFrame += 1;
      animationFrameId = window.requestAnimationFrame(render);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Pause animation when scrolled offscreen to conserve GPU/CPU resources
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry ? entry.isIntersecting : true;
        if (isVisible && !animationFrameId) {
          animationFrameId = window.requestAnimationFrame(render);
        } else if (!isVisible && animationFrameId) {
          window.cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(stableHero);

    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  function updatePointer(event: ReactPointerEvent<HTMLElement>) {
    if (!heroRef.current) return;

    const bounds = heroRef.current.getBoundingClientRect();
    pointerTarget.current = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      active: true,
    };
  }

  function cardPosition(index: number) {
    if (index === activeIndex) return "hero-card-active";
    if (index === (activeIndex + 1) % cardPosts.length) return "hero-card-next";
    return "hero-card-back";
  }

  return (
    <section ref={heroRef} onPointerMove={updatePointer} onPointerEnter={updatePointer} className="hero-section relative min-h-[680px] overflow-hidden border-b border-slate-200 lg:min-h-[735px]">
      <div className="hero-grid absolute inset-0" />
      <div className="hero-glow hero-glow-one absolute left-[42%] top-[20%]" />
      <div className="hero-glow hero-glow-two absolute right-[8%] top-[10%]" />
      <canvas ref={particleCanvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]" />

      <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-5 pb-12 pt-20 sm:px-8 lg:min-h-[735px] lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:pb-16 lg:pt-10">
        <div className="relative order-2 h-[310px] w-full self-end sm:h-[350px] lg:order-2 lg:h-[430px] lg:w-[330px] lg:justify-self-end">
          <div className="absolute bottom-2 right-4 h-16 w-56 rounded-full bg-blue-500/20 blur-3xl" />
          {cardPosts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className={`hero-card group absolute bottom-0 right-0 w-[min(78vw,290px)] overflow-hidden rounded-2xl border border-white/25 ${cardPosition(index)}`}
              aria-label={`Read ${post.title}`}
            >
              <div className="relative h-[270px] sm:h-[300px]">
                <Image src={post.banner} alt={post.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-200">{post.category}</p>
                  <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-white">{post.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/65">{post.excerpt}</p>
                  <span className="mt-4 inline-block border-b border-blue-300 pb-1 text-xs font-bold uppercase tracking-wider text-blue-200">Read story</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="relative order-1 max-w-2xl lg:order-1">
          <p className="hero-kicker text-xs font-bold uppercase tracking-[0.38em] text-blue-700">A  by Ixraellee</p>
          <h1 className="mt-5 font-serif text-5xl font-black leading-[0.98] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">Welcome to Ixraellee Journal</h1>
          <p className="mt-7 max-w-xl text-xl leading-8 text-slate-700 sm:text-2xl">Stories from the life we live, the work we build, and the ideas that keep moving.</p>
          {/* <blockquote className="mt-8 max-w-lg border-l-2 border-blue-600 pl-5 text-base italic leading-7 text-slate-600 sm:text-lg">“A place for paying attention: to people, to places, and to what becomes possible.”</blockquote> */}
          {/* <div className="mt-10 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-slate-500"><span className="h-px w-12 bg-blue-600/70" /> Personal essays · field notes · reflections</div> */}
        </div>
      </div>
    </section>
  );
}
