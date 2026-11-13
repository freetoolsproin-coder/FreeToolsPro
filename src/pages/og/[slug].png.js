// Share images for every page, generated at build time: /og/<tool-id>.png, /og/hub-<category>.png,
// /og/home.png and /og/tools.png. Each is 1200 × 630, the size every social app and chat app expects.
import sharp from "sharp";
import { TOOLS, CATEGORIES, categoryById, toolsIn } from "../../data/catalog.js";
import { ogSvg } from "../../lib/og.js";

export function getStaticPaths() {
  return [
    { params: { slug: "home" }, props: { title: `${TOOLS.length} free tools for money, PDFs, images and more`, subtitle: "EMI, SIP and income tax calculators, image compressor, PDF merge, JSON formatter. No sign-up; files never leave your device.", cat: "finance" } },
    { params: { slug: "tools" }, props: { title: `All ${TOOLS.length} free online tools`, subtitle: CATEGORIES.map((c) => c.name).join(" · "), cat: "seo" } },
    ...CATEGORIES.map((c) => ({ params: { slug: `hub-${c.id}` }, props: { title: c.name, subtitle: c.description, label: `${toolsIn(c.id).length} free tools`, cat: c.id } })),
    ...TOOLS.map((t) => ({ params: { slug: t.id }, props: { title: t.name, subtitle: t.description, label: categoryById[t.cat].name, cat: t.cat } })),
  ];
}

export async function GET({ props }) {
  const png = await sharp(Buffer.from(ogSvg(props))).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();
  return new Response(png, { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" } });
}
