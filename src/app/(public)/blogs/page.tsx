import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui";
import { MainNavbar, MainFooter } from "@/components/layout";
import { JsonLd } from "@/components/seo";
import { getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog | Caelum",
  description:
    "Latest articles and insights about education investment, school management, and tips for educators. Stay updated with Caelum's expert content.",
  keywords: [
    "education blog",
    "school investment articles",
    "teacher resources",
    "education insights",
    "school management tips",
  ],
  openGraph: {
    title: "Blog | Caelum",
    description:
      "Latest articles and insights about education and school investment",
    type: "website",
  },
};

export const revalidate = 3600; // Revalidate every hour

async function getBlogs() {
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        take: 1,
        orderBy: { createdAt: "asc" },
      },
    },
  });
  return blogs.map((blog) => ({
    ...blog,
    images: blog.images?.map((image) => ({
      imageUrl: image.imageUrl,
      altText: image.altText || "",
    })) || [],
    readTime: blog.readTime || undefined,
    metaDescription: blog.metaDescription || undefined,
  }));
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <>
      <MainNavbar />
      <main className="min-h-screen bg-color6 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-color3 to-color9 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
              Our Blog
            </h1>
            <p className="text-xl text-white/80 text-center mt-4 max-w-2xl mx-auto">
              Insights, guides, and stories about education and school
              investment
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-color3 mb-4">
                No articles yet
              </h2>
              <p className="text-gray-600">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden group">
                    <div className="relative h-48 bg-gray-100">
                      {blog.images[0] ? (
                        <Image
                          src={blog.images[0].imageUrl}
                          alt={blog.images[0].altText || blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-color1/20">
                          <span className="text-4xl">📚</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <time dateTime={new Date(blog.createdAt).toISOString()}>
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
                      <h2 className="text-xl font-bold text-color3 mb-2 line-clamp-2 group-hover:text-color9 transition-colors">
                        {blog.title}
                      </h2>
                      <p className="text-gray-600 line-clamp-3">
                        {blog.metaDescription || blog.content?.slice(0, 150)}
                      </p>
                      <div className="mt-4 text-color9 font-medium">
                        Read more →
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blogs" },
        ])}
      />
      <MainFooter />
    </>
  );
}
