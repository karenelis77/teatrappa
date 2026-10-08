import { Link, useParams } from "react-router-dom";
import { dateFromOffset, fmtDate, money, playById, theaterById } from "../data";
import { Poster, Section, Stars } from "../ui";
import { useStore } from "../store";
import { mapSrc } from "./Theaters";

const SEED_REVIEWS = [
  { who: "Marcela R.", stars: 5, text: "Una puesta en escena impecable. Salí con ganas de volver." },
  { who: "Daniel P.", stars: 4, text: "Muy buena actuación y el sonido es excelente. Lleguen temprano." },
  { who: "Juliana T.", stars: 5, text: "Fuimos en familia y todos quedamos felices." },
];

export function PlayDetail() {
  const { id } = useParams();
  const play = playById(id!);
  const { favorites, toggleFav, reviews, soldFor, capacityFor } = useStore();
  if (!play) return <p>Obra no encontrada.</p>;
  const t = theaterById(play.theaterId);
  const fav = favorites.includes(play.id);
  const mine = reviews.find((r) => r.playId === play.id);
  const nextShow = `${play.id}|${play.days[0]}|${play.times[0]}`;
  const left = capacityFor(nextShow) - soldFor(nextShow);

  return (
    <>
      <div className="play-hero">
        <Poster play={play} tall />
        <button className={"fav" + (fav ? " on" : "")} onClick={() => toggleFav(play.id)} aria-label="Favorito">
          {fav ? "❤️" : "🤍"}
        </button>
      </div>
      <span className="chip">{play.genre}</span>
      <h1>{play.title}</h1>
      <Link to={`/teatros/${t.id}`} className="muted">
        🏛️ {t.name} · {t.zone}
      </Link>
      <div className="row">
        <Stars value={play.rating} />
        <span className="muted small">
          {play.rating.toFixed(1)} ({play.votes} reseñas)
        </span>
      </div>

      <Section title="Sinopsis">
        <p>{play.synopsis}</p>
        <p className="muted small">
          <b>Dirección:</b> {play.director}
          <br />
          <b>Elenco:</b> {play.cast.join(", ")}
        </p>
      </Section>

      <Section title="Fechas y horarios">
        <div className="chips">
          {play.days.map((d) => (
            <span key={d} className="chip big">
              {fmtDate(dateFromOffset(d))} · {play.times.join(" / ")}
            </span>
          ))}
        </div>
        <p className={"small " + (left < 25 ? "warn" : "muted")}>
          {left < 25 ? `¡Últimas ${left} boletas para la próxima función!` : `Disponibilidad: ${left} boletas en la próxima función`}
        </p>
      </Section>

      <Section title="Ubicación">
        <p className="muted small">{t.address}</p>
        <iframe className="map" title="Mapa" loading="lazy" src={mapSrc(t.lat, t.lng)} />
      </Section>

      <Section title="Reseñas (sin spoilers)">
        {mine && (
          <div className="card review mine">
            <b>Tu reseña</b> <Stars value={mine.stars} />
            <p>{mine.text}</p>
          </div>
        )}
        {SEED_REVIEWS.map((r) => (
          <div key={r.who} className="card review">
            <b>{r.who}</b> <Stars value={r.stars} />
            <p>{r.text}</p>
          </div>
        ))}
      </Section>

      <div className="buybar">
        <div>
          <small className="muted">Desde</small>
          <div className="price big">{money(play.price)}</div>
        </div>
        <Link to={`/comprar/${play.id}`} className="btn">
          🎟️ Comprar boleta
        </Link>
      </div>
    </>
  );
}
