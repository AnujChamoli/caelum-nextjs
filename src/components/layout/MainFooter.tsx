import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const footerLinks = {
  company: [
    { label: "About Us", href: "#about-us" },
    { label: "Contact", href: "#form-section" },
    { label: "Blog", href: "/blogs" },
  ],
  // resources: [
  //   { label: "Documentation", href: "/docs" },
  //   { label: "Help Center", href: "/help" },
  //   { label: "Privacy Policy", href: "/privacy" },
  //   { label: "Terms of Service", href: "/terms" },
  // ],
  social: [
    { label: "Facebook", href: " https://www.facebook.com/profile.php?id=61584109354670", icon: FaFacebook },
    // { label: "Twitter", href: "#", icon: FaTwitter },
    { label: "Instagram", href:"https://www.instagram.com/thecaelumway/", icon: FaInstagram },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/thadaneym/", icon: FaLinkedin },
  ],
};

export function MainFooter() {
  return (
    <footer className="bg-color3 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Changed order: Company section moved to the right */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 order-1 md:order-1">
            <h3 className="text-2xl font-bold text-color1 mb-4">Caelum</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Transform your school investment journey with AI-powered tools and
              expert guidance. We help investors and educators navigate the
              education sector.
            </p>
            <div className="flex gap-4">
              {footerLinks.social.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-color1 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </Link>
              ))}
            </div>
          </div>

          {/* Empty placeholder (kept same grid balance if needed) */}
          <div className="order-2 md:order-2"></div>

          {/* Company Links (moved to right) */}
          <div className="order-3 md:order-3">
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-color1 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links (still commented) */}
          <div className="order-4 md:order-4">
            {/* <h4 className="font-semibold text-lg mb-4">Resources</h4> */}
            {/* <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-color1 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul> */}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Caelum. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
