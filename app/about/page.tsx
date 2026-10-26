import { Breadcrumbs, PageIntro, TextLink } from "@/components/common";
import { Photo } from "@/components/photo";
import { ContactBand } from "@/components/footer";
import { site } from "@/lib/content/site";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "About The Terracotta Shop in Kurunegala",
  "Meet NICE Roofing & Flooring: terracotta, roofing and architectural materials on Puttalam–Kurunegala Road.",
  "/about",
);
export default function About() {
  return (
    <>
      <div className="page-shell">
        <Breadcrumbs items={[{ label: "Our story", href: "/about" }]} />
        <PageIntro
          eyebrow="NICE ROOFING & FLOORING"
          title="A place for"
          em="natural character."
          description="The Terracotta Shop in Kurunegala. Bringing roofing, flooring and architectural materials into one conversation."
        />
        <section className="about-story">
          <div className="about-image">
            <Photo
              id="courtyard"
              alt="Illustrative warm terracotta courtyard with natural light"
            />
            <span className="image-note">Illustrative architecture</span>
          </div>
          <div>
            <span className="eyebrow">
              NICE NATURE. NICE CULTURE. NICE CONSTRUCTION.
            </span>
            <h2>
              Start with the
              <br />
              <em>way it feels.</em>
            </h2>
            <p>
              A roof shapes a home’s silhouette. A floor changes how a room
              feels. A wall gives light something to fall across.
            </p>
            <p>
              At NICE Roofing & Flooring, our advertised collection spans
              terracotta roof, floor and wall tiles, ventilation blocks, paving
              and stones. We welcome enquiries from people choosing materials
              for a home, a renovation or an outdoor space.
            </p>
            <p>
              Visit the showroom to discuss your ideas, see the current range
              and confirm the practical details before you order.
            </p>
            <TextLink href="/products">Discover our materials</TextLink>
          </div>
        </section>
        <div className="fact-panel">
          <h2>Find NICE.</h2>
          <dl>
            <div>
              <dt>Business</dt>
              <dd>{site.legalName}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{site.address}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${site.tel}`}>{site.phone}</a>
              </dd>
            </div>
            <div>
              <dt>Before you visit</dt>
              <dd>
                Call to confirm directions, hours and the materials you would
                like to see.
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <ContactBand />
    </>
  );
}
