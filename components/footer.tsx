import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { site, whatsapp } from "@/lib/content/site";
export function ContactBand() {
  return (
    <section className="contact-band">
      <div>
        <span className="eyebrow">
          YOUR NEXT PROJECT STARTS WITH A CONVERSATION
        </span>
        <h2>
          Let’s find your
          <br />
          <em>natural fit.</em>
        </h2>
      </div>
      <div>
        <p>
          A new roof. A room with warmth. A courtyard with character. Tell us
          what you have in mind.
        </p>
        <Link className="button light" href="/contact">
          Start an enquiry <ArrowUpRight size={18} />
        </Link>
        <a
          className="text-link"
          href={whatsapp()}
          target="_blank"
          rel="noopener noreferrer"
        >
          Or talk to us on WhatsApp <ArrowUpRight size={15} />
        </a>
      </div>
    </section>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-identity">
          <span className="footer-wordmark">NICE</span>
          <p>ROOFING & FLOORING</p>
          <small>The Terracotta Shop · Kurunegala</small>
        </div>
        <div>
          <h3>Explore</h3>
          <Link href="/products">Our materials</Link>
          <Link href="/projects">Material inspiration</Link>
          <Link href="/services">Roofing & services</Link>
          <Link href="/about">Our story</Link>
        </div>
        <div>
          <h3>Let’s talk</h3>
          <a href={`tel:${site.tel}`}>{site.phone}</a>
          <a href={whatsapp()} target="_blank" rel="noopener noreferrer">
            WhatsApp <ArrowUpRight size={13} />
          </a>
          <a href={site.facebook} target="_blank" rel="noopener noreferrer">
            Facebook <ArrowUpRight size={13} />
          </a>
          <Link href="/faq">Common questions</Link>
        </div>
        <div className="footer-address">
          <h3>Visit the showroom</h3>
          <p>{site.address}</p>
          <a href={site.maps} target="_blank" rel="noopener noreferrer">
            Find us on Maps <MapPin size={14} />
          </a>
          <small>Call to confirm visiting hours and directions.</small>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {site.legalName}
        </span>
        <span>Natural materials. Considered spaces.</span>
        <Link href="/privacy">Privacy & cookies</Link>
      </div>
    </footer>
  );
}
