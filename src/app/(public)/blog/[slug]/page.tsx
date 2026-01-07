import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MainNavbar, MainFooter } from "@/components/layout";
import { Card } from "@/components/ui";
import { JsonLd } from "@/components/seo";
import { getArticleSchema, getFaqSchema, getBreadcrumbSchema } from "@/lib/seo";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return blogs.map((blog) => ({ slug: blog.slug }));
}

async function getBlog(slug: string) {
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { faqs: true },
  });

  if (!blog) return null;

  return {
    ...blog,
    faqs: blog.faqs.map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
    })),
    readTime: blog.readTime || undefined,
    metaDescription: blog.metaDescription || undefined,
    metaKeywords: blog.metaKeywords || [],
    isPublished: blog.isPublished || false,
  };
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return { title: "Blog Not Found" };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.content?.slice(0, 160),
    keywords: blog.metaKeywords || undefined,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.content?.slice(0, 160),
      images: blog.image ? [blog.image] : undefined,
    },
  };
}

export const revalidate = 3600;

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog || !blog.isPublished) {
    notFound();
  }

  return (
    <>
      <MainNavbar />
      <main className="min-h-screen bg-white">
        {/* 🔹 Hero Section */}
        <section className="bg-gradient-to-r from-color3 to-color9 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
              <Link
                href="/blogs"
                className="hover:text-white transition-colors"
              >
                Blog
              </Link>
              <span>→</span>
              <span className="truncate">{blog.title}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 mt-6 text-white/80">
              <time dateTime={blog.createdAt.toISOString()}>
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              {blog.readTime && (
                <>
                  <span>•</span>
                  <span>{blog.readTime} min read</span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* 🔹 Main Featured Image */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100 aspect-[16/9] border border-gray-100">
            {blog.image ? (
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                priority
                className="object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-6xl text-gray-300 bg-gray-50">
                📚
              </div>
            )}
          </div>
        </div>

        {/* 🔹 Blog Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div
            className="prose prose-lg max-w-none prose-headings:text-color3 prose-a:text-color9 prose-img:rounded-lg prose-img:shadow-sm prose-figcaption:text-gray-500"
            dangerouslySetInnerHTML={{ __html: blog.content || "" }}
          />

          {/* 🔹 FAQs */}
          {blog.faqs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-color3 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {blog.faqs.map((faq) => (
                  <Card
                    key={faq.id}
                    className="p-6 border border-gray-200 hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-lg text-color3 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 🔹 Structured Data for SEO */}
          <JsonLd
            data={getArticleSchema({
              title: blog.title,
              description:
                blog.metaDescription || blog.content?.slice(0, 160) || "",
              slug,
              publishedAt: blog.createdAt,
              updatedAt: blog.updatedAt,
              image: blog?.image ?? undefined,
            })}
          />
          <JsonLd
            data={getBreadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Blog", url: "/blogs" },
              { name: blog.title, url: `/blog/${slug}` },
            ])}
          />
          {blog.faqs.length > 0 && <JsonLd data={getFaqSchema(blog.faqs)} />}
        </article>

        {/* 🔹 Back to Blog List */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-color9 font-medium hover:underline"
          >
            ← Back to all articles
          </Link>
        </div>
      </main>
      <MainFooter />
    </>
  );
}
