import { Breadcrumbs, PageIntro } from "@/components/common";
import { Gallery } from "@/components/gallery";
import { ContactBand } from "@/components/footer";
import { gallery } from "@/lib/content/site";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Material Inspiration Gallery",
  "Explore illustrative roof, floor and wall studies. Inspect textures with a magnifying lens and full-screen image viewer.",
  "/projects",
);
export default function Projects() {
  return (
    <>
      <div className="page-shell">
        <Breadcrumbs items={[{ label: "Inspiration", href: "/projects" }]} />
        <PageIntro
          eyebrow="THE INSPIRATION GALLERY"
          title="A closer look at"
          em="what’s possible."
          description="Rooflines, warm surfaces and spaces shaped by natural materials. Hover to inspect, or tap to explore every detail."
        />
        <div className="gallery-disclosure">
          <span className="eyebrow">A NOTE ON OUR IMAGES</span>
          <p>
            This collection contains AI-enhanced material studies, not verified
            completed NICE projects. A project portfolio will be added after
            original photographs and publication permissions are confirmed.
          </p>
        </div>
        <Gallery images={gallery} filters />
      </div>
      <ContactBand />
    </>
  );
}
