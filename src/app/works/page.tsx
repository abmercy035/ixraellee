import Image from "next/image";
import Link from "next/link";
import { getAllPosts, PostMetadata } from "../../lib/blog";

export const revalidate = 0;

export default async function WorksPage() {
  const allPosts = await getAllPosts();
  const posts = allPosts.filter((p: PostMetadata) =>
    [
      "Zion's Sake",
      "Digitize Africa",
      "Not Rocket Science",
      "Formalize Pidgin",
      "Citizens Participation Support",
      "Works"
    ].includes(p.category)
  );

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

      <main className="mx-auto max-w-5xl px-5 py-12">
        <div className="border-b border-white/15 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">Projects & Initiatives</p>
          <h1 className="mt-2 font-serif text-4xl font-black text-white sm:text-5xl">My Works</h1>
          <p className="mt-3 text-lg text-white/60">Selected projects across civic technology, digital transformation, and practical innovation.</p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: PostMetadata) => (
            <Link key={post.slug} href={`/posts/${post.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f18] transition hover:border-white/25">
              <div className="relative h-48 w-full overflow-hidden">
                <Image src={post.banner} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">{post.category}</span>
                <h2 className="mt-2 font-serif text-xl font-bold leading-tight text-white group-hover:text-blue-200">{post.title}</h2>
                <p className="mt-2 line-clamp-2 text-xs text-white/60">{post.excerpt}</p>
                <p className="mt-auto pt-4 text-[10px] uppercase tracking-wider text-white/40">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
