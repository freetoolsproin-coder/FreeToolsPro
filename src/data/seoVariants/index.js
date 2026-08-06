import { buildImageFormatVariants } from "./imageFormats.js";
import { buildImageCompressVariants } from "./imageCompress.js";
import { buildBase64Variants } from "./base64.js";
import { buildUnitVariants } from "./units.js";
import { buildMathFormulaVariants } from "./mathFormulas.js";

let _cache = null;
let _byPath = null;
let _byParent = null;

function buildAll() {
  return [
    ...buildImageFormatVariants(),
    ...buildImageCompressVariants(),
    ...buildBase64Variants(),
    ...buildUnitVariants(),
    ...buildMathFormulaVariants(),
  ];
}

export function listSeoVariants() {
  if (!_cache) _cache = buildAll();
  return _cache;
}

export function listSeoVariantPaths() {
  return listSeoVariants().map((v) => v.path);
}

export function getSeoVariantByPath(pathname) {
  if (!_byPath) {
    _byPath = new Map();
    for (const v of listSeoVariants()) _byPath.set(v.path, v);
  }
  if (!pathname) return null;
  const normalized =
    pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  return _byPath.get(normalized) || null;
}

export function getSeoVariant(parentPath, slug) {
  if (!_byParent) {
    _byParent = new Map();
    for (const v of listSeoVariants()) {
      const key = `${v.parentPath}::${v.slug}`;
      _byParent.set(key, v);
    }
  }
  return _byParent.get(`${parentPath}::${slug}`) || null;
}

export function relatedVariants(variant, limit = 8) {
  if (!variant) return [];
  return listSeoVariants()
    .filter((v) => v.parentPath === variant.parentPath && v.path !== variant.path)
    .slice(0, limit);
}

/** Parent path prefixes that host `:variant` routes. */
export const SEO_VARIANT_ROUTE_PREFIXES = [
  "/image-tools/image-format-converter",
  "/image-tools/image-compressor",
  "/image-tools/image-to-base64",
  "/encoding-tools/base64-decode",
  "/encoding-tools/base64-encode",
  "/trending-tools/unit-converter",
  "/banking-tools/simple-interest-calculator",
  "/banking-tools/compound-interest-calculator",
  "/calculators/emi-calculator",
  "/calculators/bmi-calculator",
  "/calculators/sip-calculator",
  "/calculators/inflation-calculator",
  "/calculators/loan-eligibility-calculator",
  "/business-tools/gst-calculator",
];
