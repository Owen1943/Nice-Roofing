import { Breadcrumbs, PageIntro, TextLink } from "@/components/common";
import { ContactBand } from "@/components/footer";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Roofing Construction & Landscaping Enquiries",
  "Ask NICE Roofing & Flooring in Kurunegala about roofing construction and landscaping. Confirm service scope and availability for your project.",
  "/services",
);
export default function Services() {
  return (
    <>
      <div className="page-shell">
        <Breadcrumbs items={[{ label: "Services", href: "/services" }]} />
        <PageIntro
          eyebrow="ROOFING & SERVICES"
          title="Materials are"
          em="just the beginning."
          description="Roofing construction and landscaping appear in our business information. Tell us what you’re planning so we can discuss the help currently available."
        />
        <div className="service-detail">
          <span className="service-number">01</span>
          <div>
            <span className="eyebrow">ABOVE IT ALL</span>
            <h2>Roofing construction</h2>
            <p>
              Planning a roof or considering changes to an existing one? Start a
              conversation about your roof, preferred materials and the work
              involved.
            </p>
            <p>
              Ask us to confirm the available services, installation
              responsibilities, project location and any quotation requirements.
              Structural design and installation suitability should be checked
              by a qualified professional.
            </p>
            <TextLink href="/contact?category=Roofing%20construction">
              Ask about your roof
            </TextLink>
          </div>
        </div>
        <div className="service-detail" id="landscaping">
          <span className="service-number">02</span>
          <div>
            <span className="eyebrow">OUTSIDE, CONSIDERED</span>
            <h2>Landscaping enquiries</h2>
            <p>
              Paths, courtyards and outdoor surfaces can tie a property
              together. Discuss your ideas and ask about the scope of
              landscaping help available through NICE.
            </p>
            <p>
              Delivery, site visits, installation, timing and costs are
              confirmed individually. No service coverage or warranty is implied
              by this page.
            </p>
            <TextLink href="/contact?category=Landscaping">
              Discuss your outdoor space
            </TextLink>
          </div>
        </div>
      </div>
      <ContactBand />
    </>
  );
}
