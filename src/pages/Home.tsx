import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PLAYS, THEATERS, activeDatesLabel, dateFromOffset, fmtDate, theaterById } from "../data";
import { PlayCard, Poster, Section } from "../ui";
import { useStore } from "../store";

export function Home() {
  const [q, setQ] = useState("");
  const { favorites, user } = useStore();
  const featured = PLAYS.filter((p) => p.featured);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return PLAYS.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.genre.toLowerCase().includes(s) ||
        theaterById(p.theaterId).name.toLowerCase().includes(s),
    );
  }, [q]);

  // "Recomendadas": géneros de tus favoritos primero; si no hay, por calificación
  const favGenres = new Set(PLAYS.filter((p) => favorites.includes(p.id)).map((p) => p.genre));
  const recommended = [...PLAYS]
    .filter((p) => !favorites.includes(p.id))
    .sort((a, b) => Number(favGenres.has(b.genre)) - Number(favGenres.has(a.genre)) || b.rating - a.rating)
    .slice(0, 5);

  const upcoming = PLAYS.map((p) => ({ p, d: Math.min(...p.days) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 5);
  const top = [...PLAYS].sort((a, b) => b.popularity - a.popularity).slice(0, 5);

  return (
    <>
      <div className="search">
        <span>🔍</span>
        <input placeholder="Busca obras, géneros o teatros" value={q} onChange={(e) => setQ(e.target.value)} />
        {q && (
          <button onClick={() => setQ("")} aria-label="Limpiar">
            ✕
          </button>
        )}
      </div>

      {q ? (
        <Section title={`Resultados (${results.length})`}>
          {results.length === 0 ? (
            <p className="muted">Sin resultados para “{q}”.</p>
          ) : (
            <div className="grid">
              {results.map((p) => (
                <PlayCard key={p.id} play={p} />
              ))}
            </div>
          )}
        </Section>
      ) : (
        <>
          <p className="greet">Hola{user ? `, ${user.name.split(" ")[0]}` : ""} 👋 ¿Qué vemos esta semana?</p>

          <div className="carousel hero">
            {featured.map((p) => (
              <Link key={p.id} to={`/obras/${p.id}`} className="hero-card">
                <Poster play={p} tall />
                <div className="hero-info">
                  <span className="chip">{p.genre}</span>
                  <h3>{p.title}</h3>
                  <div className="muted">
                    {theaterById(p.theaterId).name} · {activeDatesLabel(p)}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Section title="Recomendadas para ti">
            <div className="carousel">
              {recommended.map((p) => (
                <PlayCard key={p.id} play={p} />
              ))}
            </div>
          </Section>

          <Section title="Próximas funciones">
            <div className="list">
              {upcoming.map(({ p, d }) => (
                <Link key={p.id} to={`/obras/${p.id}`} className="upcoming">
                  <div className="date-badge">
                    <b>{dateFromOffset(d).getDate()}</b>
                    <span>{fmtDate(dateFromOffset(d)).split(" ").pop()}</span>
                  </div>
                  <div>
                    <div className="title">{p.title}</div>
                    <div className="muted small">
                      {theaterById(p.theaterId).name} · {p.times[0]}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Section>

          <Section title="Más vistas y mejor calificadas">
            <div className="carousel">
              {top.map((p) => (
                <PlayCard key={p.id} play={p} />
              ))}
            </div>
          </Section>

          <Section title="Teatros aliados" action={<Link to="/teatros">Ver todos</Link>}>
            <div className="chips">
              {THEATERS.map((t) => (
                <Link key={t.id} to={`/teatros/${t.id}`} className="chip big">
                  🏛️ {t.name}
                </Link>
              ))}
            </div>
          </Section>
        </>
      )}
    </>
  );
}
