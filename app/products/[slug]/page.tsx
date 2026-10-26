import assets from "@/docs/asset-manifest.json";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { categories, gallery, type GalleryImage } from "@/lib/content/site";
import { Breadcrumbs, FaqList, TextLink } from "@/components/common";
import { Gallery } from "@/components/gallery";
import { ContactBand } from "@/components/footer";
import { metadata as meta } from "@/lib/seo";
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = categories.find((c) => c.slug === slug);
  return c
    ? meta(`${c.title} in Kurunegala`, c.description, `/products/${slug}`)
    : {};
}
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = categories.find((c) => c.slug === slug);
  if (!c) notFound();
  let photos: GalleryImage[] = gallery.filter((p) => p.id === c.image);
  if (c.image && !photos.length)
    photos = [
      {
        id: c.image,
        src: `/images/${c.image}.webp`,
        alt: `Illustrative ${c.title.toLowerCase()}`,
        title: c.title,
        caption:
          "Illustrative material study, not a product specification or completed NICE project. Compare physical samples at the showroom.",
        width: assets.find((asset) => asset.id === c.image)?.width || 480,
        height: assets.find((asset) => asset.id === c.image)?.height || 320,
        category: c.application === "Floor" ? "Floor" : "Wall",
        illustrative: true,
      },
    ];
  return (
    <>
      <div className="page-shell">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: c.short, href: `/products/${c.slug}` },
          ]}
        />
        <section className="product-detail">
          <div>
            <span className="eyebrow">
              {c.material} / {c.application}
            </span>
            <h1>{c.title}</h1>
            <p className="large-intro">{c.intro}</p>
            <p>{c.description}</p>
            <Link
              className="button"
              href={`/contact?category=${encodeURIComponent(c.short)}`}
            >
              Enquire about this range <ArrowUpRight size={18} />
            </Link>
            <small className="detail-note">
              Prices, stock and specifications are confirmed on enquiry.
            </small>
          </div>
          <div>
            {photos.length ? (
              <Gallery images={photos} compact detailLinks={false} />
            ) : (
              <div className="material-placeholder large">
                <Layers3 size={70} strokeWidth={0.6} />
                <span>
                  Choose your materials
                  <br />
                  <em>in person.</em>
                </span>
                <p>Contact us to explore the current range.</p>
              </div>
            )}
          </div>
        </section>
        <section className="range-section">
          <div>
            <span className="eyebrow">WHAT TO ASK ABOUT</span>
            <h2>Explore the range.</h2>
          </div>
          <ul>
            {c.types.map((t) => (
              <li key={t}>
                {t}
                <span>Enquire for availability</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="questions-section">
          <h2>A few useful questions.</h2>
          <FaqList items={c.questions} />
        </section>
        <TextLink href="/products">Back to all materials</TextLink>
      </div>
      <ContactBand />
    </>
  );
}
