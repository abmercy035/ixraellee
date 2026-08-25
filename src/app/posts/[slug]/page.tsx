import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "../../../lib/blog";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return {
    title: `${post.title} | ixraelleeJournal`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return (
    <div className="min-h-screen bg-[#050505] pb-20 text-white">
      <header className="sticky top-0 z-40 border-b border-white/15 bg-[#050505]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="font-serif text-2xl font-black tracking-tight text-white sm:text-3xl">
            ixraelleeJournal
          </Link>
          <Link href="/" className="text-sm font-semibold text-blue-300 hover:text-blue-200">
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto mt-8 w-full max-w-4xl space-y-6 px-4 sm:px-6">
        <article className="overflow-hidden rounded-3xl border border-white/15 bg-[#0b0f18] shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
          <div className="relative h-64 w-full sm:h-[26rem]">
            <Image src={post.banner} alt={post.title} fill className="object-cover" priority />
          </div>

          <div className="p-6 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">{post.category}</p>
            <h1 className="mt-3 font-serif text-4xl font-black leading-tight text-white sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-sm font-medium text-white/50">{post.date}</p>
            <div className="markdown mt-8" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          </div>
        </article>
      </main>
    </div>
  );
}
