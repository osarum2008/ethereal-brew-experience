import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Minus, Plus, Trash2, ShoppingBag, X, ArrowRight, Tag, Truck, Coffee } from "lucide-react";

export type CartItem = {
  id: string;
  name: string;
  price: number; // base numeric price (Rs)
  img: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  isOpen: boolean;
  count: number;
  subtotal: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const add: CartCtx["add"] = (item, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) return prev.map((p) => (p.id === item.id ? { ...p, qty: Math.min(99, p.qty + qty) } : p));
      return [...prev, { ...item, qty }];
    });
    setIsOpen(true);
  };
  const remove = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, Math.min(99, qty)) } : p)));
  const clear = () => setItems([]);

  const { count, subtotal } = useMemo(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
    return { count, subtotal };
  }, [items]);

  return (
    <Ctx.Provider
      value={{ items, add, remove, setQty, clear, open: () => setIsOpen(true), close: () => setIsOpen(false), isOpen, count, subtotal }}
    >
      {children}
      <CartDrawer />
    </Ctx.Provider>
  );
}

/* ----------------- Floating trigger button ----------------- */
export function CartButton({ className = "" }: { className?: string }) {
  const { open, count } = useCart();
  return (
    <button
      onClick={open}
      aria-label="Open cart"
      className={`group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--gold)]/40 bg-black/40 text-cream backdrop-blur transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] ${className}`}
    >
      <ShoppingBag size={16} />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--gold)] px-1 text-[10px] font-semibold text-[#090909]"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ----------------- Coupons ----------------- */
const COUPONS: Record<string, { pct?: number; flat?: number; label: string }> = {
  SHOPFI10: { pct: 10, label: "10% off" },
  GOLD20: { pct: 20, label: "20% off" },
  FREESHIP: { flat: 0, label: "Free delivery" },
  KARACHI50: { flat: 50, label: "Rs 50 off" },
};

const DELIVERY_FEE = 149;
const FREE_DELIVERY_THRESHOLD = 1500;

/* ----------------- Drawer ----------------- */
function CartDrawer() {
  const { items, isOpen, close, remove, setQty, subtotal, clear } = useCart();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{ code: string; discount: number; label: string; freeShip: boolean } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const baseDelivery = subtotal >= FREE_DELIVERY_THRESHOLD || items.length === 0 ? 0 : DELIVERY_FEE;
  const delivery = applied?.freeShip ? 0 : baseDelivery;
  const discount = applied?.discount ?? 0;
  const total = Math.max(0, subtotal - discount) + delivery;

  const applyCoupon = () => {
    setErr(null);
    const key = code.trim().toUpperCase();
    const c = COUPONS[key];
    if (!c) { setErr("Invalid coupon code"); return; }
    const disc = c.pct ? Math.round((subtotal * c.pct) / 100) : (c.flat && c.flat > 0 ? c.flat : 0);
    setApplied({ code: key, discount: disc, label: c.label, freeShip: key === "FREESHIP" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            className="fixed right-0 top-0 z-[101] flex h-[100dvh] w-full max-w-[440px] flex-col border-l border-[color:var(--gold)]/20 bg-[#0b0908] shadow-[0_0_80px_rgba(0,0,0,0.8)]"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[color:var(--gold)]/15 px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--gold)]/40">
                  <ShoppingBag size={15} className="text-[color:var(--gold)]" />
                </span>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--gold)]">Your Cart</div>
                  <div className="font-display text-lg text-cream">{items.length} {items.length === 1 ? "item" : "items"}</div>
                </div>
              </div>
              <button onClick={close} aria-label="Close cart" className="flex h-9 w-9 items-center justify-center rounded-full text-cream/70 transition hover:bg-white/5 hover:text-cream">
                <X size={18} />
              </button>
            </div>

            {/* Items or empty */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <EmptyState onContinue={close} />
              ) : (
                <ul className="flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {items.map((it) => (
                      <motion.li
                        key={it.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 26 }}
                        className="group relative flex gap-3 overflow-hidden rounded-2xl border border-[color:var(--gold)]/10 bg-white/[0.03] p-3"
                      >
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                          <img src={it.img} alt={it.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="truncate font-display text-base text-cream">{it.name}</div>
                              <div className="text-[10px] uppercase tracking-widest text-cream/40">Rs {it.price} each</div>
                            </div>
                            <button
                              onClick={() => remove(it.id)}
                              aria-label="Remove item"
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-cream/40 transition hover:bg-destructive/20 hover:text-destructive"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1 rounded-full border border-[color:var(--gold)]/20 bg-black/40 p-0.5">
                              <button onClick={() => setQty(it.id, it.qty - 1)} aria-label="Decrease" className="flex h-7 w-7 items-center justify-center rounded-full text-cream/80 transition hover:bg-[color:var(--gold)]/15 hover:text-[color:var(--gold)]">
                                <Minus size={12} />
                              </button>
                              <span className="w-6 text-center text-xs tabular-nums text-cream">{it.qty}</span>
                              <button onClick={() => setQty(it.id, it.qty + 1)} aria-label="Increase" className="flex h-7 w-7 items-center justify-center rounded-full text-cream/80 transition hover:bg-[color:var(--gold)]/15 hover:text-[color:var(--gold)]">
                                <Plus size={12} />
                              </button>
                            </div>
                            <div className="font-display text-base text-gold-gradient">Rs {it.price * it.qty}</div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Summary */}
            {items.length > 0 && (
              <div className="border-t border-[color:var(--gold)]/15 bg-black/40 px-6 py-5">
                {/* Free-delivery progress */}
                {baseDelivery > 0 ? (
                  <div className="mb-4">
                    <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-widest text-cream/60">
                      <span className="flex items-center gap-1.5"><Truck size={12} className="text-[color:var(--gold)]" /> Free delivery at Rs {FREE_DELIVERY_THRESHOLD}</span>
                      <span>Rs {FREE_DELIVERY_THRESHOLD - subtotal} to go</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[color:var(--gold)] to-[color:var(--gold-soft)]"
                        initial={false}
                        animate={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 flex items-center gap-2 rounded-full border border-[color:var(--gold)]/25 bg-[color:var(--gold)]/10 px-3 py-1.5 text-[11px] text-[color:var(--gold)]">
                    <Truck size={12} /> You've unlocked free delivery
                  </div>
                )}

                {/* Coupon */}
                <div className="mb-4">
                  {applied ? (
                    <div className="flex items-center justify-between rounded-xl border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/8 px-3 py-2">
                      <div className="flex items-center gap-2 text-xs text-cream">
                        <Tag size={13} className="text-[color:var(--gold)]" />
                        <span className="font-medium">{applied.code}</span>
                        <span className="text-cream/60">— {applied.label}</span>
                      </div>
                      <button onClick={() => setApplied(null)} className="text-[11px] text-cream/60 hover:text-cream">Remove</button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" />
                          <input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                            placeholder="Coupon code (try SHOPFI10)"
                            className="w-full rounded-full border border-[color:var(--gold)]/20 bg-black/40 py-2.5 pl-9 pr-3 text-xs text-cream placeholder:text-cream/30 focus:border-[color:var(--gold)]/60 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={applyCoupon}
                          className="rounded-full border border-[color:var(--gold)]/50 px-4 text-[11px] uppercase tracking-[0.25em] text-cream transition hover:bg-[color:var(--gold)] hover:text-[#090909]"
                        >
                          Apply
                        </button>
                      </div>
                      {err && <div className="mt-1.5 pl-2 text-[11px] text-destructive">{err}</div>}
                    </div>
                  )}
                </div>

                {/* Totals */}
                <dl className="space-y-1.5 text-sm">
                  <Row label="Subtotal" value={`Rs ${subtotal}`} />
                  {discount > 0 && <Row label="Discount" value={`− Rs ${discount}`} accent />}
                  <Row label="Delivery" value={delivery === 0 ? "Free" : `Rs ${delivery}`} />
                  <div className="my-2 h-px bg-[color:var(--gold)]/15" />
                  <div className="flex items-baseline justify-between">
                    <dt className="text-xs uppercase tracking-[0.3em] text-cream/70">Grand Total</dt>
                    <dd className="font-display text-2xl text-gold-gradient">Rs {total}</dd>
                  </div>
                </dl>

                {/* Actions */}
                <div className="mt-5 flex flex-col gap-2">
                  <button className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[color:var(--gold)] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#090909] shadow-[0_15px_40px_-15px_rgba(212,175,55,0.9)] transition hover:brightness-110 active:scale-[0.99]">
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    Checkout · Rs {total}
                    <ArrowRight size={14} />
                  </button>
                  <div className="flex items-center justify-between">
                    <button onClick={close} className="text-[11px] uppercase tracking-[0.25em] text-cream/70 transition hover:text-cream">
                      ← Continue Shopping
                    </button>
                    <button onClick={clear} className="text-[11px] uppercase tracking-[0.25em] text-cream/40 transition hover:text-destructive">
                      Clear cart
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-cream/60">{label}</dt>
      <dd className={accent ? "text-[color:var(--gold)]" : "text-cream"}>{value}</dd>
    </div>
  );
}

function EmptyState({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-10 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 -z-10 rounded-full bg-[color:var(--gold)]/10 blur-2xl" />
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-28 w-28 items-center justify-center rounded-full border border-[color:var(--gold)]/30 bg-white/[0.02]"
        >
          <Coffee size={40} className="text-[color:var(--gold)]" />
        </motion.div>
        {/* steam */}
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-2 h-6 w-1 -translate-x-1/2 rounded-full bg-cream/30 blur-sm"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -40, opacity: [0, 0.6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
            style={{ marginLeft: (i - 1) * 8 }}
          />
        ))}
      </motion.div>
      <h3 className="font-display text-2xl text-cream">Your cup is empty</h3>
      <p className="mt-2 max-w-xs text-sm text-cream/60">Fill it with something warm — a signature latte, an iced frappe, or a matcha ritual.</p>
      <button
        onClick={onContinue}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)]/50 px-6 py-2.5 text-[11px] uppercase tracking-[0.3em] text-cream transition hover:bg-[color:var(--gold)] hover:text-[#090909]"
      >
        Browse Menu <ArrowRight size={14} />
      </button>
    </div>
  );
}
