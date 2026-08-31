import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "../../../lib/blog";
import { ChevronRight, ArrowRight, ArrowLeft, Sparkles, Smartphone } from "lucide-react";
import { CommentsSection } from "../../../components/comments-section";
import { AdBanner } from "../../../components/ad-banner";
import { SubscribeForm } from "../../../components/subscribe-form";

export const revalidate = 0;
export const dynamicParams = true;

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    return {
      title: `${post.title} | Ixraellee Journal`,
      description: post.excerpt,
    };
  } catch {
    return {
      title: "Post Not Found | Ixraellee Journal",
    };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  // Split HTML into two parts around mid-point paragraph for ad placement
  const contentParts = post.contentHtml.split("</p>");
  const midPoint = Math.ceil(contentParts.length / 2);
  const firstHalfHtml = contentParts.slice(0, midPoint).join("</p>") + (contentParts.length > 1 ? "</p>" : "");
  const secondHalfHtml = contentParts.slice(midPoint).join("</p>");

  const categorySlug = encodeURIComponent(post.category.toLowerCase());

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans antialiased pb-20">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-serif text-2xl font-black tracking-tight text-white hover:opacity-90">
            Ixraellee Journal
          </Link>
          <div className="flex items-center gap-4">
            <Link href={`/categories/${categorySlug}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition">
              <ArrowLeft className="h-4 w-4" /> Back to {post.category}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Article Container */}
      <main className="mx-auto mt-8 w-full max-w-4xl space-y-12 px-4 sm:px-6">
        <article className="overflow-hidden bg-[#050505]">
          {/* Article Hero Banner Cover Image */}
          <div className="relative h-95 w-full sm:h-125 overflow-hidden">
            <Image
              src={post.banner}
              alt={post.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent opacity-80" />
          </div>

          <div className="py-8 space-y-8">
            {/* Author & Published Metadata Row */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20">
                  <Image src="/images/welcome-journal.jpg" alt="Ixraellee" fill className="object-cover" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Ixraellee</p>
                  <p className="text-slate-400">Published {post.date} · {post.readTime || 1} min read</p>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <span className="font-bold text-blue-400">{post.views || 1}</span> Views
              </div>
            </div>

            {/* Title Header */}
            <div>
              <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-4">
                <Link href="/" className="hover:text-white transition">Home</Link>
                <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                <Link href="/categories" className="hover:text-white transition">Categories</Link>
                <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                <Link href={`/categories/${categorySlug}`} className="text-blue-400 font-semibold hover:underline capitalize">
                  {post.category}
                </Link>
              </nav>
              <h1 className="font-serif text-3xl font-black leading-tight text-white sm:text-5xl">
                {post.title}
              </h1>
            </div>

            {/* "In this article" — built from actual H1 headings in the article */}
            {(() => {
              // Extract text from all <h1>...</h1> tags in rendered HTML
              const h1Matches = [...post.contentHtml.matchAll(/<h1[^>]*>(.*?)<\/h1>/gi)];
              const headings = h1Matches.map((m) =>
                m[1].replace(/<[^>]+>/g, "").trim()
              ).filter(Boolean);

              if (headings.length === 0) return null;

              return (
                <div className="border border-white/10 bg-white/5 p-6 space-y-3">
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-400" /> In this article
                  </h3>
                  <ul className="space-y-2 text-xs font-medium text-slate-300">
                    {headings.map((heading, i) => (
                      <li key={i} className="flex items-center gap-2 hover:text-blue-300 cursor-pointer">
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                        {heading}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}

            {/* Article First Half Content */}
            <div className="markdown text-base leading-8 text-slate-300" dangerouslySetInnerHTML={{ __html: firstHalfHtml }} />

            {/* DYNAMIC IN-BETWEEN AD BANNER */}
            <AdBanner page="article" section="mid_article" />

            {/* Article Second Half Content */}
            {secondHalfHtml ? (
              <div className="markdown text-base leading-8 text-slate-300" dangerouslySetInnerHTML={{ __html: secondHalfHtml }} />
            ) : null}

            {/* Reader Comments Section */}
            <CommentsSection postSlug={post.slug} />

            {/* Ad Banner — before Keep Reading */}
            <AdBanner page="article" section="category_top" />

            {/* "Keep reading" Related Articles Section */}
            <div className="border-t border-white/10 pt-10 space-y-6">
              <h2 className="font-serif text-2xl font-bold text-white">Keep reading</h2>
              <div className="grid gap-4">
                {relatedPosts.map((relPost) => (
                  <Link
                    key={relPost.slug}
                    href={`/posts/${relPost.slug}`}
                    className="group flex gap-4 p-4 transition hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden bg-slate-800">
                      <Image src={relPost.banner} alt={relPost.title} fill sizes="96px" className="object-cover transition group-hover:scale-105" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">{relPost.category}</span>
                      <h4 className="font-serif text-sm font-bold text-white line-clamp-2 group-hover:text-blue-300 transition">
                        {relPost.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{relPost.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Written by Author Bio Box */}
            <div className="rounded-md border border-white/10 bg-white/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white/20">
                <Image src="/images/welcome-journal.jpg" alt="Ixraellee" fill className="object-cover" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-white">Written by Ixraellee</h3>
                <p className="text-xs text-slate-300 leading-5">
                  Writer, technologist, and thinker exploring digital civics, philosophy, and speculative fiction across Africa and the global south.
                </p>
                <div className="pt-2">
                  <Link href="/" className="text-xs font-bold text-blue-400 hover:underline">
                    View Author Profile &amp; Works →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Footer Newsletter Subscription Section */}
        <div className="rounded-sm p-8 sm:p-12 text-center space-y-6">
          <div className="mx-auto max-w-lg space-y-2">
            <h2 className="font-serif text-2xl font-bold text-white">Subscribe To Our Newsletter</h2>
            <p className="text-xs text-slate-400">
              Get our latest essays, stories, and thoughts delivered straight to your inbox once a week.
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <SubscribeForm variant="card" />
          </div>
        </div>
      </main>
      <footer className="border-t border-white/15 bg-black mt-8">
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
