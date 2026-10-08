import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GENRES, PLAYS } from "../data";
import { PlayCard, Section } from "../ui";

export function GenreList() {
  return (
    <Section title="Géneros">
      <div className="genre-grid">
        {GENRES.map((g) => (
          <Link key={g.name} to={`/generos/${g.name}`} className="card genre-tile">
            <span>{g.emoji}</span>
            {g.name}
            <small>{PLAYS.filter((p) => p.genre === g.name).length} obras</small>
          </Link>
        ))}
      </div>
    </Section>
  );
}

type Sort = "popularidad" | "fecha" | "precio";

export function GenrePlays() {
  const { name } = useParams();
  const [sort, setSort] = useState<Sort>("popularidad");
  const plays = PLAYS.filter((p) => p.genre === name).sort((a, b) =>
    sort === "popularidad" ? b.popularity - a.popularity : sort === "precio" ? a.price - b.price : Math.min(...a.days) - Math.min(...b.days),
  );
  return (
    <Section title={`${name}`}>
      <div className="seg">
        {(["popularidad", "fecha", "precio"] as Sort[]).map((s) => (
          <button key={s} className={sort === s ? "on" : ""} onClick={() => setSort(s)}>
            {s[0].toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      <p className="muted small">Todas las obras del género, sin importar el teatro.</p>
      <div className="grid">
        {plays.map((p) => (
          <PlayCard key={p.id} play={p} />
        ))}
      </div>
    </Section>
  );
}
