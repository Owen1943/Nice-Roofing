import { headers } from "next/headers";
import { Breadcrumbs, PageIntro, FaqList } from "@/components/common";
import { ContactBand } from "@/components/footer";
import { faqs } from "@/lib/content/site";
import { metadata as meta, jsonLd } from "@/lib/seo";
export const metadata = meta(
  "Frequently Asked Questions",
  "Answers about NICE materials, showroom visits, quotations, delivery and service enquiries in Kurunegala.",
  "/faq",
);
export default async function FAQ() {
  const nonce = (await headers()).get("x-nonce") || undefined;
  return (
    <>
      <div className="page-shell narrow">
        <Breadcrumbs items={[{ label: "Questions", href: "/faq" }]} />
        <PageIntro
          eyebrow="A LITTLE CLARITY"
          title="Before you"
          em="begin."
          description="A few useful answers before choosing your materials. For anything specific to your project, we’re a phone call away."
        />
        <FaqList items={faqs} />
        <script
          suppressHydrationWarning
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </div>
      <ContactBand />
    </>
  );
}
