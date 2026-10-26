export const dynamic = "force-dynamic";
export function GET() {
  return Response.json(
    { status: "ok", service: "nice-roofing-flooring" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
