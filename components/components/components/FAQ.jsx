"use client"
import React from "react"
const items = [
  {q:"Perché non andare in agenzia?", a:"Qui ottieni subito una stima chiara, senza appuntamenti e senza pressioni. Se vuoi vendere, ti seguiamo noi."},
  {q:"Quanto è affidabile la stima?", a:"Indicativa. Con il Report Pro aggiungiamo comparabili mirati e consigli. Con la Perizia Completa hai un documento ufficiale firmato."},
  {q:"Tempi di consegna?", a:"Report via email di solito in poche ore lavorative."},
  {q:"Posso avere rimborso?", a:"Sì, Report Pro rimborsabile entro 7 giorni se non utile."},
]
export default function FAQ(){
  const [open, setOpen] = React.useState(0)
  return (
    <section style={{padding:'32px 16px', borderTop:'1px solid #eee'}}>
      <div style={{maxWidth:900, margin:'0 auto'}}>
        <h3 style={{marginTop:0}}>Domande frequenti</h3>
        {items.map((it,i)=>(
          <div key={i} style={{border:'1px solid #eee', borderRadius:10, padding:14, background:'#fff', marginBottom:8}}>
            <button onClick={()=>setOpen(open===i? -1:i)} style={{display:'flex', justifyContent:'space-between', width:'100%', background:'transparent', border:'none', cursor:'pointer', fontWeight:700}}>
              <span>{it.q}</span><span>{open===i?'−':'+'}</span>
            </button>
            {open===i && <div style={{color:'#444', marginTop:8}}>{it.a}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}
