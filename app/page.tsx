import Link from "next/link";
import { ArrowUpRight, ArrowDown, MapPin } from "lucide-react";
import { Photo } from "@/components/photo";
import { ContactBand } from "@/components/footer";
import { Gallery } from "@/components/gallery";
import { TextLink } from "@/components/common";
import { categories, gallery, site } from "@/lib/content/site";
import { metadata as meta } from "@/lib/seo";
import { HeroVisual } from "@/components/scroll-motion";
export const metadata = meta(
  "Terracotta, Roofing & Flooring in Kurunegala",
  "Roofing tiles, terracotta floors, wall cladding and natural surfaces. Explore NICE Roofing & Flooring, The Terracotta Shop in Kurunegala.",
  "/",
);
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="small-line" /> ROOTED IN EARTH. MADE FOR HOME.
          </span>
          <h1>
            Naturally
            <br />
            <em>at home.</em>
          </h1>
          <p>
            Terracotta, roofing and architectural materials for spaces with
            lasting character.
          </p>
          <div className="hero-actions">
            <Link href="/products" className="button">
              Explore products <ArrowUpRight size={18} />
            </Link>
            <Link href="/contact" className="hero-secondary">
              Get a quote <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="hero-location">
            <MapPin size={15} />
            <span>
              YOUR MATERIAL SHOWROOM
              <br />
              <strong>Kurunegala, Sri Lanka</strong>
            </span>
          </div>
        </div>
        <HeroVisual
          image={
            <Photo
              id="bungalow"
              alt="Illustrative tropical home with a charcoal tiled roof set among palms"
              priority
              sizes="(max-width: 760px) 100vw, 65vw"
            />
          }
        >
          <span className="hero-image-note">
            ARCHITECTURAL INSPIRATION · ILLUSTRATIVE IMAGE
          </span>
          <div className="hero-image-caption">
            <span>
              THE BEAUTY IS
              <br />
              IN THE MATERIAL.
            </span>
            <a href="#materials" aria-label="Scroll to materials">
              <ArrowDown size={20} />
            </a>
          </div>
        </HeroVisual>
        <div className="hero-stamp" aria-hidden="true">
          NICE NATURE
          <br />
          <span>Nice living.</span>
        </div>
      </section>
      <section className="material-strip" aria-label="Material range">
        <span>TERRACOTTA</span>
        <i />
        <span>ROOFING</span>
        <i />
        <span>FLOORING</span>
        <i />
        <span>WALLS & CLADDING</span>
        <i />
        <span>PAVING & STONES</span>
      </section>
      <section id="materials" className="section collection">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / THE MATERIAL COLLECTION</span>
            <h2>
              Good spaces begin
              <br />
              with <em>good materials.</em>
            </h2>
          </div>
          <div>
            <p>
              From the roofline to the garden path, discover the textures, tones
              and details that make a place your own.
            </p>
            <TextLink href="/products">Explore the collection</TextLink>
          </div>
        </div>
        <div className="collection-grid">
          {categories.slice(0, 4).map((c, i) => (
            <Link
              href={`/products/${c.slug}`}
              className={`collection-item collection-${i}`}
              key={c.slug}
            >
              <div className="collection-image">
                <Photo
                  id={c.image!}
                  alt={`Illustrative ${c.title.toLowerCase()} material study`}
                  sizes="(max-width: 700px) 90vw, 40vw"
                />
                <span className="collection-count">0{i + 1}</span>
                <span className="image-note">Illustrative material</span>
                <span className="collection-arrow">
                  <ArrowUpRight />
                </span>
              </div>
              <div className="collection-title">
                <h3>{c.short}</h3>
                <span>{c.application}</span>
              </div>
            </Link>
          ))}
        </div>
        <Link className="collection-more" href="/products/paving-stones">
          <span>Beyond terracotta</span>
          <strong>Paving, bricks, stones & more</strong>
          <ArrowUpRight size={25} />
        </Link>
      </section>
      <section className="material-story">
        <div className="story-visual">
          <Photo
            id="courtyard"
            alt="Illustrative sunlit courtyard with warm brick walls and terracotta floor"
          />
          <span className="image-note">Illustrative material setting</span>
        </div>
        <div className="story-copy">
          <span className="eyebrow">02 / A FEELING, NOT JUST A FINISH</span>
          <h2>
            A little earth.
            <br />A lot of <em>character.</em>
          </h2>
          <p>
            The warm variation of clay. The rhythm of a tiled roof. The way a
            textured wall catches the afternoon light.
          </p>
          <p>
            We bring together terracotta and architectural materials so you can
            build a palette that feels connected — from the first impression to
            the smallest detail.
          </p>
          <TextLink href="/about">Meet The Terracotta Shop</TextLink>
          <div className="material-swatches" aria-label="Our design palette">
            <span style={{ background: "#a54e34" }}>Clay</span>
            <span style={{ background: "#d2c5ae", color: "#272923" }}>
              Stone
            </span>
            <span style={{ background: "#363a35" }}>Charcoal</span>
          </div>
        </div>
      </section>
      <section className="section inspiration-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">03 / A CLOSER LOOK</span>
            <h2>
              See the texture.
              <br />
              <em>Imagine the space.</em>
            </h2>
          </div>
          <div>
            <p>
              Explore our illustrative material studies. Hover to inspect a
              surface, or tap any image to open the full-screen viewer.
            </p>
            <TextLink href="/projects">View the inspiration gallery</TextLink>
          </div>
        </div>
        <Gallery images={gallery.slice(0, 2)} compact />
        <p className="provenance-note">
          These AI-enhanced studies are supplied design imagery, not a verified
          portfolio of completed NICE projects.
        </p>
      </section>
      <section className="services-preview section">
        <div>
          <span className="eyebrow">04 / MORE THAN MATERIALS</span>
          <h2>
            Let’s talk about
            <br />
            <em>the bigger picture.</em>
          </h2>
        </div>
        <div className="service-lines">
          <Link href="/services">
            <span>01</span>
            <div>
              <h3>Roofing construction</h3>
              <p>Discuss your roof and the help you need.</p>
            </div>
            <ArrowUpRight />
          </Link>
          <Link href="/services#landscaping">
            <span>02</span>
            <div>
              <h3>Landscaping enquiries</h3>
              <p>Start a conversation about your outdoor space.</p>
            </div>
            <ArrowUpRight />
          </Link>
          <small>
            Service scope and availability are confirmed for each enquiry.
          </small>
        </div>
      </section>
      <ContactBand />
      <section className="showroom-line">
        <span className="eyebrow">COME FIND YOUR MATERIALS</span>
        <p>Puttalam–Kurunegala Road, Kurunegala</p>
        <a
          className="text-link"
          href={site.maps}
          target="_blank"
          rel="noopener noreferrer"
        >
          Find the showroom <ArrowUpRight size={17} />
        </a>
      </section>
    </>
  );
}
