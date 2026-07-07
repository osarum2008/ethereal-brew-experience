import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, useReducedMotion, useMotionTemplate } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Cursor } from "@/components/site/Cursor";
import { CartProvider, CartButton, useCart } from "@/components/site/Cart";

import heroCup from "@/assets/hero-cup.jpg";
import ambience from "@/assets/ambience.jpg";
import gal1 from "@/assets/gallery-1.jpg";
import gal2 from "@/assets/gallery-2.jpg";
import gal3 from "@/assets/gallery-3.jpg";
import gal4 from "@/assets/gallery-4.jpg";

import roseLatte from "@/assets/uploads/IMG_9981.jpg.asset.json";
import kinderMocha from "@/assets/uploads/IMG_9979.jpg.asset.json";
import iceCream from "@/assets/uploads/IMG_9975.jpg.asset.json";
import strawberryBoba from "@/assets/uploads/IMG_9969.jpg.asset.json";
import icedLatte from "@/assets/uploads/IMG_9970.jpg.asset.json";
import taroBoba from "@/assets/uploads/IMG_9962.jpg.asset.json";
import walnutFrappe from "@/assets/uploads/IMG_9984.jpg.asset.json";
import flatWhite from "@/assets/uploads/IMG_9991.jpg.asset.json";
import heartLatte from "@/assets/uploads/IMG_9983.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Coffee Shopfi — Experience Coffee Beyond Imagination" },
      { name: "description", content: "Karachi's luxury coffee house. Premium espresso, signature frappes, matcha, boba tea and desserts crafted with passion." },
      { property: "og:title", content: "Coffee Shopfi — Boost Your Mind" },
      { property: "og:description", content: "A cinematic coffee experience on Service Road, Karachi. Signature drinks, artisan pastries, and unforgettable flavor." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

/* ---------------- utilities ---------------- */

function useMouseGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    const onMove = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);
  return { x, y };
}

function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[color:var(--gold)]">
      <span className="h-px w-10 bg-[color:var(--gold)]/60" />
      {children}
    </div>
  );
}

/* ---------------- Nav ---------------- */

const NAV = ["Menu", "Signature", "Gallery", "Journey", "Reserve", "Contact"];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", s);
    return () => window.removeEventListener("scroll", s);
  }, []);
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.2 }}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}
    >
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10 ${scrolled ? "glass-strong rounded-full py-3 md:mx-6" : ""}`}>
        <a href="#top" className="group flex items-center gap-2">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--gold)]/50">
            <span className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-[color:var(--gold)]/40" />
            <span className="text-gold-gradient font-display text-lg leading-none">C</span>
          </span>
          <span className="font-display text-lg tracking-widest text-cream">COFFEE <span className="text-gold-gradient">SHOPFI</span></span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a key={n} href={`#${n.toLowerCase()}`} className="group relative text-xs uppercase tracking-[0.25em] text-cream/80 transition hover:text-cream">
              {n}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[color:var(--gold)] transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <CartButton className="hidden sm:inline-flex" />
          <a href="#reserve" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[color:var(--gold)]/50 px-5 py-2 text-xs uppercase tracking-[0.25em] text-cream transition hover:text-[#090909]">
            <span className="absolute inset-0 -translate-x-full bg-[color:var(--gold)] transition-transform duration-500 group-hover:translate-x-0" />
            <span className="relative">Reserve</span>
          </a>
        </div>
      </div>
    </motion.header>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 80, damping: 15 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 80, damping: 15 });

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] overflow-hidden"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}>
      {/* Background ambience */}
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <img src={ambience} alt="" className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090909]/60 via-[#090909]/70 to-[#090909]" />
      </motion.div>

      {/* Moving lights */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-[color:var(--gold)]/10 blur-[120px]" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-[color:var(--coffee)]/40 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-[color:var(--chocolate)]/40 blur-[120px]" />
      </div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 pt-32 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <Reveal>
              <div className="mb-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[color:var(--gold)]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--gold)] shadow-[0_0_20px_var(--gold)]" />
                Est. Karachi · Boost Your Mind
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display text-[13vw] leading-[0.9] tracking-tight text-cream md:text-[6.5rem]">
                Experience <br />
                <span className="italic text-gold-gradient">Coffee</span> Beyond
                <br /> Imagination
              </h1>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/70 md:text-lg">
                Every cup tells a story — crafted with passion, premium beans, and unforgettable flavors. A cinematic coffee sanctuary on Service Road, Karachi.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <MagneticButton primary href="#menu">Explore Menu</MagneticButton>
                <MagneticButton href="#reserve">Reserve Table</MagneticButton>
              </div>
            </Reveal>
            <Reveal delay={0.55}>
              <div className="mt-14 grid max-w-md grid-cols-3 divide-x divide-[color:var(--gold)]/20">
                {[
                  ["12+", "Signature Drinks"],
                  ["4.9", "Guest Rating"],
                  ["24/7", "Aroma"],
                ].map(([n, l]) => (
                  <div key={l} className="px-4 first:pl-0">
                    <div className="font-display text-3xl text-gold-gradient">{n}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-cream/50">{l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Rotating cup */}
          <motion.div style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }} className="relative mx-auto aspect-square w-full max-w-[520px]">
            <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-[color:var(--gold)]/25" />
            <div className="absolute inset-8 rounded-full border border-[color:var(--gold)]/10" />
            <div className="absolute inset-0 rounded-full bg-[color:var(--gold)]/10 blur-3xl" />
            {/* steam */}
            <div className="pointer-events-none absolute left-1/2 top-1/4 h-40 w-40 -translate-x-1/2">
              {[0, 1, 2, 3].map((i) => (
                <span key={i}
                  className="absolute left-1/2 top-0 h-24 w-24 rounded-full bg-white/10 blur-2xl"
                  style={{ animation: `steam 5s ${i * 1.2}s ease-out infinite` }} />
              ))}
            </div>
            <motion.img
              src={heroCup}
              alt="Signature Coffee Shopfi cup with rising steam"
              className="relative z-10 h-full w-full rounded-full object-cover shadow-[0_60px_120px_-30px_rgba(212,175,55,0.35)]"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 60, ease: "linear", repeat: Infinity }}
              width={1536} height={1536}
            />
            {/* floating beans */}
            {[
              { t: "5%", l: "10%", d: 0 },
              { t: "70%", l: "-5%", d: 1.2 },
              { t: "20%", l: "95%", d: 2 },
              { t: "80%", l: "80%", d: 0.6 },
            ].map((b, i) => (
              <span key={i}
                className="absolute h-4 w-6 rounded-full bg-gradient-to-br from-[#5c2e1f] to-[#2a120a] shadow-[0_10px_30px_rgba(0,0,0,0.6)] animate-float-slow"
                style={{ top: b.t, left: b.l, animationDelay: `${b.d}s` }} />
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.5em] text-cream/40">
          <div className="flex flex-col items-center gap-2">
            <span>Scroll</span>
            <span className="h-10 w-px animate-pulse bg-gradient-to-b from-[color:var(--gold)] to-transparent" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function MagneticButton({ children, href, primary }: { children: React.ReactNode; href: string; primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  return (
    <motion.a
      ref={ref} href={href} style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 text-xs uppercase tracking-[0.3em] transition ${
        primary
          ? "bg-[color:var(--gold)] text-[#090909] magnetic-glow"
          : "gold-border text-cream hover:text-[color:var(--gold)]"
      }`}
    >
      <span className="relative">{children}</span>
      <span className="relative">→</span>
    </motion.a>
  );
}

/* ---------------- Marquee ---------------- */

function Marquee() {
  const items = ["Espresso", "Frappes", "Matcha", "Signature Latte", "Boba Tea", "Desserts", "Bakery", "Mocktails"];
  return (
    <div className="border-y border-[color:var(--gold)]/15 bg-black/40 py-8">
      <div className="flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee gap-16 pr-16">
          {[...items, ...items].map((i, k) => (
            <span key={k} className="whitespace-nowrap font-display text-4xl italic text-cream/40 md:text-6xl">
              {i} <span className="text-gold-gradient not-italic">✦</span>
            </span>
          ))}
        </div>
        <div className="flex shrink-0 animate-marquee gap-16 pr-16" aria-hidden>
          {[...items, ...items].map((i, k) => (
            <span key={k} className="whitespace-nowrap font-display text-4xl italic text-cream/40 md:text-6xl">
              {i} <span className="text-gold-gradient not-italic">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- About ---------------- */

function About() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-2 md:px-10">
        <Reveal>
          <SectionLabel>The Story</SectionLabel>
          <h2 className="font-display text-5xl leading-[1.05] text-cream md:text-7xl">
            A ritual, poured in <span className="italic text-gold-gradient">gold</span>.
          </h2>
          <p className="mt-8 text-cream/70 md:text-lg">
            Coffee Shopfi began with a single obsession — to elevate the ordinary cup into a cinematic experience. From single-origin espresso to velvety matcha and hand-crafted frappes, every recipe is engineered for delight.
          </p>
          <p className="mt-4 text-cream/60">
            Nestled on Service Road, Karachi, our space is dark, warm, and dressed in brass. A sanctuary for those who taste with intention.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              ["Single Origin", "Ethically sourced beans"],
              ["Slow Roast", "Small-batch craftsmanship"],
              ["Artisan Pours", "Signature latte art"],
            ].map(([t, s]) => (
              <div key={t} className="rounded-2xl border border-[color:var(--gold)]/15 bg-white/[0.02] p-4">
                <div className="font-display text-lg text-cream">{t}</div>
                <div className="mt-1 text-[11px] uppercase tracking-widest text-cream/50">{s}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <img src={roseLatte.url} alt="Rose latte with cardamom and cinnamon" className="h-full w-full scale-105 object-cover transition-transform duration-[3000ms] hover:scale-110" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.3em] text-[color:var(--gold)]">Signature</div>
                <div className="font-display text-2xl text-cream">Rose Cardamom Latte</div>
              </div>
              <div className="rounded-full glass px-4 py-2 text-xs text-cream">Rs 590</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Menu ---------------- */

type Item = {
  name: string; price: string; desc: string; cal: string; ingredients: string[]; img: string; tag?: string;
};

const MENU: { title: string; items: Item[] }[] = [
  {
    title: "Signature Coffee",
    items: [
      { name: "Royal Spanish Latte", price: "550", desc: "Silky condensed milk kissed with double espresso — Coffee Shopfi's signature.", cal: "310 kcal", ingredients: ["Espresso", "Condensed milk", "Steamed milk", "Vanilla"], img: heartLatte.url, tag: "Best Seller" },
      { name: "Flavor Burst Cappuccino", price: "550", desc: "A dense crema hero — pulled thick, dusted with cocoa.", cal: "180 kcal", ingredients: ["Double espresso", "Micro-foam", "Cocoa"], img: flatWhite.url, tag: "Chef's Pick" },
      { name: "Hot Chocolate Grand", price: "750", desc: "Melted Belgian chocolate, cream, and a whisper of sea salt.", cal: "420 kcal", ingredients: ["Belgian chocolate", "Whole milk", "Cream", "Sea salt"], img: kinderMocha.url },
    ],
  },
  {
    title: "Cold & Frappes",
    items: [
      { name: "Iced Silk Latte", price: "500 / 650", desc: "Cold-pressed espresso layered over silk-textured oat milk.", cal: "210 kcal", ingredients: ["Cold brew", "Oat milk", "Ice"], img: icedLatte.url },
      { name: "Praline Signature Frappe", price: "800 / 990", desc: "Blended espresso, hazelnut praline, whipped cloud and caramel drizzle.", cal: "480 kcal", ingredients: ["Espresso", "Praline", "Milk", "Caramel", "Whip"], img: walnutFrappe.url, tag: "New" },
      { name: "Strawberry Pink Pearl Boba", price: "300 / 450 / 600", desc: "Fresh strawberry pearls suspended in a rose-hued milk cloud.", cal: "260 kcal", ingredients: ["Strawberry", "Milk", "Popping boba", "Ice"], img: strawberryBoba.url },
    ],
  },
  {
    title: "Matcha & Tea",
    items: [
      { name: "Zen Green Matcha", price: "600 / 750", desc: "Ceremonial-grade matcha whisked with steamed milk.", cal: "180 kcal", ingredients: ["Matcha", "Milk", "Cane sugar"], img: gal3, tag: "Signature" },
      { name: "Lotus Creamy Matcha", price: "750 / 950", desc: "Matcha, biscoff crumble and vanilla cream in one immersive sip.", cal: "340 kcal", ingredients: ["Matcha", "Lotus biscoff", "Cream", "Milk"], img: taroBoba.url },
      { name: "Peach Iced Tea", price: "400 / 550", desc: "White peach infusion over crystal ice with a citrus twist.", cal: "120 kcal", ingredients: ["Black tea", "Peach", "Lemon", "Ice"], img: gal4 },
    ],
  },
];

function Menu() {
  const [tab, setTab] = useState(0);
  return (
    <section id="menu" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <SectionLabel>The Menu</SectionLabel>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <h2 className="font-display text-5xl leading-[1] text-cream md:text-7xl">
              Crafted like <span className="italic text-gold-gradient">couture</span>.
            </h2>
            <div className="flex flex-wrap gap-2">
              {MENU.map((s, i) => (
                <button key={s.title} onClick={() => setTab(i)}
                  className={`rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.3em] transition ${
                    tab === i ? "bg-[color:var(--gold)] text-[#090909]" : "gold-border text-cream/70 hover:text-cream"
                  }`}>
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="mt-16 grid gap-8 md:grid-cols-3">
            {MENU[tab].items.map((it, i) => (
              <MenuCard key={it.name} item={it} delay={i * 0.08} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function MenuCard({ item, delay }: { item: Item; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 15 });
  const [fav, setFav] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // stable pseudo-rating from name (4.5 – 5.0)
  const seed = item.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rating = 4.5 + ((seed % 6) / 10);
  const reviews = 40 + (seed % 260);
  const basePrice = parseInt(item.price.replace(/[^0-9]/g, "").slice(0, 3) || "0", 10);
  const total = basePrice * qty;

  const { add } = useCart();
  const handleAdd = () => {
    add({ id: item.name, name: item.name, price: basePrice || 0, img: item.img }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
        onMouseMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => { mx.set(0); my.set(0); }}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[color:var(--gold)]/15 bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent p-3 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)] transition-shadow duration-500 hover:border-[color:var(--gold)]/40 hover:shadow-[0_40px_80px_-30px_rgba(212,175,55,0.35),0_0_0_1px_rgba(212,175,55,0.15)_inset]"
      >
        {/* Image */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[22px]">
          <img
            src={item.img}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.12]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(60% 40% at 50% 100%, rgba(212,175,55,0.25), transparent 70%)" }} />

          {item.tag && (
            <span className="absolute left-4 top-4 rounded-full glass-strong px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[color:var(--gold)]">
              {item.tag}
            </span>
          )}

          <button
            onClick={() => setFav(!fav)}
            aria-label="Add to wishlist"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full glass-strong text-cream transition hover:scale-110 active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={fav ? "var(--gold)" : "none"} stroke={fav ? "var(--gold)" : "currentColor"} strokeWidth="1.6">
              <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
            </svg>
          </button>

          {/* ingredients on hover */}
          <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex flex-wrap gap-1">
              {item.ingredients.slice(0, 4).map((g) => (
                <span key={g} className="rounded-full glass px-2 py-1 text-[10px] text-cream/85">{g}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => {
                const fill = Math.max(0, Math.min(1, rating - i));
                return (
                  <div key={i} className="relative h-3.5 w-3.5">
                    <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "rgba(212,175,55,0.3)" }}>
                      <path d="M12 2.5l2.9 6.3 6.6.7-4.9 4.6 1.4 6.6L12 17.4 6 20.7l1.4-6.6L2.5 9.5l6.6-.7L12 2.5z" />
                    </svg>
                    <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="var(--gold)">
                        <path d="M12 2.5l2.9 6.3 6.6.7-4.9 4.6 1.4 6.6L12 17.4 6 20.7l1.4-6.6L2.5 9.5l6.6-.7L12 2.5z" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
            <span className="text-[11px] text-cream/70">{rating.toFixed(1)}</span>
            <span className="text-[10px] text-cream/40">({reviews})</span>
          </div>

          {/* Title + price */}
          <div className="mt-3 flex items-start justify-between gap-4">
            <h3 className="font-display text-2xl leading-tight text-cream">{item.name}</h3>
            <div className="text-right">
              <div className="font-display text-xl text-gold-gradient">Rs {item.price}</div>
              <div className="text-[10px] uppercase tracking-widest text-cream/40">{item.cal}</div>
            </div>
          </div>

          <p className="mt-2 line-clamp-2 text-sm text-cream/60">{item.desc}</p>

          {/* Qty + Add to cart */}
          <div className="mt-auto flex items-center gap-3 pt-6">
            <div className="flex items-center gap-1 rounded-full border border-[color:var(--gold)]/25 bg-black/30 p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-8 w-8 items-center justify-center rounded-full text-cream/80 transition hover:bg-[color:var(--gold)]/15 hover:text-[color:var(--gold)] active:scale-90"
              >−</button>
              <span className="w-6 text-center text-sm tabular-nums text-cream">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                aria-label="Increase quantity"
                className="flex h-8 w-8 items-center justify-center rounded-full text-cream/80 transition hover:bg-[color:var(--gold)]/15 hover:text-[color:var(--gold)] active:scale-90"
              >+</button>
            </div>
            <button
              onClick={handleAdd}
              className="group/btn relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-[color:var(--gold)] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[#090909] shadow-[0_10px_30px_-10px_rgba(212,175,55,0.7)] transition hover:brightness-110 active:scale-[0.98]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 4h2l2.4 12.1a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.5L21 8H6" />
                <circle cx="10" cy="20" r="1.4" />
                <circle cx="17" cy="20" r="1.4" />
              </svg>
              <span>{added ? "Added" : basePrice ? `Add · Rs ${total}` : "Add to Cart"}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Journey (horizontal-feel) ---------------- */

function Journey() {
  const steps = [
    { n: "01", t: "Sourced", d: "Ethically farmed single-origin beans from the highlands." },
    { n: "02", t: "Roasted", d: "Slow-batch profile roasting to develop deep aromatics." },
    { n: "03", t: "Pulled", d: "9-bar espresso extraction with precision timing." },
    { n: "04", t: "Poured", d: "Micro-foam artistry — a signature Shopfi finish." },
  ];
  return (
    <section id="journey" className="relative overflow-hidden py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--coffee)]/25 blur-[160px]" />
      </div>
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <SectionLabel>Coffee Journey</SectionLabel>
          <h2 className="max-w-3xl font-display text-5xl leading-[1] text-cream md:text-7xl">
            From bean to <span className="italic text-gold-gradient">brilliance</span>.
          </h2>
        </Reveal>
        <div className="relative mt-20 grid gap-8 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-[color:var(--gold)]/40 to-transparent md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="relative">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full glass-strong">
                  <span className="font-display text-lg text-gold-gradient">{s.n}</span>
                </div>
                <div className="font-display text-2xl text-cream">{s.t}</div>
                <p className="mt-2 text-sm text-cream/60">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Signature spotlight ---------------- */

function Signature() {
  return (
    <section id="signature" className="relative overflow-hidden py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-[1fr_1.1fr] md:items-center md:px-10">
        <Reveal>
          <div className="relative">
            <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[color:var(--gold)]/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem]">
              <img src={iceCream.url} alt="Coffee Shopfi ice cream cups" className="w-full object-cover" loading="lazy" />
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <SectionLabel>Chef Recommendations</SectionLabel>
          <h2 className="font-display text-5xl leading-[1] text-cream md:text-6xl">
            The Ice Cream <span className="italic text-gold-gradient">Chapter</span>
          </h2>
          <p className="mt-6 text-cream/70 md:text-lg">
            Five flavors, one obsession. Chocolate, pistachio, strawberry, mango and vanilla — churned in-house, served in Shopfi's iconic emerald cups.
          </p>
          <div className="mt-8 space-y-3">
            {[
              ["Belgian Chocolate", "480"],
              ["Pistachio Rose", "520"],
              ["Alphonso Mango", "480"],
              ["Madagascar Vanilla", "450"],
            ].map(([t, p]) => (
              <div key={t} className="flex items-center justify-between border-b border-[color:var(--gold)]/15 pb-3">
                <span className="font-display text-xl text-cream">{t}</span>
                <span className="text-gold-gradient">Rs {p}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Gallery ---------------- */

function Gallery() {
  const imgs = [
    { src: gal1, span: "row-span-2" },
    { src: kinderMocha.url, span: "" },
    { src: roseLatte.url, span: "" },
    { src: gal2, span: "" },
    { src: walnutFrappe.url, span: "row-span-2" },
    { src: heartLatte.url, span: "" },
    { src: taroBoba.url, span: "" },
    { src: gal4, span: "" },
  ];
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section id="gallery" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <SectionLabel>Gallery</SectionLabel>
          <h2 className="font-display text-5xl leading-[1] text-cream md:text-7xl">
            Moments in <span className="italic text-gold-gradient">motion</span>.
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-3">
          {imgs.map((i, k) => (
            <motion.button key={k}
              initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.8, delay: k * 0.05 }}
              onClick={() => setOpen(i.src)}
              className={`group relative overflow-hidden rounded-2xl ${i.span}`}>
              <img src={i.src} alt="Coffee Shopfi" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="absolute bottom-3 left-3 translate-y-2 text-xs uppercase tracking-[0.3em] text-cream opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">View →</div>
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 backdrop-blur-xl"
            onClick={() => setOpen(null)}>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              src={open} alt="" className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------------- Reviews ---------------- */

function Reviews() {
  const reviews = [
    { n: "Sana K.", r: "The Royal Spanish Latte is a religious experience. Interiors feel like Milan.", a: "SK" },
    { n: "Bilal M.", r: "Best coffee in Karachi, and it isn't close. The frappes are dessert-tier.", a: "BM" },
    { n: "Ayesha R.", r: "Cinematic ambience, staff who care, and a matcha that actually tastes like matcha.", a: "AR" },
    { n: "Hassan T.", r: "Their Praline Frappe should be illegal. I'm here every weekend now.", a: "HT" },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [reviews.length]);
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-5xl px-6 text-center md:px-10">
        <Reveal>
          <SectionLabel><span className="mx-auto">Guest Book</span></SectionLabel>
          <h2 className="font-display text-4xl leading-[1] text-cream md:text-6xl">
            Loved by <span className="italic text-gold-gradient">Karachi's</span> finest palates.
          </h2>
        </Reveal>
        <div className="relative mt-16 min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.blockquote key={i}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
              className="glass-strong mx-auto max-w-3xl rounded-3xl p-10">
              <div className="mb-4 flex justify-center gap-1 text-[color:var(--gold)]">
                {"★★★★★".split("").map((s, k) => <span key={k}>{s}</span>)}
              </div>
              <p className="font-display text-2xl italic leading-relaxed text-cream md:text-3xl">"{reviews[i].r}"</p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--gold)] text-[#090909] text-xs font-semibold">{reviews[i].a}</div>
                <div className="text-sm uppercase tracking-[0.3em] text-cream/70">{reviews[i].n}</div>
              </div>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {reviews.map((_, k) => (
            <button key={k} onClick={() => setI(k)}
              className={`h-1 rounded-full transition-all ${k === i ? "w-10 bg-[color:var(--gold)]" : "w-4 bg-cream/20"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Reservation / Contact ---------------- */

function Reserve() {
  return (
    <section id="reserve" className="relative overflow-hidden py-32">
      <div className="pointer-events-none absolute inset-0">
        <img src={ambience} alt="" className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090909] via-[#090909]/70 to-[#090909]" />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-2 md:px-10">
        <Reveal>
          <SectionLabel>Reservation</SectionLabel>
          <h2 className="font-display text-5xl leading-[1] text-cream md:text-7xl">
            Reserve your <span className="italic text-gold-gradient">table</span>.
          </h2>
          <p className="mt-6 max-w-md text-cream/70">
            An intimate seat by candlelight, a cup poured just for you. Book in seconds — we'll confirm on WhatsApp.
          </p>
          <div className="mt-10 space-y-5">
            <ContactRow label="Address" value="Service Road, Karachi, Pakistan" />
            <ContactRow label="Phone" value="+92 331 3696335" href="tel:+923313696335" />
            <ContactRow label="Hours" value="Daily · 10:00 AM – 2:00 AM" />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="https://wa.me/923313696335" className="inline-flex items-center gap-2 rounded-full bg-[#25D366]/90 px-5 py-3 text-xs uppercase tracking-[0.3em] text-[#090909] transition hover:scale-105">
              WhatsApp
            </a>
            <a href="tel:+923313696335" className="inline-flex items-center gap-2 gold-border rounded-full px-5 py-3 text-xs uppercase tracking-[0.3em] text-cream transition hover:text-[color:var(--gold)]">
              Call Now
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <form onSubmit={(e) => e.preventDefault()} className="glass-strong space-y-5 rounded-3xl p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Name" placeholder="Your name" />
              <Field label="Phone" placeholder="+92 ..." />
            </div>
            <Field label="Email" placeholder="you@email.com" />
            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Date" type="date" />
              <Field label="Time" type="time" />
              <Field label="Guests" placeholder="2" />
            </div>
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-cream/50">Occasion</label>
              <textarea rows={3} placeholder="Anniversary, birthday, quiet study..."
                className="w-full resize-none rounded-xl border border-[color:var(--gold)]/20 bg-black/40 px-4 py-3 text-sm text-cream outline-none transition focus:border-[color:var(--gold)]" />
            </div>
            <button className="magnetic-glow w-full rounded-full bg-[color:var(--gold)] py-4 text-xs uppercase tracking-[0.3em] text-[#090909] transition hover:brightness-110">
              Confirm Reservation
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-cream/50">{label}</label>
      <input {...p} className="w-full rounded-xl border border-[color:var(--gold)]/20 bg-black/40 px-4 py-3 text-sm text-cream outline-none transition focus:border-[color:var(--gold)]" />
    </div>
  );
}

function ContactRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const C = href ? "a" : "div";
  return (
    <C {...(href ? { href } : {})} className="flex items-start justify-between border-b border-[color:var(--gold)]/15 pb-4">
      <div className="text-[10px] uppercase tracking-[0.3em] text-cream/40">{label}</div>
      <div className="text-right font-display text-lg text-cream">{value}</div>
    </C>
  );
}

/* ---------------- Contact map ---------------- */

function MapSection() {
  return (
    <section id="contact" className="relative">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-[color:var(--gold)]/15">
          <iframe
            title="Coffee Shopfi location"
            src="https://www.google.com/maps?q=Service+Road+Karachi&output=embed"
            className="h-[420px] w-full grayscale invert-[0.9] contrast-125"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[color:var(--gold)]/20" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

function FAQ() {
  const faqs = [
    ["Do you take reservations?", "Yes — book via the form above or WhatsApp us at +92 331 3696335."],
    ["Are drinks available in Large?", "Most cold coffees, matchas and frappes are served in Regular and Large."],
    ["Do you offer dairy-free options?", "We serve oat, almond and lactose-free milk. Ask your barista."],
    ["Is there parking on Service Road?", "Ample on-street parking directly outside the café."],
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <Reveal>
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="font-display text-4xl leading-[1] text-cream md:text-6xl">Everything you'd like to <span className="italic text-gold-gradient">know</span>.</h2>
        </Reveal>
        <div className="mt-14 divide-y divide-[color:var(--gold)]/15 border-y border-[color:var(--gold)]/15">
          {faqs.map(([q, a], i) => (
            <button key={q} onClick={() => setOpen(open === i ? -1 : i)}
              className="block w-full py-6 text-left">
              <div className="flex items-center justify-between gap-6">
                <span className="font-display text-xl text-cream md:text-2xl">{q}</span>
                <span className="text-2xl text-[color:var(--gold)] transition"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
              </div>
              <AnimatePresence>
                {open === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 overflow-hidden text-cream/60">{a}</motion.p>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[color:var(--gold)]/15 pt-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <h3 className="font-display text-6xl leading-[0.95] text-cream md:text-[10rem]">
            Coffee <span className="italic text-gold-gradient">Shopfi</span>
          </h3>
        </Reveal>
        <div className="mt-16 grid gap-10 border-t border-[color:var(--gold)]/15 py-10 md:grid-cols-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-cream/40">Visit</div>
            <div className="mt-3 font-display text-lg text-cream">Service Road<br />Karachi, Pakistan</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-cream/40">Contact</div>
            <a href="tel:+923313696335" className="mt-3 block font-display text-lg text-cream hover:text-[color:var(--gold)]">+92 331 3696335</a>
            <a href="https://wa.me/923313696335" className="text-sm text-cream/60 hover:text-[color:var(--gold)]">WhatsApp</a>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-cream/40">Explore</div>
            <ul className="mt-3 space-y-1 text-cream/70">
              {NAV.map((n) => <li key={n}><a href={`#${n.toLowerCase()}`} className="hover:text-[color:var(--gold)]">{n}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-cream/40">Newsletter</div>
            <form onSubmit={(e) => e.preventDefault()} className="mt-3 flex overflow-hidden rounded-full border border-[color:var(--gold)]/25">
              <input placeholder="Your email" className="flex-1 bg-transparent px-4 py-2 text-sm text-cream outline-none" />
              <button className="bg-[color:var(--gold)] px-4 text-xs uppercase tracking-[0.3em] text-[#090909]">Join</button>
            </form>
            <div className="mt-5 flex gap-3">
              {["IG", "FB", "TT"].map((s) => (
                <a key={s} href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--gold)]/25 text-[10px] uppercase tracking-widest text-cream/70 hover:text-[color:var(--gold)]">{s}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[color:var(--gold)]/15 py-6 text-[10px] uppercase tracking-[0.3em] text-cream/40 md:flex-row">
          <span>© {new Date().getFullYear()} Coffee Shopfi · Boost Your Mind</span>
          <span>Crafted in Karachi</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Scroll progress ---------------- */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const w = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return <motion.div style={{ width: w }} className="fixed left-0 top-0 z-[60] h-[2px] bg-gradient-to-r from-[color:var(--gold)] via-[color:var(--gold-soft)] to-[color:var(--gold)]" />;
}

/* ---------------- Mouse glow ---------------- */

function MouseGlow() {
  const { x, y } = useMouseGlow();
  const sx = useSpring(x, { stiffness: 60, damping: 20 });
  const sy = useSpring(y, { stiffness: 60, damping: 20 });
  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[5] hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--gold)]/10 blur-[120px] md:block"
      style={{ x: sx, y: sy }}
    />
  );
}

/* ---------------- Root ---------------- */

function Landing() {
  return (
    <CartProvider>
      <main className="relative min-h-screen overflow-hidden bg-[#090909] text-cream">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <Cursor />
        <MouseGlow />
        <ScrollProgress />
        <Nav />
        <Hero />
        <Marquee />
        <About />
        <Menu />
        <Signature />
        <Journey />
        <Gallery />
        <Reviews />
        <Reserve />
        <MapSection />
        <FAQ />
        <Footer />
        <div className="fixed bottom-5 right-5 z-40 sm:hidden">
          <CartButton />
        </div>
      </main>
    </CartProvider>
  );
}
