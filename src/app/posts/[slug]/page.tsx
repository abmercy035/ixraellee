import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "../../../lib/blog";
import { ChevronRight, ArrowRight, Sparkles, Smartphone } from "lucide-react";
import { CommentsSection } from "../../../components/comments-section";
import { AdBanner } from "../../../components/ad-banner";

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
  const post = await getPostBySlug(slug);

  return {
    title: `${post.title} | Ixraellee Journal`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const allPosts = await getAllPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 2);

  // Split content html into two halves to insert the landing-page style ad banner in between
  const contentParts = post.contentHtml.split("</p>");
  const midPoint = Math.ceil(contentParts.length / 2);
  const firstHalfHtml = contentParts.slice(0, midPoint).join("</p>") + (contentParts.length > 1 ? "</p>" : "");
  const secondHalfHtml = contentParts.slice(midPoint).join("</p>");

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans antialiased pb-20">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-serif text-2xl font-black tracking-tight text-white hover:opacity-90">
            Ixraellee Journal
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/categories/personal" className="text-xs font-semibold text-slate-400 hover:text-white transition">
              Categories
            </Link>
            <Link href="/" className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition">
              Back
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
                  <p className="text-slate-400">Published {post.date} · 5 min read</p>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <span className="font-bold text-blue-400">{post.views || 1}</span> Views
              </div>
            </div>

            {/* Title Header */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">
                {post.category}
              </div>
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
        <div className="border rounded-md border-white/10 bg-linear-to-br from-slate-900 to-[#0b0f17] p-8 sm:p-12 text-center space-y-6">
          <div className="mx-auto max-w-lg space-y-2">
            <h2 className="font-serif text-2xl font-bold text-white">Subscribe To Our Newsletter</h2>
            <p className="text-xs text-slate-400">
              Get our latest essays, stories, and thoughts delivered straight to your inbox once a week.
            </p>
          </div>

          <form className="mx-auto flex max-w-md gap-2" action="/api/subscribe" method="POST">
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email address"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white hover:bg-blue-500 transition shadow-md shrink-0 cursor-pointer"
            >
              Sign Up
            </button>
          </form>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} Ixraellee Journal. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
              <Link href="/feed.xml" className="hover:text-slate-400">RSS Feed</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
