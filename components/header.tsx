"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X, Phone } from "lucide-react";
import { Dialog } from "radix-ui";
import { site, whatsapp } from "@/lib/content/site";
import { ThemeToggle } from "./theme-toggle";
const links = [
  ["Products", "/products"],
  ["Inspiration", "/projects"],
  ["Services", "/services"],
  ["Our story", "/about"],
  ["Contact", "/contact"],
];
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="topline">
        <span>THE TERRACOTTA SHOP</span>
        <span>
          KURUNEGALA, SRI LANKA <i />{" "}
          <a href={`tel:${site.tel}`}>{site.phone}</a>
        </span>
      </div>
      <header className="header">
        <Link
          href="/"
          className="brand"
          aria-label="NICE Roofing and Flooring home"
        >
          <Image
            src="/images/brand-logo.webp"
            alt="NICE original supplied logo"
            width={68}
            height={49}
          />
          <span>
            <strong>NICE</strong>
            <small>ROOFING & FLOORING</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, url]) => (
            <Link
              key={url}
              href={url}
              aria-current={
                path === url || path.startsWith(url + "/") ? "page" : undefined
              }
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Link href="/contact" className="button header-quote">
            Get a quote <ArrowUpRight size={17} />
          </Link>
        </div>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger
            className="mobile-menu icon-button"
            aria-label="Open menu"
          >
            <Menu />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="menu-overlay" />
            <Dialog.Content className="mobile-panel">
              <div className="menu-heading">
                <Dialog.Title>Explore NICE</Dialog.Title>
                <Dialog.Close className="icon-button" aria-label="Close menu">
                  <X />
                </Dialog.Close>
              </div>
              <Dialog.Description className="sr-only">
                Main website navigation
              </Dialog.Description>
              <nav aria-label="Mobile navigation">
                {links.map(([label, url]) => (
                  <Link onClick={() => setOpen(false)} key={url} href={url}>
                    {label}
                    <ArrowUpRight />
                  </Link>
                ))}
                <Link onClick={() => setOpen(false)} href="/faq">
                  Frequently asked questions
                </Link>
              </nav>
              <a className="button" href={`tel:${site.tel}`}>
                <Phone size={17} /> {site.phone}
              </a>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </header>
      <div className="mobile-contact">
        <a href={`tel:${site.tel}`}>
          <Phone size={16} /> Call NICE
        </a>
        <a href={whatsapp()} target="_blank" rel="noopener noreferrer">
          WhatsApp <ArrowUpRight size={16} />
        </a>
      </div>
    </>
  );
}
