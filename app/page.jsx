import Link from 'next/link';
import { Card } from 'components/card';
import { ContextAlert } from 'components/context-alert';
import { Markdown } from 'components/markdown';
import { RandomQuote } from 'components/random-quote';
import { getNetlifyContext } from 'utils';

const contextExplainer = `
The card below is rendered on the server based on the value of \`process.env.CONTEXT\` 
([docs](https://docs.netlify.com/configure-builds/environment-variables/#build-metadata)):
`;

const preDynamicContentExplainer = `
The card content below is fetched by the client-side from \`/quotes/random\` (see file \`app/quotes/random/route.js\`) with a different quote shown on each page load:
`;

const ctx = getNetlifyContext();

export default function Page() {
    return (
        <main style={{ fontFamily: 'system-ui, -apple-system, Roboto, Helvetica, Arial', padding: '32px 16px' }}>
      <section style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ fontSize: 36, margin: 0 }}>Valuta la tua casa in 2 minuti</h1>
        <p style={{ color: '#444', lineHeight: 1.6, marginTop: 8 }}>
          Niente appuntamenti in agenzia: stima gratuita online e, se vuoi, report professionale o perizia completa.
        </p>

        <form name="stima" data-netlify="true" method="POST"
          style={{ border: '1px solid #eee', borderRadius: 12, padding: 16, marginTop: 24, background: 'white', maxWidth: 500 }}>
          <input type="hidden" name="form-name" value="stima" />
          <h3>Calcolatore rapido</h3>

          <label>Superficie (mq)
            <input name="mq" type="number" placeholder="80"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, marginTop: 4 }} />
          </label>

          <label>Valore €/mq
            <input name="base" type="number" placeholder="1500"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, marginTop: 4 }} />
          </label>

          <label>Stato
            <select name="stato" style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, marginTop: 4 }}>
              <option value="scadente">Da ristrutturare</option>
              <option value="normale">Buono</option>
              <option value="ristrutturato">Ristrutturato</option>
              <option value="nuovo">Nuovo</option>
            </select>
          </label>

          <button type="submit"
            style={{ display: 'block', marginTop: 12, padding: '12px 16px', background: 'black', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer' }}>
            Richiedi report gratuito
          </button>
        </form>
      </section>
    </main>
    );
}

function RuntimeContextCard() {
    const title = `Netlify Context: running in ${ctx} mode.`;
    if (ctx === 'dev') {
        return (
            <Card title={title}>
                <p>Next.js will rebuild any page you navigate to, including static pages.</p>
            </Card>
        );
    } else {
        const now = new Date().toISOString();
        return (
            <Card title={title}>
                <p>This page was statically-generated at build time ({now}).</p>
            </Card>
        );
    }
}
