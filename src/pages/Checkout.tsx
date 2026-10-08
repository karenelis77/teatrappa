import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { dateFromOffset, fmtDate, money, playById, showsOf, theaterById } from "../data";
import { Stars } from "../ui";
import { useStore } from "../store";

const STEPS = ["Función", "Cantidad", "Pago"];

export function Checkout() {
  const { id } = useParams();
  const play = playById(id!);
  const nav = useNavigate();
  const { soldFor, capacityFor, buy, plan, user } = useStore();
  const [step, setStep] = useState(0);
  const [showId, setShowId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [method, setMethod] = useState("card");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!play) return <p>Obra no encontrada.</p>;

  const shows = showsOf(play);
  const days = [...new Set(shows.map((s) => s.day))];
  const cap = showId ? capacityFor(showId) : 0;
  const sold = showId ? soldFor(showId) : 0;
  const left = cap - sold;
  const discount = plan === "premium" ? 0.8 : plan === "cultural" ? 0.9 : 1;
  const total = Math.round(play.price * qty * discount);
  const pct = cap ? Math.round((sold / cap) * 100) : 0;

  const pay = () => {
    if (!showId) return;
    setBusy(true);
    setTimeout(() => {
      const r = buy(showId, qty);
      setBusy(false);
      if (r.ok) nav(`/boleta/${r.ticket.code}`, { replace: true });
      else {
        setError(r.error);
        setStep(1);
      }
    }, 900); // pago simulado
  };

  return (
    <>
      <h1>{play.title}</h1>
      <p className="muted">{theaterById(play.theaterId).name}</p>
      <ol className="steps">
        {STEPS.map((s, i) => (
          <li key={s} className={i === step ? "on" : i < step ? "done" : ""}>
            <span>{i < step ? "✓" : i + 1}</span>
            {s}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <>
          <h2>Elige fecha y hora</h2>
          {days.map((d) => (
            <div key={d} className="day-block">
              <div className="muted small">{fmtDate(dateFromOffset(d))}</div>
              <div className="chips">
                {shows
                  .filter((s) => s.day === d)
                  .map((s) => {
                    const l = capacityFor(s.id) - soldFor(s.id);
                    return (
                      <button
                        key={s.id}
                        disabled={l <= 0}
                        className={"chip big select" + (showId === s.id ? " on" : "")}
                        onClick={() => setShowId(s.id)}
                      >
                        {s.time} <small>{l <= 0 ? "agotado" : `${l} disp.`}</small>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
          <button className="btn block sticky" disabled={!showId} onClick={() => setStep(1)}>
            Continuar
          </button>
        </>
      )}

      {step === 1 && showId && (
        <>
          <h2>¿Cuántas boletas?</h2>
          <div className="stepper">
            <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <b>{qty}</b>
            <button onClick={() => setQty(Math.min(Math.min(8, left), qty + 1))}>+</button>
          </div>
          <div className="card info">
            <div className="row between">
              <span>Aforo ocupado</span>
              <b>
                {sold}/{cap}
              </b>
            </div>
            <div className="bar">
              <i style={{ width: pct + "%" }} className={pct > 85 ? "hot" : ""} />
            </div>
            <div className={"small " + (left < 25 ? "warn" : "muted")}>
              Quedan {left} boletas. Máximo 8 por compra.
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn block sticky" onClick={() => { setError(""); setStep(2); }}>
            Continuar · {money(total)}
          </button>
        </>
      )}

      {step === 2 && showId && (
        <>
          <h2>Pago</h2>
          <div className="card info">
            <div className="row between">
              <span>
                {qty} × {money(play.price)}
              </span>
              <span>{money(play.price * qty)}</span>
            </div>
            {discount < 1 && (
              <div className="row between ok">
                <span>Descuento suscripción</span>
                <span>−{Math.round((1 - discount) * 100)}%</span>
              </div>
            )}
            <div className="row between total">
              <b>Total</b>
              <b>{money(total)}</b>
            </div>
          </div>
          <div className="pay-methods">
            {[
              ["card", "💳 Tarjeta"],
              ["pse", "🏦 PSE"],
              ["nequi", "📱 Nequi"],
            ].map(([k, l]) => (
              <button key={k} className={"chip big select" + (method === k ? " on" : "")} onClick={() => setMethod(k)}>
                {l}
              </button>
            ))}
          </div>
          {!user && <input className="input" placeholder="Correo para enviarte la boleta" type="email" />}
          <p className="muted small">Demo: no se realiza ningún cobro real.</p>
          <button className="btn block sticky" disabled={busy} onClick={pay}>
            {busy ? "Procesando…" : `Pagar ${money(total)}`}
          </button>
        </>
      )}
    </>
  );
}

export function TicketView() {
  const { code } = useParams();
  const { tickets, reviews, addReview } = useStore();
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const ticket = tickets.find((t) => t.code === code);
  if (!ticket) return <p>Boleta no encontrada.</p>;
  const play = playById(ticket.playId)!;
  const [, day, time] = ticket.showId.split("|");
  const t = theaterById(play.theaterId);
  const reviewed = reviews.some((r) => r.playId === play.id);

  return (
    <>
      <div className="ticket">
        <div className="ticket-top">
          <span className="ok-badge">✓ Compra confirmada</span>
          <h2>{play.title}</h2>
          <div>{t.name}</div>
          <div className="muted small">
            {fmtDate(dateFromOffset(Number(day)))} · {time} · {ticket.qty} boleta{ticket.qty > 1 ? "s" : ""}
          </div>
        </div>
        <div className="ticket-cut" />
        <div className="ticket-qr">
          <QRCodeSVG value={`teatrappa://ticket/${ticket.code}`} size={180} />
          <b>{ticket.code}</b>
          <small className="muted">Presenta este QR en la entrada · válido para {ticket.qty} persona(s)</small>
        </div>
      </div>
      <Link to="/id" className="btn ghost block">
        Ver en Mi ID
      </Link>
      {!reviewed && (
        <div className="card info">
          <b>¿Ya la viste? Califica sin spoilers</b>
          <Stars value={stars} onChange={setStars} />
          <input className="input" placeholder="Comentario breve" maxLength={140} value={text} onChange={(e) => setText(e.target.value)} />
          <button className="btn small" disabled={!stars} onClick={() => addReview({ playId: play.id, stars, text })}>
            Publicar
          </button>
        </div>
      )}
    </>
  );
}
