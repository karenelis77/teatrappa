import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { baseSold, playById, showsOf, theaterById } from "./data";

export interface User {
  name: string;
  email: string;
}
export interface Ticket {
  code: string;
  playId: string;
  showId: string;
  qty: number;
  total: number;
  createdAt: number;
}
export interface Review {
  playId: string;
  stars: number;
  text: string;
}
interface State {
  user: User | null;
  guest: boolean;
  favorites: string[];
  tickets: Ticket[];
  reviews: Review[];
  sold: Record<string, number>; // ventas hechas en esta sesión por función
  plan: string | null;
}

const KEY = "teatrappa-demo-v1";
const initial: State = { user: null, guest: false, favorites: [], tickets: [], reviews: [], sold: {}, plan: null };

function load(): State {
  try {
    return { ...initial, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return initial;
  }
}

interface Ctx extends State {
  signIn(u: User): void;
  continueGuest(): void;
  signOut(): void;
  toggleFav(playId: string): void;
  soldFor(showId: string): number;
  capacityFor(showId: string): number;
  buy(showId: string, qty: number): { ok: true; ticket: Ticket } | { ok: false; error: string };
  addReview(r: Review): void;
  subscribe(plan: string | null): void;
  reset(): void;
}

const StoreCtx = createContext<Ctx>(null as never);
export const useStore = () => useContext(StoreCtx);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* modo privado: la demo sigue funcionando en memoria */
    }
  }, [s]);

  const value = useMemo<Ctx>(() => {
    const capacityFor = (showId: string) => theaterById(playById(showId.split("|")[0])!.theaterId).capacity;
    const soldFor = (showId: string) => baseSold(showId, capacityFor(showId)) + (s.sold[showId] || 0);
    return {
      ...s,
      signIn: (user) => setS((p) => ({ ...p, user, guest: false })),
      continueGuest: () => setS((p) => ({ ...p, guest: true })),
      signOut: () => setS((p) => ({ ...p, user: null, guest: false })),
      toggleFav: (id) =>
        setS((p) => ({
          ...p,
          favorites: p.favorites.includes(id) ? p.favorites.filter((f) => f !== id) : [...p.favorites, id],
        })),
      capacityFor,
      soldFor,
      buy: (showId, qty) => {
        const available = capacityFor(showId) - soldFor(showId);
        if (qty < 1) return { ok: false, error: "Selecciona al menos una boleta." };
        // Control de aforo: el teatro no puede exceder su límite.
        if (qty > available) return { ok: false, error: `Solo quedan ${available} boletas para esta función.` };
        const play = playById(showId.split("|")[0])!;
        const discount = s.plan === "premium" ? 0.8 : s.plan === "cultural" ? 0.9 : 1;
        const ticket: Ticket = {
          code: "TA-" + Math.random().toString(36).slice(2, 8).toUpperCase() + "-" + Date.now().toString(36).slice(-4).toUpperCase(),
          playId: play.id,
          showId,
          qty,
          total: Math.round(play.price * qty * discount),
          createdAt: Date.now(),
        };
        setS((p) => ({
          ...p,
          tickets: [ticket, ...p.tickets],
          sold: { ...p.sold, [showId]: (p.sold[showId] || 0) + qty },
        }));
        return { ok: true, ticket };
      },
      addReview: (r) => setS((p) => ({ ...p, reviews: [r, ...p.reviews.filter((x) => x.playId !== r.playId)] })),
      subscribe: (plan) => setS((p) => ({ ...p, plan })),
      reset: () => setS(initial),
    };
  }, [s]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export { showsOf };
