import { useEffect, useRef } from "react";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let x = 0, y = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
    };
    let raf = 0;
    const loop = () => {
      rx += (x - rx) * 0.15;
      ry += (y - ry) * 0.15;
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 20}px, ${ry - 20}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[999] hidden h-10 w-10 rounded-full border border-[color:var(--gold)]/60 mix-blend-difference md:block" />
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[999] hidden h-2 w-2 rounded-full bg-[color:var(--gold)] md:block" />
    </>
  );
}
