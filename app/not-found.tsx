import Link from "next/link";
export default function NotFound() {
  return (
    <div className="empty-state error-page">
      <span className="eyebrow">404 / A DIFFERENT PATH</span>
      <h1>
        This page hasn’t
        <br />
        <em>taken shape.</em>
      </h1>
      <p>The address may have changed. Let’s get you back to the materials.</p>
      <Link href="/products" className="button">
        Explore products
      </Link>
      <Link href="/" className="text-link">
        Return home
      </Link>
    </div>
  );
}
