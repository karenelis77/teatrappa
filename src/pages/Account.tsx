import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { PLANS, PLAYS, dateFromOffset, fmtDate, money, playById, theaterById } from "../data";
import { PlayCard, Section, Stars } from "../ui";
import { useStore } from "../store";

export function Profile() {
  const { user, guest, tickets, favorites, reviews, plan } = useStore();
  const upcoming = tickets.filter((t) => Number(t.showId.split("|")[1]) >= 0);
  return (
    <>
      <div className="card profile-head">
        <div className="avatar big">{user ? user.name[0].toUpperCase() : "👤"}</div>
        <div>
          <b>{user ? user.name : "Invitado"}</b>
          <div className="muted small">{user ? user.email : guest ? "Sin cuenta" : ""}</div>
          {plan && <span className="chip">Plan {PLANS.find((p) => p.id === plan)?.name}</span>}
        </div>
      </div>
      {!user && (
        <Link className="btn ghost block" to="/auth">
          Crear cuenta para guardar tus datos
        </Link>
      )}

      <Section title={`Boletas activas (${upcoming.length})`}>
        {upcoming.length === 0 && <p className="muted">Aún no tienes boletas. ¡Elige una obra!</p>}
        {upcoming.map((t) => {
          const p = playById(t.playId)!;
          const [, d, time] = t.showId.split("|");
          return (
            <Link key={t.code} to={`/boleta/${t.code}`} className="card ticket-row">
              <QRCodeSVG value={`teatrappa://ticket/${t.code}`} size={64} />
              <div>
                <div className="title">{p.title}</div>
                <div className="muted small">
                  {fmtDate(dateFromOffset(Number(d)))} · {time} · {t.qty} boleta{t.qty > 1 ? "s" : ""}
                </div>
                <div className="muted small">{theaterById(p.theaterId).name}</div>
              </div>
            </Link>
          );
        })}
      </Section>

      <Section title="Historial de compras">
        {tickets.length === 0 ? (
          <p className="muted">Sin compras todavía.</p>
        ) : (
          tickets.map((t) => (
            <div key={t.code} className="row between small hist">
              <span>{playById(t.playId)!.title}</span>
              <b>{money(t.total)}</b>
            </div>
          ))
        )}
      </Section>

      <Section title="Favoritos" action={<Link to="/favoritos">Ver</Link>}>
        <p className="muted small">{favorites.length} obra(s) guardada(s)</p>
      </Section>

      <Section title="Mis reseñas">
        {reviews.length === 0 ? (
          <p className="muted small">Aún no has dejado reseñas.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.playId} className="card review">
              <b>{playById(r.playId)!.title}</b> <Stars value={r.stars} />
              <p>{r.text}</p>
            </div>
          ))
        )}
      </Section>

      <Section title="Método de pago">
        <div className="card info">💳 Tarjeta •••• 4242 <small className="muted">(demo)</small></div>
      </Section>
    </>
  );
}

export function Favorites() {
  const { favorites } = useStore();
  const plays = PLAYS.filter((p) => favorites.includes(p.id));
  return (
    <Section title="Favoritos">
      {plays.length === 0 ? (
        <p className="muted">Toca el corazón en una obra para guardarla aquí.</p>
      ) : (
        <div className="grid">
          {plays.map((p) => (
            <PlayCard key={p.id} play={p} />
          ))}
        </div>
      )}
    </Section>
  );
}

export function Subscriptions() {
  const { plan, subscribe } = useStore();
  return (
    <Section title="Suscripciones">
      <p className="muted small">Pensadas para el público: más beneficios por ir más al teatro.</p>
      {PLANS.map((p) => (
        <div key={p.id} className={"card plan" + (p.highlight ? " highlight" : "")}>
          {p.highlight && <span className="chip">Más popular</span>}
          <h3>{p.name}</h3>
          <div className="price big">
            {money(p.price)} <small>/ mes</small>
          </div>
          <ul>
            {p.perks.map((x) => (
              <li key={x}>✓ {x}</li>
            ))}
          </ul>
          <button className={"btn block" + (plan === p.id ? " ghost" : "")} onClick={() => subscribe(plan === p.id ? null : p.id)}>
            {plan === p.id ? "Plan activo · cancelar" : "Elegir plan"}
          </button>
        </div>
      ))}
    </Section>
  );
}

export function Settings() {
  const { reset, signOut } = useStore();
  return (
    <Section title="Ajustes">
      <div className="card info">
        <b>Datos de la demo</b>
        <p className="muted small">Todo se guarda solo en este navegador.</p>
        <button
          className="btn ghost"
          onClick={() => {
            reset();
            signOut();
            location.href = "/";
          }}
        >
          Reiniciar demo
        </button>
      </div>
    </Section>
  );
}
