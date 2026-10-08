import { useState } from "react";
import { PLAYS, THEATERS, dateFromOffset, fmtDate, money, showsOf, theaterById } from "../data";
import { Section } from "../ui";
import { useStore } from "../store";

export function Dashboard() {
  const [tid, setTid] = useState("principal");
  const { soldFor, capacityFor } = useStore();
  const t = theaterById(tid);
  const rows = PLAYS.filter((p) => p.theaterId === tid).flatMap((p) =>
    showsOf(p).map((s) => ({
      play: p.title,
      date: fmtDate(dateFromOffset(s.day)) + " " + s.time,
      sold: soldFor(s.id),
      cap: capacityFor(s.id),
      revenue: soldFor(s.id) * p.price,
    })),
  );
  const sold = rows.reduce((a, r) => a + r.sold, 0);
  const cap = rows.reduce((a, r) => a + r.cap, 0);
  const revenue = rows.reduce((a, r) => a + r.revenue, 0);

  const csv = () => {
    const body = ["Obra,Función,Vendidas,Aforo,Ocupación,Ingresos COP"]
      .concat(rows.map((r) => `"${r.play}","${r.date}",${r.sold},${r.cap},${Math.round((r.sold / r.cap) * 100)}%,${r.revenue}`))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/csv" }));
    a.download = `reporte-${tid}.csv`;
    a.click();
  };

  return (
    <>
      <Section title="Panel del teatro">
        <p className="muted small">Vista interna para teatros aliados (datos de ejemplo). El teatro consulta y gestiona datos; no edita obras.</p>
        <select className="input" value={tid} onChange={(e) => setTid(e.target.value)}>
          {THEATERS.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        <div className="kpis">
          <div className="card kpi">
            <small>Boletas vendidas</small>
            <b>{sold}</b>
          </div>
          <div className="card kpi">
            <small>Ocupación</small>
            <b>{cap ? Math.round((sold / cap) * 100) : 0}%</b>
          </div>
          <div className="card kpi wide">
            <small>Ingresos generados</small>
            <b>{money(revenue)}</b>
          </div>
        </div>
      </Section>

      <Section title="Ocupación por función">
        {rows.map((r, i) => {
          const pct = Math.round((r.sold / r.cap) * 100);
          return (
            <div key={i} className="occ">
              <div className="row between small">
                <span>
                  {r.play} · {r.date}
                </span>
                <b>{pct}%</b>
              </div>
              <div className="bar">
                <i style={{ width: pct + "%" }} className={pct > 85 ? "hot" : ""} />
              </div>
            </div>
          );
        })}
        <button className="btn ghost block" onClick={csv}>
          ⬇️ Descargar reporte (CSV)
        </button>
      </Section>

      <Section title="Seguro activo">
        <div className="card info">
          <div className="row between">
            <b>Cobertura de responsabilidad civil</b>
            <span className="chip">Vigente</span>
          </div>
          <div className="small">Vigencia: 01 ene – 31 dic · {t.name}</div>
          <div className="small ok">✓ Cubre: daños a asistentes, incidentes en sala</div>
          <div className="small warn">✗ No cubre: cancelaciones por fuerza mayor</div>
          <button className="btn small ghost" onClick={() => alert("Demo: aquí se contacta a la aseguradora")}>
            Contactar aseguradora
          </button>
        </div>
        <p className="muted small center">TeatrAppa no solo vende boletas: protege al teatro como espacio cultural.</p>
      </Section>
    </>
  );
}
