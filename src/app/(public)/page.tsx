import { Metadata } from "next";
import { MainNavbar, MainFooter } from "@/components/layout";
import Hero from "@/components/home/Hero";
import Form from "@/components/home/Form";
import UnderlyingMagic from "@/components/home/UnderlyingMagic";
import AboutUs from "@/components/home/AboutUs";
import Opportunity from "@/components/home/Opportunity";
import ValueProposition from "@/components/home/ValueProposition";
import Landscape from "@/components/home/Landscape";
import MeetTheTeam from "@/components/home/MeetTheTeam";
import Awards from "@/components/home/Awards";
import Testimonials from "@/components/home/Testimonials";
import { JsonLd } from "@/components/seo";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Caelum | School Investment Platform",
  description:
    "Transform education investment with AI-powered insights, feasibility analysis, and comprehensive school management tools. Expert guidance for investors and educators.",
  keywords: [
    "school investment",
    "education investment",
    "school management",
    "AI education tools",
    "feasibility analysis",
    "investor platform",
    "teacher resources",
  ],
  openGraph: {
    title: "Caelum | School Investment Platform",
    description:
      "Transform education investment with AI-powered insights, feasibility analysis, and comprehensive school management tools.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={getOrganizationSchema()} />
      <JsonLd data={getWebsiteSchema()} />
      <MainNavbar />
      <main>
        <Hero />
        <Form />
        <div className="max-w-7xl mx-auto">
          <UnderlyingMagic />
          <AboutUs />
          <Opportunity />
          <ValueProposition />
          <Landscape />
          <MeetTheTeam />
          <Awards />
          <Testimonials />
        </div>
      </main>
      <MainFooter />
    </>
  );
}
