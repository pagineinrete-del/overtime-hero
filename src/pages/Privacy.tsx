import { ArrowLeft, Shield, Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background safe-area-inset">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg safe-area-top">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <span className="text-lg sm:text-xl font-bold flex items-center gap-1">
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Tempo
              </span>
              <span className="text-amber-500">
                Più
              </span>
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container py-6 sm:py-8 px-4 sm:px-6 max-w-4xl">
        {/* Privacy Policy Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Privacy Policy</h1>
          </div>

          <div className="prose prose-sm sm:prose dark:prose-invert max-w-none space-y-6">
            <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-3">Titolare del Trattamento dei Dati</h2>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Ragione Sociale:</strong> PA NETWORK DI GENNARO PAOLILLO</p>
                <p><strong>Partita IVA:</strong> 03918710785</p>
                <p><strong>Codice Fiscale:</strong> PLLGNR*****F839I</p>
                <p><strong>VAT Europeo:</strong> IT03918710785</p>
                <p><strong>Indirizzo:</strong> VIA L. GALVANI 11/B - 05100 - TERNI (TR)</p>
                <p><strong>REA:</strong> 365954</p>
                <p><strong>PEC:</strong> <a href="mailto:03918710785@legalmail.it" className="text-primary hover:underline">03918710785@legalmail.it</a></p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">1. Informazioni raccolte</h2>
              <p className="text-muted-foreground">
                L'applicazione TempoPiù raccoglie le seguenti informazioni personali degli utenti registrati:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Indirizzo email (per l'autenticazione)</li>
                <li>Dati relativi alle ore di straordinario inserite dall'utente</li>
                <li>Data e ora di accesso all'applicazione</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">2. Finalità del trattamento</h2>
              <p className="text-muted-foreground">
                I dati personali sono trattati per le seguenti finalità:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Gestione dell'account utente e autenticazione</li>
                <li>Erogazione del servizio di tracciamento ore straordinarie</li>
                <li>Generazione di report e statistiche personalizzate</li>
                <li>Miglioramento del servizio e dell'esperienza utente</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">3. Base giuridica del trattamento</h2>
              <p className="text-muted-foreground">
                Il trattamento dei dati personali si basa sul consenso dell'utente espresso al momento della registrazione 
                e sull'esecuzione del contratto di servizio.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">4. Conservazione dei dati</h2>
              <p className="text-muted-foreground">
                I dati personali sono conservati per il tempo necessario all'erogazione del servizio e comunque non oltre 
                24 mesi dalla cessazione dell'utilizzo dell'applicazione, salvo obblighi di legge.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">5. Diritti dell'interessato</h2>
              <p className="text-muted-foreground">
                L'utente ha diritto di:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Accedere ai propri dati personali</li>
                <li>Richiedere la rettifica o la cancellazione dei dati</li>
                <li>Richiedere la limitazione del trattamento</li>
                <li>Opporsi al trattamento</li>
                <li>Richiedere la portabilità dei dati</li>
                <li>Revocare il consenso in qualsiasi momento</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Per esercitare i propri diritti, contattare: <a href="mailto:03918710785@legalmail.it" className="text-primary hover:underline">03918710785@legalmail.it</a>
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">6. Sicurezza dei dati</h2>
              <p className="text-muted-foreground">
                I dati sono protetti mediante misure tecniche e organizzative adeguate, inclusa la crittografia 
                delle comunicazioni e l'archiviazione sicura su server protetti.
              </p>
            </div>
          </div>
        </section>

        {/* Cookie Policy Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <Cookie className="h-5 w-5 text-amber-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Cookie Policy</h1>
          </div>

          <div className="prose prose-sm sm:prose dark:prose-invert max-w-none space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">1. Cosa sono i cookie</h2>
              <p className="text-muted-foreground">
                I cookie sono piccoli file di testo che i siti web salvano sul dispositivo dell'utente per memorizzare 
                informazioni utili alla navigazione.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">2. Cookie utilizzati</h2>
              <p className="text-muted-foreground">
                L'applicazione TempoPiù utilizza esclusivamente:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li><strong>Cookie tecnici essenziali:</strong> necessari per il funzionamento dell'applicazione e per mantenere la sessione utente attiva</li>
                <li><strong>Cookie di preferenza:</strong> per memorizzare le preferenze dell'utente come il tema (chiaro/scuro)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">3. Cookie di terze parti</h2>
              <p className="text-muted-foreground">
                L'applicazione non utilizza cookie di profilazione o cookie di terze parti per finalità pubblicitarie.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">4. Gestione dei cookie</h2>
              <p className="text-muted-foreground">
                L'utente può gestire le preferenze sui cookie attraverso le impostazioni del proprio browser. 
                La disabilitazione dei cookie tecnici potrebbe compromettere il corretto funzionamento dell'applicazione.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">5. Aggiornamenti</h2>
              <p className="text-muted-foreground">
                La presente Cookie Policy può essere aggiornata periodicamente. L'ultima modifica è stata effettuata in data: 
                <strong> Gennaio 2025</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Per qualsiasi domanda o richiesta relativa alla privacy, contattare: {' '}
            <a href="mailto:03918710785@legalmail.it" className="text-primary hover:underline">03918710785@legalmail.it</a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-4 sm:py-6 mt-6 safe-area-bottom">
        <div className="container text-center text-xs sm:text-sm text-muted-foreground space-y-1 px-4">
          <p>© 2025 TempoPiù — Gestisci le tue ore di straordinario</p>
          <p className="text-[10px] sm:text-xs">
            App realizzata da{' '}
            <a href="https://gennaropaolillo.it" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
              gennaropaolillo.it
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
