"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="empty-state error-page">
      <h1>A small interruption.</h1>
      <p>We couldn’t load this page. Please try again or call 077 717 3041.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
