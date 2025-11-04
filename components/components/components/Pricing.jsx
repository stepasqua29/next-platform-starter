"use client"
export default function Pricing({ onSelectPlan }) {
  const tiers = [
    {name:"Report gratuito", price:"€ 0", anchor:"Valore €29", bullets:["Stima + range","Comparabili pubblici","Consegna via email"], cta:"Scarica gratis", badge:"Inizia qui"},
    {name:"Report Pro", price:"€ 49", anchor:"Prima 99€", bullets:["PDF dettagliato","Comparabili mirati","Consigli prezzo/listing"], cta:"Ottieni il Pro", badge:"Più scelto", featured:true},
    {name:"Vendita Smart", price:"€ 149", anchor:"Valore €249", bullets:["Report Pro +","Check documentale base","Strategia annuncio + foto"], cta:"Attiva Smart"},
    {name:"Perizia Completa", price:"Su preventivo", anchor:"", bullets:["Per banca/tribunale","Firmata da perito","Sopralluogo e dossier"], cta:"Richiedi preventivo"},
  ]
  const select = (name)=>{ onSelectPlan?.(name); document.getElementById("calcolatore")?.scrollIntoView({behavior:"smooth"}) }
  return (
    <section style={{ padding:'40px 16px', background:'#fafafa', borderTop:'1px solid #eee', borderBottom:'1px solid #eee' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <h2 style={{ marginTop:0 }}>Scegli il tuo pacchetto</h2>
        <div style={{ fontSize:12, color:'#666', marginBottom:12 }}>Trasparenza totale. Rimborso Report Pro entro 7 giorni se non utile.</div>
        <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(4,minmax(0,1fr))' }}>
          {tiers.map((t,i)=>(
            <div key={i} style={{
              border:'1px solid #eee', borderRadius:16, padding:16, background:'#fff',
              boxShadow: t.featured ? '0 4px 16px rgba(0,0,0,.08)' : 'none',
              transform: t.featured ? 'scale(1.02)' : 'none'
            }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <b>{t.name}</b>{t.badge && <span style={{fontSize:12, background:'#111', color:'#fff', padding:'4px 8px', borderRadius:999}}>{t.badge}</span>}
              </div>
              <div style={{fontSize:24, fontWeight:800, marginTop:6}}>{t.price}</div>
              {t.anchor && <div style={{fontSize:12, color:'#888', textDecoration:'line-through'}}>{t.anchor}</div>}
              <ul style={{margin:'12px 0 0', paddingLeft:18, color:'#444', lineHeight:1.7}}>
                {t.bullets.map((b,bi)=>(<li key={bi}>{b}</li>))}
              </ul>
              <button onClick={()=>select(t.name)} style={{
                marginTop:12, width:'100%', padding:'12px 16px', borderRadius:10,
                background:t.featured?'#111':'#fff', color:t.featured?'#fff':'#111',
                border:'1px solid #ddd', cursor:'pointer'
              }}>{t.cta}</button>
              {t.featured && <div style={{fontSize:12, color:'#a15', marginTop:8}}>Posti limitati per consulenza rapida</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
