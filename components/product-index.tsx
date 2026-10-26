"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { categories } from "@/lib/content/site";
import { Photo } from "./photo";
export function ProductIndex() {
  const [application, setApplication] = useState("All");
  const [material, setMaterial] = useState("All");
  const list = categories.filter(
    (c) =>
      (application === "All" || c.application === application) &&
      (material === "All" || c.material === material),
  );
  return (
    <>
      <div className="product-filters">
        <div>
          <span className="eyebrow">APPLICATION</span>
          <div className="filter-buttons">
            {["All", "Roof", "Floor", "Wall", "Outdoor", "Other"].map((t) => (
              <button
                key={t}
                aria-pressed={application === t}
                className={application === t ? "selected" : ""}
                onClick={() => setApplication(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <label className="material-select">
          Material
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          >
            <option value="All">All materials</option>
            <option>Clay</option>
            <option>Brick & stone</option>
            <option>Other</option>
          </select>
        </label>
      </div>
      <p className="results-count" aria-live="polite">
        {list.length} collection{list.length === 1 ? "" : "s"}
      </p>
      {!list.length ? (
        <div className="empty-state">
          <h2>A different combination?</h2>
          <p>No collections match these filters.</p>
          <button
            className="button"
            onClick={() => {
              setMaterial("All");
              setApplication("All");
            }}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {list.map((c) => (
            <Link
              href={`/products/${c.slug}`}
              className="product-card"
              key={c.slug}
            >
              <div className="product-photo">
                {c.image ? (
                  <>
                    <Photo
                      id={c.image}
                      alt={`Illustrative ${c.title.toLowerCase()} texture`}
                      sizes="(max-width:700px) 90vw, 45vw"
                    />
                    <span className="image-note">Illustrative material</span>
                  </>
                ) : (
                  <div className="material-placeholder">
                    <Layers3 size={44} strokeWidth={0.7} />
                    <span>
                      Discover the range
                      <br />
                      <em>at the showroom.</em>
                    </span>
                  </div>
                )}
                <span className="collection-arrow">
                  <ArrowUpRight />
                </span>
              </div>
              <div className="product-card-title">
                <div>
                  <span className="eyebrow">
                    {c.material} / {c.application}
                  </span>
                  <h2>{c.title}</h2>
                </div>
              </div>
              <p>{c.intro}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
