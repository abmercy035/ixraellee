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

      <main className="mx-auto max-w-4xl px-5 py-16">
        <div className="rounded-3xl border border-white/15 bg-[#0b0f18] p-8 sm:p-12 shadow-2xl">
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
    </div>
  );
}
