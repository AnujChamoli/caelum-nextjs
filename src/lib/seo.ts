import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://caelum.com";

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  canonical?: string;
}

/**
 * Generate metadata for a page with SEO best practices
 */
export function generateSeoMetadata(config: SeoConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    ogImage = "/og-image.png",
    noIndex = false,
    canonical,
  } = config;

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      siteName: "Caelum",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: canonical ? { canonical } : undefined,
  };
}

/**
 * JSON-LD structured data for organization
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Caelum",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "AI-powered platform helping investors and educators navigate the school investment landscape.",
    sameAs: [
      // Add social media links here
      // "https://twitter.com/caelum",
      // "https://linkedin.com/company/caelum",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
  };
}

/**
 * JSON-LD structured data for a website
 */
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Caelum",
    url: baseUrl,
    description:
      "Transform education investment with AI-powered insights and comprehensive school management tools.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/blogs?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * JSON-LD structured data for a blog post (Article)
 */
export function getArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  publishedAt: Date;
  updatedAt: Date;
  authorName?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${baseUrl}/blog/${article.slug}`,
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: article.authorName || "Caelum",
    },
    publisher: {
      "@type": "Organization",
      name: "Caelum",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    image: article.image || `${baseUrl}/og-image.png`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${article.slug}`,
    },
  };
}

/**
 * JSON-LD structured data for FAQ page
 */
export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * JSON-LD structured data for breadcrumbs
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}
