import { Link, useParams } from "react-router-dom";
import { PLAYS, THEATERS, theaterById } from "../data";
import { PlayRow, Section, TheaterCard } from "../ui";

export function Theaters() {
  return (
    <Section title="Teatros">
      <div className="grid">
        {THEATERS.map((t) => (
          <TheaterCard key={t.id} t={t} />
        ))}
      </div>
    </Section>
  );
}

export function mapSrc(lat: number, lng: number) {
  const d = 0.004;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d},${lat - d},${lng + d},${lat + d}&layer=mapnik&marker=${lat},${lng}`;
}

export function TheaterDetail() {
  const { id } = useParams();
  const t = THEATERS.find((x) => x.id === id);
  if (!t) return <p>Teatro no encontrado.</p>;
  return (
    <>
      <div className="gallery">
        {["Fachada", "Platea", "Escenario"].map((label, i) => (
          <div
            key={label}
            className="gallery-item"
            style={{ background: `linear-gradient(${120 + i * 40}deg, hsl(${t.hue + i * 25} 65% 42%), hsl(${t.hue + i * 25 + 30} 55% 16%))` }}
          >
            {label}
          </div>
        ))}
      </div>
      <h1>{t.name}</h1>
      <p className="muted">{t.about}</p>
      <div className="card info">
        <div>📍 {t.address}</div>
        <div>
          📞 <a href={`tel:${t.phone.replace(/\s/g, "")}`}>{t.phone}</a>
        </div>
        <div>
          ✉️ <a href={`mailto:${t.email}`}>{t.email}</a>
        </div>
        <div>📷 {t.social}</div>
        <div>💺 Aforo: {t.capacity} personas</div>
      </div>
      <iframe className="map" title={`Mapa de ${t.name}`} loading="lazy" src={mapSrc(t.lat, t.lng)} />
      <Link to={`/teatros/${t.id}/obras`} className="btn block sticky">
        Ver obras en este teatro
      </Link>
    </>
  );
}

export function TheaterPlays() {
  const { id } = useParams();
  const t = theaterById(id!);
  const plays = PLAYS.filter((p) => p.theaterId === id);
  return (
    <Section title={`Obras en ${t.name}`}>
      <div className="list">
        {plays.map((p) => (
          <PlayRow key={p.id} play={p} />
        ))}
      </div>
    </Section>
  );
}
