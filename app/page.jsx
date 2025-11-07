"use client"
import React from "react"

/** ==========
 *  UTILITIES
 *  ========== */
const € = (n) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n || 0)

// moltiplicatori semplici e trasparenti
const COEFF = {
  stato: { scadente: 0.85, normale: 1.0, ristrutturato: 1.12, nuovo: 1.20 },
  box: { no: 1.0, singolo: 1.02, doppio: 1.04 },
  giardino: { no: 1.0, piccolo: 1.03, grande: 1.06 },
  terrazzo: { no: 1.0, piccolo: 1.02, grande: 1.04 },
  tipologia: { appartamento: 1.0, attico: 1.05, villetta: 1.08, bifamiliare: 1.07, villa: 1.12 },
  classe: { "A+": 1.06, A: 1.04, B: 1.02, C: 1.0, D: 0.98, E: 0.95, F: 0.92, G: 0.88 },
  riscaldamento: { autonomo: 1.0, centralizzato: 0.99, pompa: 1.02, teleriscaldamento: 1.0 },
}

function stimaValore(f) {
  const mq = Number(f.mq || 0)
  const base = Number(f.base || 0)
  if (!mq || !base) return 0

  let v = mq * base
  v *= COEFF.stato[f.stato] ?? 1
  v *= COEFF.box[f.box] ?? 1
  v *= COEFF.giardino[f.giardino] ?? 1
  v *= COEFF.terrazzo[f.terrazzo] ?? 1
  v *= COEFF.tipologia[f.tipologia] ?? 1
  v *= COEFF.classe[f.classe] ?? 1
  v *= COEFF.riscaldamento[f.riscaldamento] ?? 1

  // camere/bagni (effetto leggero ma reale)
  const bagni = Number(f.bagni || 1)
  if (bagni > 1) v *= 1 + Math.min(0.08, 0.03 * (bagni - 1)) // max +8%
  const camere = Number(f.camere || 2)
  if (camere <= 1) v *= 0.97
  else if (camere === 3) v *= 1.02
  else if (camere === 4) v *= 1.04
  else if (camere >= 5) v *= 1.06

  // piano/ascensore
  const piano = Number(f.piano || 0)
  if (piano >= 3 && !f.asc) v *= 0.95
  if (piano >= 3 && f.asc) v *= 1.03
  if (piano === 0 && f.giardino !== "no") v *= 1.02

  // balcone/posto auto
  if (f.balcone) v *= 1.01
  if (f.posto_auto) v *= 1.01

  // vetustà
  const anno = Number(f.anno || 0)
  if (anno) {
    if (anno < 1975) v *= 0.95
    else if (anno < 1991) v *= 0.98
    else if (anno <= 2005) v *= 1.01
    else if (anno <= 2015) v *= 1.03
    else v *= 1.05
  }

  // nessun “country boost”: la base €/mq la metti tu (più onesto e controllabile)
  return Math.max(0, Math.round(v))
}

// etichette dinamiche per Paese
const LABELS = {
  it: { addr: "Via / Comune", cap: "CAP", note: "Note (esposizione, finiture, vincoli, ristrutturazioni…)" },
  fr: { addr: "Adresse / Ville", cap: "Code postal", note: "Notes (exposition, finitions, contraintes, travaux…)" },
  de: { addr: "Straße / Stadt", cap: "PLZ", note: "Notizen (Ausrichtung, Ausstattung, Auflagen, Sanierungen…)" },
}

/** ==========
 *  PAGE
 *  ========== */
export default function Page() {
  const [country, setCountry] = React.useState("it") // it | fr | de
  const [f, setF] = React.useState({
    // localizzazione
    indirizzo: "", cap: "", citta: "", provincia: "",
    // metratura/parametri base
    mq: 80, base: 1500, tipologia: "appartamento", stato: "normale",
    piano: 1, piani_totali: 5, asc: true,
    camere: 2, bagni: 1,
    terrazzo: "no", balcone: true, giardino: "no",
    posto_auto: false, box: "no",
    anno: 1998, classe: "C",
    riscaldamento: "autonomo", arredato: false,
    // contatto
    nome: "", email: "", tel: "",
    // extra
    note: "",
  })
  const [utm, setUtm] = React.useState({ utm_source: "", utm_medium: "", utm_campaign: "", referrer: "" })
  const valore = stimaValore(f)
  const range = { low: Math.round(valore * 0.95), high: Math.round(valore * 1.05) }

  React.useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    setUtm({
      utm_source: p.get("utm_source") || "",
      utm_medium: p.get("utm_medium") || "",
      utm_campaign: p.get("utm_campaign") || "",
      referrer: document.referrer || "",
    })
  }, [])

  const onChange = (e) => {
    const { name, type, value, checked } = e.target
    setF((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }))
  }

  const L = LABELS[country]

  return (
    <main style={{ fontFamily: "-apple-system, Segoe UI, Roboto, Helvetica, Arial", color: "#111" }}>
      {/* HERO */}
      <section style={{ padding: "64px 16px", borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 24, gridTemplateColumns: "1.2fr 1fr" }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: "#777" }}>
              Valutare Casa · Servizio digitale (Italia · Francia · Germania)
            </div>
            <h1 style={{ fontSize: 44, lineHeight: 1.1, margin: "10px 0 12px" }}>
              Scopri il vero valore del tuo immobile <span style={{ whiteSpace: "nowrap" }}>in 2 minuti</span>.
            </h1>
            <p style={{ color: "#444", marginTop: 0 }}>
              Niente appuntamenti in agenzia. Valutazione riservata e professionale, con comparabili reali. Se vuoi vendere,
              un consulente Twenty-Nine ti segue senza pressioni.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <CountrySelect value={country} onChange={setCountry} />
              <a href="#calcolatore" style={cta}>Inizia ora</a>
            </div>
          </div>
          <div style={{ border: "1px solid #eee", borderRadius: 16, padding: 16, background: "#fff" }}>
            <div style={{ fontSize: 13, color: "#666" }}>Anteprima stima</div>
            <div style={{ fontSize: 36, fontWeight: 800 }}>{€(valore)}</div>
            <div style={{ fontSize: 14, color: "#666" }}>
              Range atteso: <b>{€(range.low)}</b> – <b>{€(range.high)}</b>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "#888" }}>
              La stima si affina con finiture, esposizione e situazione documentale.
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "28px 16px", background: "#fafafa", borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 12, gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
          {[
            { t: "Compila i dati", d: "indirizzo, mq, stato, dotazioni" },
            { t: "Ottieni la stima", d: "numero + range realistico" },
            { t: "Scegli il livello", d: "gratuito · report · perizia" },
          ].map((c, i) => (
            <div key={i} style={card}>
              <b>{c.t}</b>
              <div style={{ color: "#555" }}>{c.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CALCOLATORE + LEAD FORM */}
      <section id="calcolatore" style={{ padding: "32px 16px", borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 24, gridTemplateColumns: "1.2fr 1fr" }}>
          {/* CALCOLATORE */}
          <div style={{ ...card, background: "#fff" }}>
            <h2 style={{ marginTop: 0 }}>Valutatore</h2>

            {/* LOCALIZZAZIONE */}
            <div style={grid2}>
              <label>Paese
                <select name="country" value={country} onChange={(e)=>setCountry(e.target.value)} style={inp}>
                  <option value="it">Italia</option>
                  <option value="fr">Francia</option>
                  <option value="de">Germania</option>
                </select>
              </label>
              <label>{L.cap}
                <input name="cap" value={f.cap} onChange={onChange} placeholder="10100 / 75001 / 10115" style={inp}/>
              </label>
              <label>{L.addr}
                <input name="indirizzo" value={f.indirizzo} onChange={onChange} placeholder="Via, numero civico" style={inp}/>
              </label>
              <label>Città
                <input name="citta" value={f.citta} onChange={onChange} placeholder="Torino / Paris / Berlin" style={inp}/>
              </label>
              <label>Provincia/Dept/Land
                <input name="provincia" value={f.provincia} onChange={onChange} placeholder="TO / 75 / BE" style={inp}/>
              </label>
              <label>Superficie (mq)
                <input name="mq" type="number" min="10" value={f.mq} onChange={onChange} style={inp}/>
              </label>
            </div>

            {/* CARATTERISTICHE */}
            <div style={grid3}>
              <label>Tipologia
                <select name="tipologia" value={f.tipologia} onChange={onChange} style={inp}>
                  <option value="appartamento">Appartamento</option>
                  <option value="attico">Attico</option>
                  <option value="villetta">Villetta</option>
                  <option value="bifamiliare">Bifamiliare</option>
                  <option value="villa">Villa</option>
                </select>
              </label>
              <label>Stato immobile
                <select name="stato" value={f.stato} onChange={onChange} style={inp}>
                  <option value="scadente">Da ristrutturare</option>
                  <option value="normale">Buono</option>
                  <option value="ristrutturato">Ristrutturato</option>
                  <option value="nuovo">Nuovo</option>
                </select>
              </label>
              <label>Anno costruzione
                <input name="anno" type="number" min="1900" value={f.anno} onChange={onChange} style={inp}/>
              </label>

              <label>Camere da letto
                <input name="camere" type="number" min="0" value={f.camere} onChange={onChange} style={inp}/>
              </label>
              <label>Bagni
                <input name="bagni" type="number" min="1" value={f.bagni} onChange={onChange} style={inp}/>
              </label>
              <label>Classe energetica
                <select name="classe" value={f.classe} onChange={onChange} style={inp}>
                  {["A+","A","B","C","D","E","F","G"].map(k=><option key={k} value={k}>{k}</option>)}
                </select>
              </label>

              <label>Piano
                <input name="piano" type="number" value={f.piano} onChange={onChange} style={inp}/>
              </label>
              <label>Piani totali edificio
                <input name="piani_totali" type="number" value={f.piani_totali} onChange={onChange} style={inp}/>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 26 }}>
                <input type="checkbox" name="asc" checked={f.asc} onChange={onChange} /> Ascensore
              </label>

              <label>Balcone
                <select name="balcone" value={f.balcone ? "si" : "no"} onChange={(e)=>setF(s=>({...s, balcone: e.target.value==="si"}))} style={inp}>
                  <option value="si">Sì</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label>Terrazzo
                <select name="terrazzo" value={f.terrazzo} onChange={onChange} style={inp}>
                  <option value="no">No</option>
                  <option value="piccolo">Piccolo</option>
                  <option value="grande">Grande</option>
                </select>
              </label>
              <label>Giardino
                <select name="giardino" value={f.giardino} onChange={onChange} style={inp}>
                  <option value="no">No</option>
                  <option value="piccolo">Piccolo</option>
                  <option value="grande">Grande</option>
                </select>
              </label>

              <label>Box
                <select name="box" value={f.box} onChange={onChange} style={inp}>
                  <option value="no">Nessuno</option>
                  <option value="singolo">Singolo</option>
                  <option value="doppio">Doppio</option>
                </select>
              </label>
              <label>Posto auto
                <select name="posto_auto" value={f.posto_auto ? "si" : "no"} onChange={(e)=>setF(s=>({...s, posto_auto: e.target.value==="si"}))} style={inp}>
                  <option value="no">No</option>
                  <option value="si">Sì</option>
                </select>
              </label>
              <label>Riscaldamento
                <select name="riscaldamento" value={f.riscaldamento} onChange={onChange} style={inp}>
                  <option value="autonomo">Autonomo</option>
                  <option value="centralizzato">Centralizzato</option>
                  <option value="pompa">Pompa di calore</option>
                  <option value="teleriscaldamento">Teleriscaldamento</option>
                </select>
              </label>

              <label>Arredato
                <select name="arredato" value={f.arredato ? "si" : "no"} onChange={(e)=>setF(s=>({...s, arredato: e.target.value==="si"}))} style={inp}>
                  <option value="no">No</option>
                  <option value="si">Sì</option>
                </select>
              </label>
              <label>Valore €/mq (tua base)
                <input name="base" type="number" min="500" step="50" value={f.base} onChange={onChange} style={inp}/>
              </label>
              <label>Note
                <textarea name="note" value={f.note} onChange={onChange} rows={3} placeholder={L.note} style={{...inp, resize:"vertical"}}/>
              </label>
            </div>

            {/* OUTPUT */}
            <div style={{ marginTop: 16, padding: 12, background: "#f7f7f7", borderRadius: 10 }}>
              <div style={{ fontSize: 14, color: "#666" }}>Valutazione indicativa</div>
              <div style={{ fontSize: 34, fontWeight: 800 }}>{€(valore)}</div>
              <div style={{ fontSize: 13, color: "#666" }}>
                Range atteso: <b>{€(range.low)}</b> – <b>{€(range.high)}</b>
              </div>
              <div style={{ fontSize: 12, color: "#666" }}>
                Suggerimento: se non sai la base €/mq, prova con {country === "it" ? "1500–3000" : country === "fr" ? "3000–9000" : "2500–6000"} €/mq a seconda della città.
              </div>
            </div>
          </div>

          {/* FORM LEAD (NETLIFY) */}
          <div style={{ ...card, background: "#fff" }}>
            <h3 style={{ marginTop: 0 }}>Ricevi la valutazione riservata (PDF)</h3>
            <p style={{ color: "#444", marginTop: 0 }}>Ti inviamo il report con range e comparabili. Se vuoi, ti contatta un consulente Twenty-Nine.</p>

            <form name="lead-valutarecasa" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thank-you" style={{ display: "grid", gap: 12 }}>
              <input type="hidden" name="form-name" value="lead-valutarecasa" />
              <p hidden><label>Non compilare: <input name="bot-field" /></label></p>

              <label>Nome e cognome
                <input name="nome" value={f.nome} onChange={onChange} required style={inp}/>
              </label>
              <label>Email
                <input name="email" type="email" value={f.email} onChange={onChange} required style={inp}/>
              </label>
              <label>Telefono
                <input name="tel" value={f.tel} onChange={onChange} required style={inp}/>
              </label>

              {/* HIDDEN: passiamo TUTTO il contesto immobile + UTM + Paese */}
              {Object.entries({
                country, ...f,
                valore_stimato: String(valore),
                range_basso: String(range.low),
                range_alto: String(range.high),
                utm_source: utm.utm_source,
                utm_medium: utm.utm_medium,
                utm_campaign: utm.utm_campaign,
                referrer: utm.referrer,
              }).map(([k, v]) => <input key={k} type="hidden" name={k} value={typeof v === "boolean" ? (v ? "sì" : "no") : String(v)} />)}

              <label style={{ display: "flex", alignItems: "start", gap: 8, fontSize: 14, color: "#444" }}>
                <input type="checkbox" name="consenso_contatto" required /> Autorizzo il contatto per inviarmi la valutazione e proposte di vendita.
              </label>
              <div style={{ fontSize: 12, color: "#666" }}>
                Continuando, accetti la nostra <a href="/privacy" target="_blank">Privacy Policy</a>.
              </div>

              <button style={btn}>Invia e ricevi il PDF</button>
              <div style={{ fontSize: 12, color: "#666" }}>Consegna tipica: entro poche ore lavorative.</div>
            </form>
          </div>
        </div>
      </section>

      {/* LIVELLI DI CONSULENZA (semplice, senza import) */}
      <section style={{ padding: "36px 16px", background: "#fafafa", borderTop: "1px solid #eee" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ marginTop: 0 }}>Livelli di consulenza</h2>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
            {[
              { n: "Analisi Base", p: "€ 0", d: "Stima di massima e range realistico. Perfetto per orientarti." },
              { n: "Report Pro", p: "€ 49", d: "PDF dettagliato, comparabili mirati, suggerimenti di prezzo e listing." },
              { n: "Perizia Completa", p: "Su preventivo", d: "Documento ufficiale firmato, sopralluogo e dossier completo." },
            ].map((x, i) => (
              <div key={i} style={{ ...card, background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <b>{x.n}</b>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{x.p}</div>
                <div style={{ color: "#444", marginTop: 6 }}>{x.d}</div>
                <a href="#calcolatore" style={ghostBtn}>Richiedi</a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

/** ==========
 *  UI bits
 *  ========== */
function CountrySelect({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10 }}>
      <option value="it">🇮🇹 Italia</option>
      <option value="fr">🇫🇷 Francia</option>
      <option value="de">🇩🇪 Germania</option>
    </select>
  )
}

const card = { border: "1px solid #eee", borderRadius: 16, padding: 16 }
const inp = { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10, marginTop: 4 }
const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }
const grid3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }
const btn = { display: "inline-block", marginTop: 4, padding: "12px 16px", background: "#111", color: "#fff", border: "none", borderRadius: 12, cursor: "pointer" }
const cta = { display: "inline-block", padding: "12px 16px", borderRadius: 12, background: "#111", color: "#fff", textDecoration: "none" }
const ghostBtn = { display: "inline-block", marginTop: 12, padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", textDecoration: "none", color: "#111" }

