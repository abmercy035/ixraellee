import Link from "next/link";

export default function FriendsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-40 border-b border-white/15 bg-[#050505]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
          <Link href="/" className="font-serif text-2xl font-black tracking-tight text-white">
            Ixraellee Journal
          </Link>
          <Link href="/" className="text-sm font-semibold text-blue-300 hover:text-blue-200">
            ← Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-1 space-y-12">


        {/* Myhappr Support & Get Involved Section */}
        <div className="p-8 sm:p-12 shadow-2xl space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">Support the Movement</p>
            <h2 className="mt-2 font-serif text-3xl font-black text-white">Get Involved & Support</h2>
            <p className="mt-2 text-sm text-white/70">
              Directly support my work, research, and open publishing.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl bg-blue-950 p-2 sm:p-4">
            <iframe
              src="https://myhappr.com/embed/ixraellee?text=Get+Involve&color=%230088CC&textColor=%23FFFFFF&radius=4px&title=Get+Involved&theme=transparent&cardText=%2309090b"
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="auto"
              style={{ borderRadius: "12px" }}
              title="Support Ixraellee on Myhappr"
            />
          </div>
        </div>

        <div className="hidden rounded-3xl border border-white/15 bg-[#0b0f18] p-8 sm:p-12 shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">Community & Collaboration</p>
          <h1 className="mt-3 font-serif text-4xl font-black text-white sm:text-5xl">Friends of Ixrael (FIX)</h1>
          <p className="mt-4 text-base leading-7 text-white/70 sm:text-lg">
            Friends of Ixrael is a network of creators, thinkers, engineers, and civic leaders collaborating on transformative ideas and community projects.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#050811] p-6">
              <h2 className="font-serif text-xl font-bold text-white">Collaborate</h2>
              <p className="mt-2 text-xs leading-6 text-white/60">
                Partner on open-source initiatives, civic technology tools, and independent publishing.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#050811] p-6">
              <h2 className="font-serif text-xl font-bold text-white">Community Notes</h2>
              <p className="mt-2 text-xs leading-6 text-white/60">
                Guest contributions, joint essays, and interdisciplinary field reports.
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-8 flex items-center justify-between">
            <p className="text-xs text-white/50">Interested in connecting?</p>
            <Link href="/#subscribe" className="bg-white px-5 py-3 text-xs font-bold text-black transition hover:bg-blue-200">
              Get in Touch
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/15 bg-black">
        <section className="mx-auto grid max-w-7xl gap-10 border-b border-white/10 px-5 py-10 text-sm lg:grid-cols-[1fr_2.5fr] sm:px-8">
          <div>
            <h3 className="font-bold">Business Hours</h3>
            <p className="mt-4 text-xs leading-6 text-white/45">Monday - Friday: 08:00 - 20:00<br />Saturday - Sunday: 09:00 - 14:00</p>
            <div className="mt-5 flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white transition hover:bg-white/10 hover:border-blue-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" title="X.com" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white transition hover:bg-white/10 hover:border-blue-400">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white transition hover:bg-white/10 hover:border-blue-400">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3z" /></svg>
              </a>
            </div>
          </div>

          <div className="grid gap-8 grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">My Life</h3>
              <ul className="mt-4 space-y-2.5 text-xs text-white/45">
                <li><Link href="/categories/personal" className="hover:text-blue-300 transition">Personal</Link></li>
                <li><Link href="/categories/streetwise" className="hover:text-blue-300 transition">Streetwise (Coming)</Link></li>
                <li><Link href="/categories/professional" className="hover:text-blue-300 transition">Professional</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">My WORKs</h3>
              <ul className="mt-4 space-y-2.5 text-xs text-white/45">
                <li><Link href="/categories/zion%27s%20sake" className="hover:text-blue-300 transition">Zion's Sake</Link></li>
                <li><Link href="/categories/digitize%20africa" className="hover:text-blue-300 transition">Digitize Africa</Link></li>
                <li><Link href="/categories/not%20rocket%20science" className="hover:text-blue-300 transition">Not Rocket Science (New)</Link></li>
                <li><Link href="/categories/formalize%20pidgin" className="hover:text-blue-300 transition">Formalize Pidgin</Link></li>
                <li><Link href="/categories/citizens%20participation%20support" className="hover:text-blue-300 transition text-left block leading-4">Citizens Participation</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">My Thoughts</h3>
              <ul className="mt-4 space-y-2.5 text-xs text-white/45">
                <li><Link href="/categories/philosophy" className="hover:text-blue-300 transition">Philosophy</Link></li>
                <li><Link href="/categories/nation%20state" className="hover:text-blue-300 transition">Society (New)</Link></li>
                <li><Link href="/categories/technology" className="hover:text-blue-300 transition">Technology</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">Network</h3>
              <ul className="mt-4 space-y-2.5 text-xs">
                <li>
                  <Link href="/friends" className="font-semibold text-blue-400 hover:text-blue-300 transition">
                    Friends of Ixrael
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-5 py-8 text-center sm:px-8">
          <Link href="#top" className="font-serif text-3xl font-black tracking-tight">Ixraellee</Link>
          <p className="mt-1 text-[9px] uppercase tracking-[0.35em] text-blue-300">IGBINOVIA IDEMUDIA ISRAEL</p>
        </div>
      </footer>
    </div>
  );
}
