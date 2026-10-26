import Image from "next/image";
export function Photo({
  id,
  alt,
  priority = false,
  className = "",
  sizes = "(max-width: 700px) 100vw, 60vw",
}: {
  id: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={`/images/${id}.webp`}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
