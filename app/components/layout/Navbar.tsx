"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/atmosphere", label: "atmost" },
  { href: "#about", label: "about us" },
  { href: "#menu", label: "menu" },
  { href: "#team", label: "our team" },
  { href: "#contact", label: "contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-2  sm:py-3 lg:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Suba Daily Logo"
            width={60}
            height={60}
            className="w-8 h-8 sm:w-10 sm:h-10 ml-10 lg:w-14 lg:h-14 object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-5 mr-17 lg:gap-10 xl:gap-12">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white text-xs lg:text-sm xl:text-base font-normal tracking-wide hover:opacity-50 transition-opacity duration-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex flex-col mr-10 gap-1 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu">
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden bg-black overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-64 pb-4" : "max-h-0"}`}>
        <ul className="flex flex-col items-center gap-4 pt-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-white text-sm font-normal tracking-wide hover:opacity-50 transition-opacity duration-300"
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
