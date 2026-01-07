"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";

export function MainNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-color1 p-2 lg:p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <Image
            src="/assets/signup/caelum_logo.png"
            alt="Caelum Logo"
            width={224}
            height={56}
            className="w-56 h-auto hidden md:block"
          />
        </Link>
        <Link href="/">
          <Image
            src="/assets/signup/caelum_logo_white.png"
            alt="Caelum Logo"
            width={64}
            height={64}
            className="w-16 ml-3 h-auto md:hidden"
          />
        </Link>

        <nav className="hidden lg:flex space-x-6 font-bold text-color3 text-lg">
          <Link href="/">HOME</Link>
          <Link href="#">OUR STORY</Link>
          <Link href="#">COURSES</Link>
          <Link href="/login">LOG IN</Link>
          <Link href="/register">SIGN UP</Link>
          <Link href="/blogs">BLOGS</Link>
        </nav>

        <div className="lg:hidden">
          <button onClick={toggleMobileMenu}>
            <IoMenu className="w-12 h-12" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="bg-color2 pt-3 absolute right-0 top-[78px] w-40 lg:hidden text-center text-color3 font-bold z-50">
          <Link
            href="/"
            className="block py-2 border-b-2 border-color3/40"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            HOME
          </Link>
          <Link
            href="#"
            className="block py-2 border-b-2 border-color3/40"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            OUR STORY
          </Link>
          <Link
            href="#"
            className="block py-2 border-b-2 border-color3/40"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            COURSES
          </Link>
          <Link
            href="/login"
            className="block py-2 border-b-2 border-color3/40"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            LOG IN
          </Link>
          <Link
            href="/register"
            className="block py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            SIGN UP
          </Link>
          <Link
            href="/blogs"
            className="block py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            BLOGS
          </Link>
        </nav>
      )}
    </header>
  );
}
