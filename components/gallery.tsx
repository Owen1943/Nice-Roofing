"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { Expand, ArrowUpRight } from "lucide-react";
import { Lens } from "./ui/lens";
import { ImageViewer } from "./ui/image-viewer";
import { Photo } from "./photo";
import type { GalleryImage } from "@/lib/content/site";
import { ScrollReveal } from "./scroll-motion";
export function Gallery({
  images,
  filters = false,
  compact = false,
  detailLinks = true,
}: {
  images: GalleryImage[];
  filters?: boolean;
  compact?: boolean;
  detailLinks?: boolean;
}) {
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<number | null>(null);
  const shown = images.filter((p) => filter === "All" || p.category === filter);
  return (
    <>
      {filters && (
        <div className="filter-bar" aria-label="Filter inspiration">
          <span className="eyebrow">EXPLORE BY SURFACE</span>
          <div className="filter-buttons">
            {["All", ...new Set(images.map((p) => p.category))].map((c) => (
              <button
                key={c}
                aria-pressed={filter === c}
                className={filter === c ? "selected" : ""}
                onClick={() => setFilter(c)}
              >
                {c === "All" ? "All studies" : c}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className={`gallery-grid ${compact ? "compact" : ""}`}>
        {shown.map((p, i) => (
          <article className="gallery-item" key={p.id}>
            <ScrollReveal>
              <button
                className="photo-button"
                aria-label={`Enlarge ${p.title}`}
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setActive(i);
                }}
              >
                <Lens
                  src={p.src}
                  sourceWidth={p.width}
                  sourceHeight={p.height}
                  zoomFactor={p.width >= 900 ? 2 : 1.8}
                >
                  <div className="gallery-photo">
                    <Photo id={p.id} alt={p.alt} />
                  </div>
                </Lens>
                <span className="photo-label">Illustrative study</span>
                <span className="enlarge-label">
                  <Expand size={15} />
                  <span className="touch-label">Tap to enlarge</span>
                  <span className="hover-label">Inspect image</span>
                </span>
              </button>
            </ScrollReveal>
            <div className="gallery-caption">
              <div>
                <span className="eyebrow">
                  {p.category} / MATERIAL INSPIRATION
                </span>
                <h3>
                  {detailLinks ? (
                    <Link href={`/projects/${p.id}`}>{p.title}</Link>
                  ) : (
                    p.title
                  )}
                </h3>
              </div>
              {detailLinks && (
                <Link
                  className="round-link"
                  aria-label={`View ${p.title} study`}
                  href={`/projects/${p.id}`}
                >
                  <ArrowUpRight size={21} />
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
      {active !== null && (
        <ImageViewer
          images={shown}
          index={active}
          onClose={() => setActive(null)}
          onChange={setActive}
          onRestoreFocus={() => lastTrigger.current?.focus()}
        />
      )}
    </>
  );
}
