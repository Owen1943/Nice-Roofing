import { Breadcrumbs, PageIntro } from "@/components/common";
import { ProductIndex } from "@/components/product-index";
import { ContactBand } from "@/components/footer";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Terracotta Tiles & Architectural Materials",
  "Browse roofing tiles, floor tiles, clay wall cladding, ventilation blocks, paving, bricks and other materials from NICE in Kurunegala.",
  "/products",
);
export default function Products() {
  return (
    <>
      <div className="page-shell">
        <Breadcrumbs items={[{ label: "Products", href: "/products" }]} />
        <PageIntro
          eyebrow="THE MATERIAL COLLECTION"
          title="A material for"
          em="every feeling."
          description="Start with a surface. Discover the character of clay, the texture of stone and the details that bring your space together."
        />
        <ProductIndex />
        <p className="provenance-note">
          Imagery is illustrative. Confirm the current range, colours,
          dimensions and availability with the showroom.
        </p>
      </div>
      <ContactBand />
    </>
  );
}
