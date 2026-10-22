"use client";

import { useState } from "react";
import Link from "next/link";

const quickLinks = [
  { label: "Shop", href: "/shop/collection" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Customize", href: "/customize" },
];

const policies = [
  { label: "Shipping Policy", href: "/shippingpolicy" },
  { label: "Return Policy", href: "/refundpolicy" },
  { label: "Privacy Policy", href: "/privacypolicy" },
  { label: "Terms & Conditions", href: "/termsconditions" },
];

const support = [
  { label: "Get Help", href: "/support" },
  { label: "FAQs", href: "/faqs" },
  { label: "My Orders", href: "/orders" },
];

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:text-brand-gold hover:bg-white/10"
    >
      {children}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block py-1 text-sm text-white/60 transition-colors hover:text-brand-gold"
    >
      {children}
    </Link>
  );
}

function FooterAccordionColumn({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/10 pb-4 sm:border-b-0 sm:pb-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-left sm:cursor-default sm:py-0"
        aria-expanded={open}
      >
        <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
          {title}
        </h3>
        <svg
          className={`h-4 w-4 text-brand-gold transition-transform duration-200 sm:hidden ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`mt-3 space-y-3 sm:block ${open ? "block" : "hidden sm:block"}`}>
        <ul className="space-y-2">{children}</ul>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-brand-dark">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-[0.16em] text-brand-gold-light">
              STYLE BY FIZA
            </Link>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              Online Ready to Wear
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Bringing you chic, curated ready-to-wear fashion. Each piece in our collection
              is thoughtfully selected to celebrate effortless style and modern elegance.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <SocialIcon href="https://www.instagram.com/styleby.fiza" label="Instagram">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Quick Links */}
          <FooterAccordionColumn title="Quick Links">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </FooterAccordionColumn>

          {/* Policies */}
          <FooterAccordionColumn title="Policies">
            {policies.map((link) => (
              <li key={link.label}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </FooterAccordionColumn>

          {/* Support & Contact */}
          <FooterAccordionColumn title="Support">
            {support.map((link) => (
              <li key={link.label}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
            <li className="pt-2">
              <p className="text-sm font-semibold tracking-wider text-brand-gold">
                Contact
              </p>
            </li>
            <li>
              <a
                href="tel:+917032678048"
                className="block text-sm text-white/60 transition-colors hover:text-brand-gold"
              >
                +91 70326 78048
              </a>
            </li>
            <li>
              <a
                href="mailto:styleby.fiza@gmail.com"
                className="block text-sm text-white/60 transition-colors hover:text-brand-gold"
              >
                styleby.fiza@gmail.com
              </a>
            </li>
            <li className="text-sm text-white/60">Hyderabad, India</li>
          </FooterAccordionColumn>
        </div>
      </div>

      {/* Copyright bar with safe area inset */}
      <div className="border-t border-white/10 pb-[max(0rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/40 lg:px-8">
          &copy; {new Date().getFullYear()} Style By Fiza. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
