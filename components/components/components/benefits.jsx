"use client"
export default function Benefits(){
  const items = [
    {t:"Niente agenzia", d:"Zero appuntamenti, zero pressioni. Tutto online."},
    {t:"Metodo trasparente", d:"Capisci come arriviamo alla cifra, non solo il numero."},
    {t:"Passaggio a Twenty-Nine", d:"Se vuoi vendere, ti contattiamo noi. Niente call center."},
  ]
  return (
    <section style={{padding:'28px 16px', borderTop:'1px solid #eee'}}>
      <div style={{maxWidth:1100, margin:'0 auto'}}>
        <h3 style={{marginTop:0}}>Perché è diverso dagli altri</h3>
        <div style={{display:'grid', gap:12, gridTemplateColumns:'repeat(3,minmax(0,1fr))'}}>
          {items.map((c,i)=>(
            <div key={i} style={{border:'1px solid #eee', borderRadius:12, padding:16, background:'#fff'}}>
              <b>{c.t}</b>
              <div style={{color:'#555'}}>{c.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
