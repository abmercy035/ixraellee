import Image from "next/image";
import Link from "next/link";
import { getAllPosts, type PostMetadata } from "../lib/blog";
import { MobileNav } from "../components/mobile-nav";
import { DesktopDropdown } from "../components/desktop-dropdown";
import { HeroSection } from "../components/hero-section";
import { PostCardMeta } from "../components/post-card-meta";

const navItems = [
  { label: "Home", href: "#top" },
  {
    label: "My Life",
    children: [
      { label: "Personal", href: "#categories" },
      // { label: "Streetwise coming", href: "#categories" },
      { label: "Professional", href: "#categories" },
    ],
  },
  {
    label: "My WORKs",
    children: [
      { label: "Zion's Sake", href: "#categories" },
      { label: "Digitize Africa", href: "#categories" },
      { label: "Not Rocket Science", href: "#categories" },
      { label: "Formalize Pidgin", href: "#categories" },
      { label: "Citizens Participation Support", href: "#categories" },
    ],
  },
  {
    label: "My Thoughts",
    children: [
      { label: "Philosophy", href: "#categories" },
      { label: "Nation State", href: "#categories" },
      { label: "Technology", href: "#categories" },
    ],
  },
  { label: "Friends of Ixrael (FIX)", href: "#fix" },
];

export default function Home() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;
  const categories = Array.from(new Set(posts.map((post) => post.category)));
  const popular = posts.length > 0 ? Array.from({ length: 4 }, (_, index) => posts[index % posts.length]) : [];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="relative z-30 bg-[#050505]">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between border-b border-white/15 px-5 sm:px-8">
          <div className="flex items-center gap-5">
            <MobileNav items={navItems} />
          </div>
          <Link href="/" className="text-center">
            <span className="block font-serif text-3xl font-black tracking-tight sm:text-4xl">Ixraelle</span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.35em] text-blue-300">IGBINOVIA IDEMUDIA ISRAEL</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="#subscribe" className="hidden font-semibold text-white/90 sm:block">Sign In</Link>
            <Link href="#subscribe" className="bg-white px-4 py-3 font-semibold text-black transition hover:bg-blue-200">Subscribe Now</Link>
          </div>
        </div>

        <nav className="hidden h-16 items-center justify-center border-b border-white/15 lg:flex">
          <div className="flex items-center gap-10 text-[11px] font-bold uppercase">
            <span className="mr-4 text-xl font-normal">⌕</span>
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

      <main id="top" className="relative overflow-hidden bg-white text-slate-950">
        <HeroSection posts={posts} />

        <section className="content-section mx-auto grid max-w-7xl gap-8 border-b border-slate-200 bg-white px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="min-h-full">
            {featured ? (
              <Link href={`/posts/${featured.slug}`} className="group block h-full">
                <div className="relative h-full min-h-[27rem] overflow-hidden bg-slate-900 sm:min-h-[34rem]">
                  <Image src={featured.banner} alt={featured.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <span className="inline-flex bg-blue-800 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg">{featured.category}</span>
                    <h3 className="mt-2 max-w-lg font-serif text-3xl font-bold leading-tight text-white group-hover:text-blue-200 sm:text-4xl">{featured.title}</h3>
                    <p className="mt-4 text-xs uppercase text-white/70">{featured.date}</p>
                  </div>
                </div>
              </Link>
            ) : null}
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between border-b border-white/15 pb-4">
              <h2 className="font-serif text-2xl font-bold text-slate-950">Popular Now</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-white/45">Most read</span>
            </div>
            <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2">
              {popular.map((post, index) => (
                <Link key={`${post.slug}-${index}`} href={`/posts/${post.slug}`} className="group flex h-full flex-col overflow-hidden">
                  <div className="relative h-36 overflow-hidden bg-slate-900 sm:h-40">
                    <Image src={post.banner} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-110" />
                    <span className="absolute bottom-3 left-3 bg-black px-2 py-1 text-[9px] font-bold uppercase text-white">{post.category}</span>
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-bold leading-tight text-blue-700 group-hover:text-blue-900">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/50">{post.excerpt}</p>
                  <PostCardMeta category={post.category} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section relative mx-auto max-w-7xl overflow-hidden bg-white px-5 py-10 sm:px-8">
          <div className="relative min-h-44 overflow-hidden bg-[#1168b5]">
            <Image src="/banners/app-banner.svg" alt="" fill className="object-cover" />
            <div className="relative flex min-h-44 flex-col justify-center gap-6 px-7 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-10">
              <div className="max-w-md">
                <h2 className="font-serif text-2xl font-bold">Carry Ixraelle with you.</h2>
                <p className="mt-2 text-sm leading-6 text-blue-100">Read new stories, field notes, and ideas wherever you are.</p>
              </div>
              <div className="flex gap-3">
                <span className="rounded-md bg-black px-4 py-2 text-xs font-bold text-white">App Store</span>
                <span className="rounded-md bg-black px-4 py-2 text-xs font-bold text-white">Google Play</span>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section mx-auto grid max-w-7xl gap-10 border-b border-slate-200 bg-white px-5 py-16 sm:px-8 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-6 flex items-center justify-between border-b border-white/15 pb-4">
              <h2 className="font-serif text-2xl font-bold text-slate-950">Editor Choice</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-blue-300">Curated</span>
            </div>
            <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {posts.concat(posts).slice(0, 6).map((post, index) => (
                <Link key={`${post.slug}-editor-${index}`} href={`/posts/${post.slug}`} className="group flex h-full flex-col overflow-hidden">
                  <div className="relative h-40 overflow-hidden bg-slate-900">
                    <Image src={post.banner} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-110" />
                    <span className="absolute bottom-3 left-3 bg-black px-2 py-1 text-[9px] font-bold uppercase text-white">{post.category}</span>
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-bold leading-tight text-blue-700 group-hover:text-blue-900">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/50">{post.excerpt}</p>
                  <PostCardMeta category={post.category} />
                </Link>
              ))}
            </div>
          </div>

          <aside>
            <h2 className="mb-6 border-b border-white/15 pb-4 font-serif text-2xl font-bold">Worth Reading</h2>
            <div className="space-y-5">
              {posts.map((post) => (
                <Link key={`worth-${post.slug}`} href={`/posts/${post.slug}`} className="group flex gap-4 border-b border-white/10 pb-5">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden bg-slate-900">
                    <Image src={post.banner} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-110" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-5 group-hover:text-blue-300">{post.title}</h3>
                    <p className="mt-2 text-[10px] uppercase text-white/40">{post.date} / {post.category}</p>
                  </div>
                </Link>
              ))}
            </div>

            <form id="subscribe" className="mt-8 bg-[#176fc0] p-6" action="#subscribe">
              <h2 className="font-serif text-xl font-bold">Subscribe Now</h2>
              <p className="mt-2 text-sm leading-6 text-blue-100">Get new stories from Ixraelle in your inbox.</p>
              <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-blue-100" htmlFor="name">Your name</label>
              <input id="name" name="name" type="text" placeholder="Your name" className="mt-2 w-full bg-white px-3 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400" />
              <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-blue-100" htmlFor="email">Your email</label>
              <input id="email" name="email" type="email" placeholder="Your email" required className="mt-2 w-full bg-white px-3 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400" />
              <button type="submit" className="mt-4 w-full bg-black px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-900">Subscribe</button>
            </form>
          </aside>
        </section>

        {/* <section id="categories" className="content-section mx-auto max-w-7xl border-b border-slate-200 bg-white px-5 py-16 sm:px-8">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-xs font-bold uppercase tracking-[0.2em] text-white/55">
            <span className="text-blue-300">Explore</span>
            {categories.map((category) => <a key={category} href="#archive" className="transition hover:text-white">{category}</a>)}
          </div>
        </section> */}
        <section id="archive" className="content-section mx-auto max-w-7xl bg-white px-5 py-16 sm:px-8">
          <div className="mb-8 flex items-end justify-between border-b border-white/15 pb-5"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-300">The journal</p><h2 className="mt-2 font-serif text-3xl font-bold">Latest stories</h2></div><span className="text-xs uppercase tracking-wider text-white/45">{posts.length} stories</span></div>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post: PostMetadata) => (
              <Link key={post.slug} href={`/posts/${post.slug}`} className="group flex h-full flex-col overflow-hidden">
                <div className="relative h-52 overflow-hidden bg-slate-900"><Image src={post.banner} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-105" /></div>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">{post.category}</p>
                <h3 className="mt-2 font-serif text-2xl font-bold leading-tight text-blue-700 group-hover:text-blue-900">{post.title}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/55">{post.excerpt}</p>
                <PostCardMeta category={post.category} />
              </Link>
            ))}
          </div>
        </section>

        <section className="content-section mx-auto max-w-7xl border-t border-slate-200 bg-white px-5 py-16 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            {categories.slice(0, 3).map((category) => {
              const categoryPosts = posts.filter((post) => post.category === category);
              const [lead, ...items] = categoryPosts.length > 0 ? categoryPosts : posts;

              return (
                <section key={category}>
                  <h2 className="mb-5 border-b border-white/15 pb-4 text-xs font-bold uppercase tracking-[0.24em] text-blue-300">{category}</h2>
                  {lead ? (
                    <Link href={`/posts/${lead.slug}`} className="group block">
                      <div className="relative h-40 overflow-hidden bg-slate-900">
                        <Image src={lead.banner} alt={lead.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                        <span className="absolute bottom-3 left-3 bg-black px-2 py-1 text-[9px] font-bold uppercase text-white">{category}</span>
                      </div>
                      <h3 className="mt-4 font-serif text-lg font-bold leading-tight text-blue-700 group-hover:text-blue-900">{lead.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/50">{lead.excerpt}</p>
                      <PostCardMeta category={lead.category} />
                    </Link>
                  ) : null}
                  <div className="mt-6 divide-y divide-white/10">
                    {items.concat(posts).slice(0, 3).map((post, index) => (
                      <Link key={`${category}-${post.slug}-${index}`} href={`/posts/${post.slug}`} className="group flex gap-3 py-4 first:pt-0">
                        <div className="relative h-14 w-20 shrink-0 overflow-hidden bg-slate-900">
                          <Image src={post.banner} alt={post.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-[9px] uppercase text-white/40">{post.date}</p>
                          <h4 className="mt-1 text-xs font-bold leading-5 group-hover:text-blue-300">{post.title}</h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/15 bg-black">
        <section className="mx-auto flex max-w-7xl flex-col gap-6 border-b border-white/15 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="max-w-sm font-serif text-2xl font-bold leading-tight">Stay informed and not overwhelmed, subscribe now!</h2>
          <form className="flex w-full max-w-xl" action="#subscribe">
            <label className="sr-only" htmlFor="footer-email">Email address</label>
            <input id="footer-email" name="email" type="email" required placeholder="Your email" className="min-w-0 flex-1 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400" />
            <button type="submit" className="bg-blue-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-blue-500">Subscribe</button>
          </form>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 border-b border-white/10 px-5 py-10 text-sm sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          <div>
            <h3 className="font-bold">Business Hours</h3>
            <p className="mt-4 text-xs leading-6 text-white/45">Monday - Friday: 08:00 - 20:00<br />Saturday - Sunday: 09:00 - 14:00</p>
            <div className="mt-5 flex gap-2"><span className="border border-white/20 px-2 py-1 text-xs">f</span><span className="border border-white/20 px-2 py-1 text-xs">x</span><span className="border border-white/20 px-2 py-1 text-xs">◎</span><span className="border border-white/20 px-2 py-1 text-xs">▶</span></div>
          </div>
          <div><h3 className="font-bold">Categories</h3><div className="mt-4 space-y-2 text-xs text-white/45">{categories.map((category) => <a key={`footer-${category}`} href="#categories" className="block hover:text-blue-300">{category}</a>)}</div></div>
          <div><h3 className="font-bold">Information</h3><div className="mt-4 space-y-2 text-xs text-white/45"><a href="#" className="block hover:text-blue-300">Privacy Policy</a><a href="#" className="block hover:text-blue-300">Terms & Conditions</a><a href="#top" className="block hover:text-blue-300">Site Map</a><a href="#archive" className="block hover:text-blue-300">FAQ</a><a href="#fix" className="block hover:text-blue-300">Friends of Ixrael</a></div></div>
          <div><h3 className="font-bold">Company</h3><div className="mt-4 space-y-2 text-xs text-white/45"><a href="#top" className="block hover:text-blue-300">About</a><a href="#subscribe" className="block hover:text-blue-300">Contact</a><a href="#archive" className="block hover:text-blue-300">Our Stories</a><a href="#categories" className="block hover:text-blue-300">Contributors</a><a href="#fix" className="block hover:text-blue-300">Collaborate</a></div></div>
        </section>

        <div className="mx-auto max-w-7xl px-5 py-8 text-center sm:px-8">
          <Link href="#top" className="font-serif text-3xl font-black tracking-tight">Ixraelle</Link>
          <p className="mt-1 text-[9px] uppercase tracking-[0.35em] text-blue-300">IGBINOVIA IDEMUDIA ISRAEL</p>
        </div>
      </footer>
    </div>
  );
}
