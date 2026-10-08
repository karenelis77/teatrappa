import { useState, type ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import type { Play, Theater } from "./data";
import { activeDatesLabel, money, theaterById } from "./data";
import { useStore } from "./store";

export function Logo({ small }: { small?: boolean }) {
  return (
    <span className={"logo" + (small ? " small" : "")}>
      <svg viewBox="0 0 48 48" width={small ? 26 : 56} height={small ? 26 : 56} aria-hidden>
        <rect x="3" y="3" width="42" height="42" rx="10" fill="#fff" />
        <path d="M10 10h28v4c-4 0-6 5-6 12h-3c0-7-2-12-5-12s-5 5-5 12h-3c0-7-2-12-6-12z" fill="#7b2fbe" />
        <path d="M10 38h28" stroke="#7b2fbe" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span>
        Teatr<b>APPa</b>
      </span>
    </span>
  );
}

export function Poster({ play, tall }: { play: Pick<Play, "hue" | "emoji" | "title">; tall?: boolean }) {
  return (
    <div
      className={"poster" + (tall ? " tall" : "")}
      style={{
        background: `radial-gradient(circle at 30% 20%, hsl(${play.hue} 80% 55%), hsl(${play.hue + 30} 60% 22%) 70%, #12081f)`,
      }}
    >
      <span className="poster-emoji">{play.emoji}</span>
    </div>
  );
}

export function PlayCard({ play }: { play: Play }) {
  const t = theaterById(play.theaterId);
  return (
    <Link to={`/obras/${play.id}`} className="card play-card">
      <Poster play={play} />
      <div className="card-body">
        <div className="title">{play.title}</div>
        <div className="muted">
          {t.name} · {play.genre}
        </div>
        <div className="row between">
          <span className="rating">★ {play.rating.toFixed(1)}</span>
          <span className="price">desde {money(play.price).replace(" COP", "")}</span>
        </div>
      </div>
    </Link>
  );
}

export function PlayRow({ play }: { play: Play }) {
  return (
    <Link to={`/obras/${play.id}`} className="card row-card">
      <Poster play={play} />
      <div className="card-body">
        <div className="title">{play.title}</div>
        <div className="muted">{play.genre}</div>
        <div className="muted small">{activeDatesLabel(play)}</div>
        <span className="btn small">Ver obra</span>
      </div>
    </Link>
  );
}

export function TheaterCard({ t }: { t: Theater }) {
  return (
    <div className="card theater-card">
      <div
        className="facade"
        style={{ background: `linear-gradient(135deg, hsl(${t.hue} 70% 45%), hsl(${t.hue + 40} 60% 18%))` }}
      >
        <span>🏛️</span>
      </div>
      <div className="card-body">
        <div className="title">{t.name}</div>
        <div className="muted">📍 {t.zone}</div>
        <Link className="btn small" to={`/teatros/${t.id}`}>
          Ver teatro
        </Link>
      </div>
    </div>
  );
}

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="section">
      <div className="row between">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Stars({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          className={n <= Math.round(value) ? "on" : ""}
          onClick={() => onChange?.(n)}
          aria-label={`${n} estrellas`}
        >
          ★
        </button>
      ))}
    </span>
  );
}

const MENU = [
  { to: "/teatros", icon: "🏛️", label: "Teatros" },
  { to: "/generos", icon: "🎭", label: "Géneros" },
  { to: "/id", icon: "🪪", label: "Mi ID" },
  { to: "/favoritos", icon: "❤️", label: "Favoritos" },
  { to: "/suscripciones", icon: "⭐", label: "Suscripciones" },
  { to: "/ajustes", icon: "⚙️", label: "Ajustes" },
];

export function Shell({ back, title }: { back?: boolean; title?: string }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user, guest, signOut } = useStore();
  const isHome = pathname === "/home";
  return (
    <div className="app">
      <header className="topbar">
        {back ? (
          <button className="icon-btn" onClick={() => nav(-1)} aria-label="Volver">
            ‹
          </button>
        ) : (
          <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Abrir menú">
            ☰
          </button>
        )}
        {title && !isHome ? <span className="topbar-title">{title}</span> : <Logo small />}
        <button className="icon-btn" aria-label="Notificaciones" onClick={() => alert("Sin notificaciones nuevas")}>
          🔔
        </button>
      </header>

      {open && (
        <div className="drawer-backdrop" onClick={() => setOpen(false)}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <div className="avatar">{user ? user.name[0].toUpperCase() : "👤"}</div>
              <div>
                <b>{user ? user.name : "Invitado"}</b>
                <div className="muted small">{user ? user.email : guest ? "Explorando sin cuenta" : ""}</div>
              </div>
            </div>
            {MENU.map((m) => (
              <NavLink key={m.to} to={m.to} className="drawer-item" onClick={() => setOpen(false)}>
                <span>{m.icon}</span> {m.label}
              </NavLink>
            ))}
            <div className="drawer-sep" />
            <NavLink to="/dashboard" className="drawer-item" onClick={() => setOpen(false)}>
              <span>📊</span> Panel del teatro <em>demo</em>
            </NavLink>
            <button
              className="drawer-item"
              onClick={() => {
                signOut();
                nav("/auth");
              }}
            >
              <span>🚪</span> {user ? "Cerrar sesión" : "Iniciar sesión"}
            </button>
          </aside>
        </div>
      )}

      <main className="content">
        <Outlet />
      </main>

      <nav className="tabbar">
        {[
          { to: "/home", icon: "🏠", label: "Inicio" },
          { to: "/teatros", icon: "🏛️", label: "Teatros" },
          { to: "/generos", icon: "🎭", label: "Géneros" },
          { to: "/id", icon: "🪪", label: "Mi ID" },
        ].map((t) => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) => "tab" + (isActive ? " active" : "")}>
            <span>{t.icon}</span>
            {t.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
