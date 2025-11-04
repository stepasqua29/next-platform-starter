"use client"
import React from "react"
import Pricing from "../components/Pricing"
import Benefits from "../components/Benefits"
import Testimonials from "../components/Testimonials"
import FAQ from "../components/FAQ"

function currency(n){ return new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n||0) }
function stimaValore({ mq, base, stato, piano, asc, box }) {
  const cs = { scadente:0.85, normale:1, ristrutturato:1.12, nuovo:1.2 }[stato] ?? 1
  const cb = { no:1, singolo:1.02, doppio:1.04 }[box] ?? 1
  let v = Number(mq||0) * Number(base||0) * cs * cb
  if (Number(piano) >= 3 && !asc) v *= 0.95
  return Math.max(0, Math.round(v))
}

export default function Page() {
  const [f, setF] = React.useState({
    indirizzo: "", cap: "", mq: 80, base: 1500,
    stato: "normale", piano: 1, asc: true, box: "no"
  })
  const [utm, setUtm] = React.useState({ utm_source:"", utm_medium:"", utm_campaign:"", referrer:"" })
  const [selectedPlan, setSelectedPlan] = React.useState("Report gratuito")
  const valore = stimaValore(f)

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setUtm({
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      referrer: document.referrer || ""
    })
  }, [])

  const onChange = (e) => {
    const { name, type, value, checked } = e.target
    setF(s => ({ ...s, [name]: type==="checkbox" ? checked : value }))
  }

  return (
    <main style={{ fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial', color:'#111' }}>
      {/* USP sticky bar */}
      <div style={{position:'sticky',top:0,zIndex:40, background:'#111',color:'#fff', padding:'8px 12px', textAlign:'center', fontSize:14}}>
        Valutazione online in pochi minuti • Nessun appuntamento in agenzia • Dati chiari e trasparenti
      </div>

      {/* HERO */}
      <section style={{ padding:'56px 16px', borderBottom:'1px solid #eee' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gap:24, gridTemplateColumns:'1.2fr 1fr' }}>
          <div>
            <div style={{ fontSize:12, letterSpacing:1, textTransform:'uppercase', color:'#666' }}>Twenty-Nine · Valutazione Online</div>
            <h1 style={{ fontSize:44, lineHeight:1.1, margin:'8px 0 12px' }}>
              Niente agenzia. La tua casa <span style={{whiteSpace:'nowrap'}}>valutata in 2 minuti</span>.
            </h1>
            <p style={{ color:'#444', marginTop:0 }}>
              Stima immediata + report. Se vuoi, perizia completa firmata. Tutto online, senza appuntamenti, senza pressioni.
            </p>
            <ul style={{ lineHeight:1.8, color:'#333', paddingLeft:18, marginTop:12 }}>
              <li>Comparabili reali e range di mercato</li>
              <li>Trasparenza totale: capisci <i>perché</i> quel valore</li>
              <li>Se vendi, passiamo il lead direttamente a Twenty-Nine</li>
            </ul>
            <a href="#calcolatore" style={{ display:'inline-block', marginTop:16, padding:'12px 16px', borderRadius:10, background:'black', color:'white', textDecoration:'none' }}>
              Calcola subito il valore
            </a>
          </div>
          <div style={{ border:'1px solid #eee', borderRadius:12, padding:16 }}>
            <div style={{ fontSize:14, color:'#666' }}>Anteprima stima</div>
            <div style={{ fontSize:36, fontWeight:800 }}>{currency(valore)}</div>
            <div style={{ color:'#666' }}>Affina i parametri nel calcolatore qui sotto.</div>
            <div style={{marginTop:12, fontSize:12, color:'#888'}}>Garanzia soddisfatti o rimborsati sul Report Pro 7 giorni.</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:'28px 16px', background:'#fafafa', borderBottom:'1px solid #eee' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gap:12, gridTemplateColumns:'repeat(3,minmax(0,1fr))' }}>
          {[
            {t:'Inserisci pochi dati',d:'mq, stato, piano, box'},
            {t:'Vedi subito la stima',d:'range con logica chiara'},
            {t:'Scegli il pacchetto',d:'gratis, report, perizia'}
          ].map((c,i)=>(
            <div key={i} style={{border:'1px solid #eee', borderRadius:12, padding:16, background:'#fff'}}>
              <b>{c.t}</b><div style={{color:'#555'}}>{c.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CALCOLATORE + LEAD FORM */}
      <section id="calcolatore" style={{ padding:'32px 16px', borderBottom:'1px solid #eee' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gap:24, gridTemplateColumns:'1.2fr 1fr' }}>
          {/* Calcolatore */}
          <div style={{ border:'1px solid #eee', borderRadius:12, padding:16, background:'white' }}>
            <h2 style={{ marginTop:0 }}>Calcolatore</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <label>Indirizzo
                <input name="indirizzo" value={f.indirizzo} onChange={onChange} placeholder="Via / Comune" style={inp}/>
              </label>
              <label>CAP
                <input name="cap" value={f.cap} onChange={onChange} placeholder="10100" style={inp}/>
              </label>
              <label>Superficie (mq)
                <input name="mq" type="number" min="10" value={f.mq} onChange={onChange} style={inp}/>
              </label>
              <label>Valore €/mq (tua stima)
                <input name="base" type="number" min="500" step="50" value={f.base} onChange={onChange} style={inp}/>
              </label>
              <label>Stato
                <select name="stato" value={f.stato} onChange={onChange} style={inp}>
                  <option value="scadente">Da ristrutturare</option>
                  <option value="normale">Buono</option>
                  <option value="ristrutturato">Ristrutturato</option>
                  <option value="nuovo">Nuovo</option>
                </select>
              </label>
              <label>Piano
                <input name="piano" type="number" value={f.piano} onChange={onChange} style={inp}/>
              </label>
              <label>Box
                <select name="box" value={f.box} onChange={onChange} style={inp}>
                  <option value="no">Nessuno</option>
                  <option value="singolo">Singolo</option>
                  <option value="doppio">Doppio</option>
                </select>
              </label>
              <label style={{ display:'flex', alignItems:'center', gap:8, marginTop:24 }}>
                <input type="checkbox" name="asc" checked={f.asc} onChange={onChange}/> Ascensore
              </label>
            </div>

            <div style={{ marginTop:16, padding:12, background:'#f7f7f7', borderRadius:8 }}>
              <div style={{ fontSize:14, color:'#666' }}>Valutazione indicativa</div>
              <div style={{ fontSize:34, fontWeight:800 }}>{currency(valore)}</div>
              <div style={{ fontSize:12, color:'#666' }}>La cifra finale dipende da finiture, esposizione, stato legale/impianti.</div>
            </div>
          </div>

          {/* Lead form */}
          <div style={{ border:'1px solid #eee', borderRadius:12, padding:16, background:'white' }}>
            <h3 style={{ marginTop:0 }}>Scarica il report gratuito</h3>
            <p style={{ color:'#444', marginTop:0 }}>Ricevi il PDF con range e comparabili. Se desideri, ti contattiamo per vendere con Twenty-Nine.</p>

            <form name="lead-valutacasa" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thank-you" style={{ display:'grid', gap:12 }}>
              <input type="hidden" name="form-name" value="lead-valutacasa" />
              <p hidden><label>Non compilare: <input name="bot-field" /></label></p>

              {/* Dati contatto */}
              <label>Nome e cognome
                <input name="nome" required style={inp}/>
              </label>
              <label>Email
                <input name="email" type="email" required style={inp}/>
              </label>
              <label>Telefono
                <input name="tel" required style={inp}/>
              </label>

              {/* Dati immobile hidden */}
              {Object.entries({
                indirizzo:f.indirizzo, cap:f.cap, mq:String(f.mq), base:String(f.base),
                stato:f.stato, piano:String(f.piano), asc:f.asc ? "sì":"no", box:f.box,
                valore_stimato:String(valore)
              }).map(([k,v])=> <input key={k} type="hidden" name={k} value={v} />)}

              {/* UTM / referrer */}
              {Object.entries(utm).map(([k,v])=> <input key={k} type="hidden" name={k} value={v} />)}

              {/* Piano selezionato dal pricing */}
              <input type="hidden" name="piano_scelto" value={selectedPlan} />

              {/* Add-on bump */}
              <label style={{ display:'flex', alignItems:'start', gap:8, fontSize:14, color:'#444' }}>
                <input type="checkbox" name="addon_foto" />
                Aggiungi <b style={{marginLeft:4}}>pacchetto foto base</b> (+€29): 10 scatti pro per annuncio.
              </label>

              {/* Consenso */}
              <label style={{ display:'flex', alignItems:'start', gap:8, fontSize:14, color:'#444' }}>
                <input type="checkbox" name="consenso_contatto" required/>
                Autorizzo il contatto per inviarmi il report e proposte di vendita con Twenty-Nine.
              </label>
              <div style={{ fontSize:12, color:'#666' }}>
                Continuando, accetti la nostra <a href="/privacy" target="_blank">Privacy Policy</a>.
              </div>

              <button style={btn}>Ricevi il report</button>
              <div style={{ fontSize:12, color:'#666' }}>Consegna tipica: entro poche ore lavorative.</div>
            </form>
          </div>
        </div>
      </section>

      {/* BENEFIT DISTINCTIVE */}
      <Benefits />

      {/* PRICING con psicologia acquisto */}
      <Pricing onSelectPlan={(p)=>setSelectedPlan(p)} />

      {/* SOCIAL PROOF */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />
    </main>
  )
}

const inp = { width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:8, marginTop:4 }
const btn = { display:'inline-block', marginTop:4, padding:'12px 16px', background:'black', color:'white', border:'none', borderRadius:10, cursor:'pointer' }
