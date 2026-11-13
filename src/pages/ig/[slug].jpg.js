// Instagram post images, generated at build time: /ig/<tool-id>.jpg (1080 × 1350).
// scripts/automation/ig-post.mjs posts these, so they must be live on the site before a tool is posted.
import sharp from "sharp";
import { TOOLS, categoryById } from "../../data/catalog.js";
import { igSvg, pointsFor } from "../../lib/ig.js";

export function getStaticPaths() {
  return TOOLS.map((t) => ({ params: { slug: t.id }, props: { title: t.name, subtitle: t.short, label: categoryById[t.cat].name, cat: t.cat, points: pointsFor(t.engine, t.cat) } }));
}

export async function GET({ props }) {
  // Instagram accepts JPEG only for image posts.
  const jpg = await sharp(Buffer.from(igSvg(props))).flatten({ background: "#0d1b3d" }).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
  return new Response(jpg, { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=86400" } });
}
