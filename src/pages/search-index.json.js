// Tool index for the search box on tool and hub pages (home, /tools and 404 embed it inline instead).
import { searchIndex } from "../data/catalog.js";

export function GET() {
  return new Response(JSON.stringify(searchIndex()), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
