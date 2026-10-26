import { ArrowUpRight, Phone } from "lucide-react";
import { Breadcrumbs, PageIntro } from "@/components/common";
import { EnquiryForm } from "@/components/enquiry-form";
import { site, whatsapp } from "@/lib/content/site";
import { metadata as meta } from "@/lib/seo";
export const metadata = meta(
  "Contact NICE in Kurunegala | Request a Quote",
  "Call 077 717 3041 or enquire about terracotta, roofing tiles, flooring and materials. Visit NICE on Puttalam–Kurunegala Road.",
  "/contact",
);
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return (
    <div className="page-shell">
      <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
      <PageIntro
        eyebrow="LET’S BEGIN"
        title="Your space."
        em="Our next conversation."
        description="A material in mind, or just an idea? We’d be happy to hear what you’re planning."
      />
      <div className="contact-grid">
        <div className="contact-details">
          <h2>A good place to start.</h2>
          <a href={`tel:${site.tel}`}>
            <span>
              <Phone size={15} style={{ display: "inline", marginRight: 15 }} />
              {site.phone}
            </span>
            <ArrowUpRight size={20} />
          </a>
          <a href={whatsapp()} target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp <ArrowUpRight size={20} />
          </a>
          <a href={site.facebook} target="_blank" rel="noopener noreferrer">
            Find us on Facebook <ArrowUpRight size={20} />
          </a>
          <div className="contact-address">
            <span className="eyebrow">THE TERRACOTTA SHOP</span>
            <h3>Visit us in Kurunegala.</h3>
            <p>{site.address}</p>
            <small>
              Please call before travelling to confirm opening hours and the
              exact showroom location.
            </small>
            <a
              className="text-link"
              href={site.maps}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open location search <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
        <div>
          {!process.env.ENQUIRY_TO_EMAIL && (
            <p className="form-disabled-note">
              Email enquiries are being set up. Call or WhatsApp us for a direct
              enquiry.
            </p>
          )}
          <EnquiryForm
            initialCategory={
              typeof category === "string" ? category.slice(0, 80) : ""
            }
          />
        </div>
      </div>
    </div>
  );
}
