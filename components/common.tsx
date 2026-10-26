import { headers } from "next/headers";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { origin } from "@/lib/content/site";
import { jsonLd } from "@/lib/seo";
export async function Breadcrumbs({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  const nonce = (await headers()).get("x-nonce") || undefined;
  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <Link href="/">Home</Link>
        {items.map((i) => (
          <span key={i.href}>
            <span aria-hidden="true">/</span>
            <Link href={i.href}>{i.label}</Link>
          </span>
        ))}
      </nav>
      <script
        suppressHydrationWarning
        nonce={nonce}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [{ label: "Home", href: "/" }, ...items].map(
              (x, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: x.label,
                item: origin + x.href,
              }),
            ),
          }),
        }}
      />
    </>
  );
}
export function PageIntro({
  eyebrow,
  title,
  em,
  description,
}: {
  eyebrow: string;
  title: string;
  em?: string;
  description: string;
}) {
  return (
    <div className="page-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h1>
        {title}
        {em && (
          <>
            <br />
            <em>{em}</em>
          </>
        )}
      </h1>
      <p>{description}</p>
    </div>
  );
}
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq-list">
      {items.map((f, i) => (
        <details key={f.q}>
          <summary>
            <span className="faq-no">{String(i + 1).padStart(2, "0")}</span>
            {f.q}
            <span aria-hidden="true" className="faq-plus">
              +
            </span>
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <ArrowUpRight size={18} />
    </Link>
  );
}
