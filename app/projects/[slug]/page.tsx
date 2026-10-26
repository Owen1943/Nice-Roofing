import { notFound } from "next/navigation";
import { gallery } from "@/lib/content/site";
import { Breadcrumbs, PageIntro, TextLink } from "@/components/common";
import { Gallery } from "@/components/gallery";
import { ContactBand } from "@/components/footer";
import { metadata as meta } from "@/lib/seo";
export function generateStaticParams() {
  return gallery.map((p) => ({ slug: p.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = gallery.find((p) => p.id === slug);
  return p ? meta(p.title, p.caption, `/projects/${slug}`) : {};
}
export default async function Study({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = gallery.find((p) => p.id === slug);
  if (!p) notFound();
  const related = gallery.filter(
    (g) => g.category === p.category && g.id !== p.id,
  );
  return (
    <>
      <div className="page-shell">
        <Breadcrumbs
          items={[
            { label: "Inspiration", href: "/projects" },
            { label: p.title, href: `/projects/${p.id}` },
          ]}
        />
        <PageIntro
          eyebrow={`${p.category.toUpperCase()} / ILLUSTRATIVE MATERIAL STUDY`}
          title={p.title}
          description={p.caption}
        />
        <Gallery images={[p, ...related]} compact />
        <div className="study-note">
          <h2>From inspiration to your own space.</h2>
          <p>
            Use this image to start a conversation about colour, texture and
            form. It is not a record of a NICE installation or a guarantee of a
            particular product finish.
          </p>
          <TextLink href="/contact">Discuss your materials</TextLink>
        </div>
      </div>
      <ContactBand />
    </>
  );
}
