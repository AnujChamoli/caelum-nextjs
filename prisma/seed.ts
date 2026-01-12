import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log(" Starting database seed...");

  // Create Super Admin
  const adminPassword = await bcrypt.hash("admin123", 10);

  const superAdmin = await prisma.adminUser.upsert({
    where: { email: "admin@caelum.com" },
    update: {},
    create: {
      email: "admin@caelum.com",
      passwordHash: adminPassword,
      name: "Super Admin",
      role: "SuperAdmin",
    },
  });

  console.log("✅ Created super admin:", superAdmin.email);

  // Create sample SEO pages
  const seoPages = [
    {
      slug: "/",
      title: "Caelum - Transform Your School Investment Journey",
      description:
        "Caelum helps investors and educators navigate the school investment landscape with AI-powered tools and expert guidance.",
      keywords: [
        "school investment",
        "education",
        "caelum",
        "investor",
        "teacher",
      ],
      ogTitle: "Caelum - Transform Your School Investment Journey",
      ogDescription: "AI-powered platform for school investors and educators.",
    },
    {
      slug: "/dashboard",
      title: "Dashboard - Caelum",
      description:
        "Access your personalized dashboard with investment tools and analytics.",
      keywords: ["dashboard", "analytics", "investment tools"],
    },
    {
      slug: "/blogs",
      title: "Blogs - Caelum",
      description:
        "Read the latest insights and articles about school investment and education.",
      keywords: ["blogs", "articles", "education insights"],
    },
  ];

  for (const page of seoPages) {
    await prisma.seoPage.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }

  console.log("✅ Created SEO pages");

  // Create sample blog
  const sampleBlog = await prisma.blog.upsert({
    where: { slug: "welcome-to-caelum" },
    update: {},
    create: {
      slug: "welcome-to-caelum",
      title: "Welcome to Caelum",
      subtitle: "Your journey to smart school investment starts here",
      description:
        "Learn how Caelum can help you make informed decisions about school investments.",
      content: `
# Welcome to Caelum

Caelum is your comprehensive platform for navigating the school investment landscape. Whether you're an investor looking to enter the education sector or an educator seeking resources, we're here to help.

## What We Offer

- **Feasibility Checker**: Analyze potential school investments
- **Revenue Calculator**: Project your returns
- **AI Assistant**: Get instant answers to your questions
- **Learning Resources**: Access curated educational content

## Getting Started

1. Create your account
2. Choose your profile type (Investor or Teacher)
3. Explore our tools and resources
4. Connect with our AI assistant for personalized guidance

We're excited to have you on board!
      `,
      image: "/assets/blog/welcome.jpg",
    },
  });

  console.log("✅ Created sample blog:", sampleBlog.title);

  // Create sample FAQs
  const faqs = [
    {
      question: "What is Caelum?",
      answer:
        "Caelum is an AI-powered platform designed to help investors and educators navigate the school investment landscape. We provide tools, resources, and expert guidance to make informed decisions.",
    },
    {
      question: "How does the Feasibility Checker work?",
      answer:
        "Our Feasibility Checker analyzes various parameters like land size, location, and market conditions to determine the potential viability of a school investment.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, we take data security very seriously. All data is encrypted and stored securely. We never share your personal information with third parties without your consent.",
    },
  ];

  for (const faq of faqs) {
    await prisma.blogFaq.create({
      data: {
        ...faq,
        blogId: sampleBlog.id, // Associate FAQ with the sample blog
      },
    });
  }

  console.log("✅ Created FAQs");

  console.log("🎉 Database seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
