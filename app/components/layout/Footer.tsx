import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-20">
        {/* Main Row */}
        <div className="flex items-center justify-between py-8 sm:py-10">
          {/* Logo — ukuran sedang, sedikit redup */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo1.png"
              alt="Suba Daily"
              width={180}
              height={52}
              style={{ width: "auto", height: "80px" }}
              className="object-contain brightness-75 ml-10 hover:brightness-100 transition-all duration-300"
            />
          </Link>

          {/* Social Icons */}
          <div className="flex items-center gap-6 mr-10 sm:gap-7">
            {/* Instagram */}
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white/40 hover:text-white/90 transition-colors duration-200">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="0.6"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </Link>

            {/* Mail */}
            <Link
              href="mailto:hello@subadaily.com"
              aria-label="Email"
              className="text-white/40 hover:text-white/90 transition-colors duration-200">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </Link>

            {/* TikTok */}
            <Link
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-white/40 hover:text-white/90 transition-colors duration-200">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.5]" />

        {/* Copyright */}
        <div className="py-4 sm:py-5">
          <p className="text-white/25 text-[13px] mb-5 tracking-wide">
            © 2026 Suba Daily. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
