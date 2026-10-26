import { Breadcrumbs, PageIntro } from "@/components/common";
import { metadata as meta } from "@/lib/seo";
import { site } from "@/lib/content/site";
export const metadata = meta(
  "Privacy & Cookies",
  "How this NICE website handles enquiries, essential security data and external links.",
  "/privacy",
);
export default function Privacy() {
  return (
    <div className="page-shell narrow">
      <Breadcrumbs items={[{ label: "Privacy", href: "/privacy" }]} />
      <PageIntro
        eyebrow="PRIVACY & COOKIES"
        title="Your enquiry,"
        em="handled with care."
        description="This notice explains the site’s current functionality. The business must confirm its final retention and privacy arrangements before public launch."
      />
      <article className="prose">
        <h2>What the enquiry form uses</h2>
        <p>
          The form asks for your name and telephone or WhatsApp number. Your
          material category and message are optional. These details are used to
          respond to your enquiry. Please do not include payment details,
          identity documents or other sensitive information.
        </p>
        <h2>Email delivery</h2>
        <p>
          When email delivery is configured, enquiries are sent through Resend
          to the recipient approved by the business. Until then, the site
          provides a clear message and call or WhatsApp alternatives. The
          website does not store a separate customer database.
        </p>
        <h2>Essential security information</h2>
        <p>
          The server uses short-lived, hashed network and telephone identifiers
          to limit abuse, plus request identifiers to prevent duplicate
          delivery. Rate-limit records expire after one hour; duplicate-delivery
          records expire after 24 hours. Application logs record status and
          timing, not enquiry text, names or telephone numbers. Hosting and
          delivery providers may keep their own operational records.
        </p>
        <h2>Cookies and external services</h2>
        <p>
          Your dark or light appearance choice is saved in your browser’s local
          storage. It contains no personal information and is not sent to NICE.
        </p>
        <p>
          This site adds no advertising, behavioural analytics or marketing
          cookies. Essential hosting or private-preview access cookies may be
          used by the hosting platform. Map, Facebook and WhatsApp links open
          those services only when you choose them; their privacy terms then
          apply.
        </p>
        <h2>Your choices and retained messages</h2>
        <p>
          You can choose to call instead of using the form. Contact {site.phone}{" "}
          to ask about an enquiry, correction or deletion. The business must
          confirm how long messages are retained in its email inbox and by its
          providers before launch.
        </p>
        <h2>Contact</h2>
        <p>
          {site.legalName}
          <br />
          {site.address}
          <br />
          <a href={`tel:${site.tel}`}>{site.phone}</a>
        </p>
      </article>
    </div>
  );
}
