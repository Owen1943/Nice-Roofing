"use client";
import { useRef, type PointerEvent, type CSSProperties } from "react";
/** Adapted from supplied Lens: pointer-only decorative image avoids duplicate IDs,
 * interactive children and rerenders. object-fit is identical in both layers. */
export function Lens({
  src,
  alt,
  children,
  zoomFactor = 2,
  lensSize = 180,
  sourceWidth,
  sourceHeight,
  className = "",
  imagePosition = "center",
}: {
  src: string;
  alt?: string;
  children: React.ReactNode;
  zoomFactor?: number;
  lensSize?: number;
  sourceWidth?: number;
  sourceHeight?: number;
  className?: string;
  imagePosition?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<number | undefined>(undefined);
  function move(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !root.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = root.current;
      if (!el) return;
      el.style.setProperty("--lx", `${x}px`);
      el.style.setProperty("--ly", `${y}px`);
      const available =
        sourceWidth && sourceHeight
          ? Math.min(sourceWidth / rect.width, sourceHeight / rect.height)
          : zoomFactor;
      el.style.setProperty(
        "--zoom",
        String(Math.max(1, Math.min(zoomFactor, available, 2.2))),
      );
      el.dataset.active = "true";
    });
  }
  function leave() {
    if (frame.current) cancelAnimationFrame(frame.current);
    if (root.current) root.current.dataset.active = "false";
  }
  return (
    <div
      ref={root}
      className={`lens ${className}`}
      onPointerMove={move}
      onPointerLeave={leave}
      onPointerCancel={leave}
      style={
        {
          "--zoom": Math.max(1, Math.min(zoomFactor, 2.2)),
          "--lens": `${lensSize}px`,
        } as CSSProperties
      }
    >
      {children}
      <div className="lens-mask" aria-hidden="true">
        <div
          className="lens-copy"
          style={{
            backgroundImage: `url("${src}")`,
            backgroundPosition: imagePosition,
          }}
        />
      </div>
      <span className="lens-ring" aria-hidden="true" />
      <span className="sr-only">
        {alt ? `Magnified detail available for ${alt}.` : ""}
      </span>
    </div>
  );
}
