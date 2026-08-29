import Image from "next/image";
import Link from "next/link";

export const revalidate = 0;
import {
  getAllPosts,
  getHeroPosts,
  getFeaturedPosts,
  getPopularPosts,
  getLatestPosts,
  getWorthReadingPosts,
} from "../lib/blog";
import { MobileNav } from "../components/mobile-nav";
import { DesktopDropdown } from "../components/desktop-dropdown";
import { HeroSection } from "../components/hero-section";
import { PostCardMeta } from "../components/post-card-meta";
import { AdBanner } from "../components/ad-banner";
import { SearchTrigger } from "../components/search-trigger";
import { FeaturedCarousel } from "../components/featured-carousel";
import { Search } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "My Life",
    href: "/categories",
    children: [
      { label: "Personal", href: "/categories/personal" },
      { label: "Streetwise (Coming)", href: "/categories/streetwise" },
      { label: "Professional", href: "/categories/professional" },
    ],
  },
  {
    label: "My WORKs",
    href: "/categories",
    children: [
      { label: "Zion's Sake", href: "/categories/zion%27s%20sake" },
      { label: "Digitize Africa", href: "/categories/digitize%20africa" },
      { label: "Not Rocket Science (New)", href: "/categories/not%20rocket%20science" },
      { label: "Formalize Pidgin", href: "/categories/formalize%20pidgin" },
      { label: "Citizens Participation Support", href: "/categories/citizens%20participation%20support" },
    ],
  },
  {
    label: "My Thoughts",
    href: "/categories",
    children: [
      { label: "Philosophy", href: "/categories/philosophy" },
      { label: "Society (New)", href: "/categories/nation%20state" },
      { label: "Technology", href: "/categories/technology" },
    ],
  },
  { label: "Friends of Ixrael (FIX)", href: "/friends" },
];

export default async function Home() {
  const [allPosts, heroPosts, featuredPosts, popularPosts, latestPosts, worthReadingPosts] =
    await Promise.all([
      getAllPosts(),
      getHeroPosts(),
      getFeaturedPosts(),
      getPopularPosts(4),
      getLatestPosts(6),
      getWorthReadingPosts(6),
    ]);

  const featuredSlides = [
    ...(featuredPosts.length > 0 ? featuredPosts : []),
    ...allPosts.filter((p) => !featuredPosts.find((f) => f.slug === p.slug)),
  ].slice(0, 3);
  const categories = Array.from(new Set(allPosts.map((post) => post.category)));

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="relative z-30 bg-[#050505]">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between border-b border-white/15 px-5 sm:px-8">
          <div className="flex items-center gap-5">
            <MobileNav items={navItems} />
          </div>
          <Link href="/" className="text-center">
            <span className="block font-serif text-3xl font-black tracking-tight sm:text-4xl">Ixraellee</span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.35em] text-blue-300">IGBINOVIA IDEMUDIA ISRAEL</span>
          </Link>
          <div className="flex items-center gap-4 text-xs">
            <Link href="#subscribe" className="bg-white px-3 py-2 font-semibold text-black transition hover:bg-blue-200">Subscribe Now</Link>
          </div>
        </div>

        <nav className="hidden h-16 items-center justify-center border-b border-white/15 lg:flex">
          <div className="flex items-center gap-10 text-[11px] font-bold uppercase">
            <SearchTrigger />
            {navItems.map((item) => (
              "children" in item ? (
                <DesktopDropdown key={item.label} label={item.label} dropdownItems={item.children ?? []} />
              ) : (
                <a key={item.label} href={item.href} className="border-b-2 border-transparent py-6 transition hover:border-blue-400 hover:text-blue-300">
                  {item.label}
                </a>
              )
            ))}
          </div>
        </nav>
      </header>

      {/* ── Main ────────────────────────────────────────────────── */}
      <main id="top" className="relative overflow-hidden bg-white text-slate-950">

        {/* SECTION 1: Hero Carousel */}
        <HeroSection posts={heroPosts.length > 0 ? heroPosts : allPosts} />

        {/* SECTION 2: Featured Carousel (left) + Popular Now (2×2 right) */}
        {featuredSlides.length > 0 && (
          <section className="border-b border-slate-200">
            <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[0.9fr_1.1fr]">

              {/* Left: Featured Carousel */}
              <FeaturedCarousel posts={featuredSlides} />

              {/* Right: Popular Now */}
              <div className="border-l border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl font-black text-slate-950">Popular Now</h2>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Most Read</span>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {popularPosts.slice(0, 4).map((post) => (
                    <Link key={post.slug} href={`/posts/${post.slug}`} className="group space-y-3">
                      <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={post.banner}
                          alt={post.title}
                          fill
                          sizes="(max-width: 1024px) 50vw, 280px"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                        <span className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-0.5 text-[9px] font-black uppercase text-white tracking-wider">
                          {post.category}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold leading-5 text-slate-900 group-hover:text-blue-700 line-clamp-2">{post.title}</h3>
                        <p className="mt-1.5 text-[11px] text-slate-500 line-clamp-2">{post.excerpt}</p>
                        <PostCardMeta category={post.category} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Home Page Sponsored Ad Placement */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <AdBanner page="home" section="hero_banner" />
        </div>

        {/* SECTION 3: Editor's Choice + Worth Reading aside */}
        {latestPosts.length > 0 && (
          <section className="border-b border-slate-200">
            <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[1fr_320px]">

              {/* Left: Editor's Choice – 3×2 grid */}
              <div className="border-r border-slate-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl font-black text-slate-950">Editor Choice</h2>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Curated</span>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {latestPosts.slice(0, 6).map((post) => (
                    <Link key={post.slug} href={`/posts/${post.slug}`} className="group space-y-3">
                      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={post.banner}
                          alt={post.title}
                          fill
                          sizes="220px"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                        <span className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-0.5 text-[9px] font-black uppercase text-white tracking-wider">
                          {post.category}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold leading-5 text-blue-700 group-hover:underline line-clamp-2">{post.title}</h3>
                        <p className="mt-1.5 text-[11px] text-slate-500 line-clamp-2">{post.excerpt}</p>
                        <PostCardMeta category={post.category} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right: Worth Reading sidebar */}
              <div className="bg-white p-6 space-y-6 hidden md:block">
                <h2 className="font-serif text-xl font-black text-slate-950">Worth Reading</h2>
                <div className="space-y-4">
                  {worthReadingPosts.slice(0, 5).map((post) => (
                    <Link key={post.slug} href={`/posts/${post.slug}`} className="group flex gap-3 items-start">
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden bg-slate-100">
                        <Image
                          src={post.banner}
                          alt={post.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold leading-4 text-slate-900 group-hover:text-blue-700 line-clamp-2">{post.title}</h3>
                        <p className="mt-1 text-[10px] text-slate-400">{post.date} / <span className="uppercase">{post.category}</span></p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: Categories — 4 Big Feature Cards + Compact Tiles Below */}
        {categories.length > 0 && (() => {
          // Build top-post per category
          const categoryTopPosts = categories
            .map((cat) => {
              const catPosts = allPosts.filter((p) => p.category === cat);
              return catPosts[0] ? { cat, topPost: catPosts[0], rest: catPosts.slice(1) } : null;
            })
            .filter(Boolean) as { cat: string; topPost: typeof allPosts[0]; rest: typeof allPosts }[];

          const bigFour = categoryTopPosts.slice(0, 3);
          const remainingCategories = categoryTopPosts.slice(3);

          return (
            <section className="border-b border-slate-200 px-5 py-12 sm:px-8">
              <div className="mx-auto max-w-7xl space-y-10">

                {/* 4 Big Feature Cards in a 2×2 grid */}
                <div className="grid gap-5 sm:grid-cols-3">
                  {bigFour.map(({ cat, topPost }) => (
                    <Link
                      key={cat}
                      href={`/posts/${topPost.slug}`}
                      className="group relative block h-64 sm:h-72 overflow-hidden bg-slate-100"
                    >
                      <Image
                        src={topPost.banner}
                        alt={topPost.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />

                      {/* Text Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1.5">
                        <span className="inline-block border border-[#0088CC]/70 bg-[#0088CC]/20 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#4dc3ff] backdrop-blur-sm">
                          {cat}
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug text-white group-hover:text-[#4dc3ff] transition line-clamp-2">
                          {topPost.title}
                        </h3>
                        <p className="text-[11px] text-slate-300 line-clamp-1">{topPost.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Remaining Categories as medium cards */}
                {remainingCategories.length > 0 && (
                  <div className="border-t border-slate-200 pt-8 grid grid-cols-4">
                    {remainingCategories.map(({ cat, topPost }) => (
                      <Link
                        key={cat}
                        href={`/posts/${topPost.slug}`}
                        className="group flex items-center gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                      >
                        {/* Image — fixed size on left */}
                        <div className="relative h-20 w-28 sm:w-36 shrink-0 overflow-hidden bg-slate-100">
                          <Image
                            src={topPost.banner}
                            alt={topPost.title}
                            fill
                            sizes="144px"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Details — right side */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#0088CC]">
                            {cat}
                          </span>
                          <h3 className="font-serif text-sm sm:text-base font-bold leading-snug text-slate-900 group-hover:text-[#0088CC] transition line-clamp-2">
                            {topPost.title}
                          </h3>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{topPost.excerpt}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

              </div>
            </section>
          );
        })()}

      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/15 bg-black">
        <section className="mx-auto flex max-w-7xl flex-col gap-6 border-b border-white/15 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="max-w-sm font-serif text-2xl font-bold leading-tight">Stay informed!</h2>
          <form className="flex w-full max-w-xl" action="/api/subscribe" method="POST">
            <label className="sr-only" htmlFor="footer-email">Email address</label>
            <input id="footer-email" name="email" type="email" required placeholder="Your email" className="min-w-0 rounded-l-sm flex-1 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400" />
            <button type="submit" className="bg-blue-600 rounded-r-sm px-5 py-3 text-xs font-bold text-white transition hover:bg-blue-500 cursor-pointer">Subscribe</button>
          </form>
        </section>

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
