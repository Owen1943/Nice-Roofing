"use client";
import { useEffect, useRef, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";
import { Dialog } from "radix-ui";
import Image from "next/image";
import type { GalleryImage } from "@/lib/content/site";
export function ImageViewer({
  images,
  index,
  onClose,
  onChange,
  onRestoreFocus,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onChange: (n: number) => void;
  onRestoreFocus: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const view = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; l: number; t: number } | null>(
    null,
  );
  const photo = images[index];
  useEffect(() => {
    setZoom(1);
    setLoaded(false);
    setFailed(false);
    view.current?.scrollTo(0, 0);
  }, [index]);
  const change = (n: number) => onChange((n + images.length) % images.length);
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="viewer-overlay" />
        <Dialog.Content
          className="viewer"
          aria-describedby="viewer-caption"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            onRestoreFocus();
          }}
          onKeyDown={(e) => {
            if ((e.target as HTMLElement).tagName === "INPUT") return;
            if (e.key === "ArrowRight") change(index + 1);
            if (e.key === "ArrowLeft") change(index - 1);
          }}
        >
          <div className="viewer-bar">
            <div>
              <span className="eyebrow">
                MATERIAL STUDY · {index + 1} / {images.length}
              </span>
              <Dialog.Title>{photo.title}</Dialog.Title>
            </div>
            <Dialog.Close
              className="icon-button"
              aria-label="Close image viewer"
            >
              <X />
            </Dialog.Close>
          </div>
          <div
            className="viewer-stage"
            ref={view}
            onDoubleClick={() => setZoom((z) => (z === 1 ? 2 : 1))}
            onPointerDown={(e) => {
              if (zoom <= 1 || !view.current) return;
              drag.current = {
                x: e.clientX,
                y: e.clientY,
                l: view.current.scrollLeft,
                t: view.current.scrollTop,
              };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current || !view.current) return;
              view.current.scrollLeft =
                drag.current.l - (e.clientX - drag.current.x);
              view.current.scrollTop =
                drag.current.t - (e.clientY - drag.current.y);
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
            style={{
              touchAction: zoom > 1 ? "none" : "auto",
              cursor: zoom > 1 ? "grab" : "zoom-in",
            }}
          >
            {!loaded && !failed && (
              <div className="viewer-loading" role="status">
                Loading image…
              </div>
            )}
            {failed && (
              <p role="alert">
                This image could not load. Close the viewer and try again.
              </p>
            )}
            <div
              className="zoom-canvas"
              style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}
            >
              <Image
                unoptimized
                width={photo.width}
                height={photo.height}
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                onLoad={() => setLoaded(true)}
                onError={() => {
                  setFailed(true);
                  setLoaded(true);
                }}
                draggable={false}
              />
            </div>
          </div>
          <div className="viewer-controls">
            <div className="zoom-buttons">
              <button
                className="icon-button"
                aria-label="Zoom out"
                disabled={zoom <= 1}
                onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
              >
                <Minus />
              </button>
              <output aria-live="polite">{Math.round(zoom * 100)}%</output>
              <button
                className="icon-button"
                aria-label="Zoom in"
                disabled={zoom >= 3}
                onClick={() => setZoom((z) => Math.min(3, z + 0.5))}
              >
                <Plus />
              </button>
              <button
                className="icon-button"
                aria-label="Reset zoom"
                onClick={() => setZoom(1)}
              >
                <RotateCcw />
              </button>
            </div>
            {images.length > 1 && (
              <div className="viewer-nav">
                <button
                  className="icon-button"
                  aria-label="Previous image"
                  onClick={() => change(index - 1)}
                >
                  <ChevronLeft />
                </button>
                <button
                  className="icon-button"
                  aria-label="Next image"
                  onClick={() => change(index + 1)}
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>
          <Dialog.Description id="viewer-caption" className="viewer-caption">
            {photo.caption}{" "}
            <span>
              Use + / − to zoom, then drag to pan. Double-tap also zooms.
            </span>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
