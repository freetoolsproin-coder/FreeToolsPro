/**
 * New / split developer catalog tools to scaffold & register.
 * Existing tools are updated separately (category remap).
 */
export const DEV_CATALOG = [
  // JSON
  ["json-validator", "JSON Validator", "Validate JSON and show parse errors.", "json-tools", "JsonValidator", "Braces", "json_validate", ["json", "validate"]],
  ["json-minifier", "JSON Minifier", "Minify JSON by removing whitespace.", "json-tools", "JsonMinifier", "Minimize2", "json_minify", ["json", "minify"]],
  ["json-beautifier", "JSON Beautifier", "Beautify JSON with indentation.", "json-tools", "JsonBeautifier", "Braces", "json_pretty", ["json", "beautify"]],
  ["json-pretty-print", "JSON Pretty Print", "Pretty-print JSON for debugging.", "json-tools", "JsonPrettyPrint", "Braces", "json_pretty", ["json", "pretty"]],
  ["json-compare", "JSON Compare", "Compare two JSON documents.", "json-tools", "JsonCompare", "GitCompare", "json_compare", ["json", "compare"], "special"],
  ["json-diff-viewer", "JSON Diff Viewer", "Side-by-side JSON diff viewer.", "json-tools", "JsonDiffViewer", "GitCompare", "json_compare", ["json", "diff"], "special"],
  ["json-tree-viewer", "JSON Tree Viewer", "Explore JSON as an expandable tree.", "json-tools", "JsonTreeViewer", "Network", "json_tree", ["json", "tree"], "special"],
  ["json-to-xml", "JSON to XML", "Convert JSON objects into XML.", "json-tools", "JsonToXml", "FileCode2", "json_to_xml", ["json", "xml"]],
  ["xml-to-json", "XML to JSON", "Convert XML into JSON.", "json-tools", "XmlToJson", "Braces", "xml_to_json", ["xml", "json"]],
  ["json-to-csv", "JSON to CSV", "Flatten JSON arrays into CSV.", "json-tools", "JsonToCsv", "Table2", "json_to_csv", ["json", "csv"]],
  ["json-to-typescript", "JSON to TypeScript", "Generate TypeScript interfaces from JSON.", "json-tools", "JsonToTypescript", "FileCode2", "json_to_ts", ["json", "typescript"]],
  ["json-to-java", "JSON to Java", "Generate Java class stubs from JSON.", "json-tools", "JsonToJava", "FileCode2", "json_to_java", ["json", "java"]],
  ["json-to-csharp", "JSON to C#", "Generate C# class stubs from JSON.", "json-tools", "JsonToCsharp", "FileCode2", "json_to_csharp", ["json", "csharp"]],
  ["json-to-go-struct", "JSON to Go Struct", "Generate Go structs from JSON.", "json-tools", "JsonToGoStruct", "FileCode2", "json_to_go", ["json", "go"]],
  ["json-to-dart", "JSON to Dart", "Generate Dart models from JSON.", "json-tools", "JsonToDart", "FileCode2", "json_to_dart", ["json", "dart"]],
  ["json-schema-generator", "JSON Schema Generator", "Infer JSON Schema from sample JSON.", "json-tools", "JsonSchemaGenerator", "FileCheck2", "json_schema", ["json schema"]],

  // HTML
  ["html-formatter", "HTML Formatter", "Format HTML with readable indentation.", "html-tools", "HtmlFormatter", "FileCode2", "html_format", ["html", "format"]],
  ["html-beautifier", "HTML Beautifier", "Beautify HTML markup.", "html-tools", "HtmlBeautifier", "FileCode2", "html_format", ["html", "beautify"]],
  ["html-escape", "HTML Escape", "Escape HTML special characters.", "html-tools", "HtmlEscape", "Code2", "html_escape", ["html", "escape"]],
  ["html-unescape", "HTML Unescape", "Unescape HTML entities.", "html-tools", "HtmlUnescape", "Code2", "html_unescape", ["html", "unescape"]],
  ["html-encoder", "HTML Encoder", "Encode text as HTML entities.", "html-tools", "HtmlEncoder", "Code2", "html_escape", ["html", "encode"]],
  ["html-decoder", "HTML Decoder", "Decode HTML entities to text.", "html-tools", "HtmlDecoder", "Code2", "html_unescape", ["html", "decode"]],
  ["html-preview", "HTML Preview", "Preview HTML in a sandboxed view.", "html-tools", "HtmlPreview", "Monitor", "html_preview", ["html", "preview"], "special"],
  ["html-to-markdown", "HTML to Markdown", "Convert HTML to Markdown.", "html-tools", "HtmlToMarkdown", "FileText", "html_to_md", ["html", "markdown"]],
  ["markdown-to-html", "Markdown to HTML", "Convert Markdown to HTML.", "html-tools", "MarkdownToHtml", "FileCode2", "md_to_html", ["markdown", "html"]],
  ["html-table-generator", "HTML Table Generator", "Generate HTML tables.", "html-tools", "HtmlTableGenerator", "Table2", "html_table", ["html", "table"], "special"],
  ["html-email-generator", "HTML Email Generator", "Generate HTML email skeletons.", "html-tools", "HtmlEmailGenerator", "Mail", "html_email", ["html", "email"]],
  ["html-entity-converter", "HTML Entity Converter", "Convert characters to HTML entities.", "html-tools", "HtmlEntityConverter", "Code2", "html_entity", ["html", "entity"]],

  // CSS
  ["css-formatter", "CSS Formatter", "Format CSS with consistent spacing.", "css-tools", "CssFormatter", "Palette", "css_format", ["css", "format"]],
  ["css-minifier", "CSS Minifier", "Minify CSS payloads.", "css-tools", "CssMinifier", "Minimize2", "css_minify", ["css", "minify"]],
  ["css-shadow-generator", "CSS Shadow Generator", "Build box-shadow CSS with controls.", "css-tools", "CssShadowGenerator", "Layers", "css_shadow", ["css", "shadow"], "css"],
  ["css-clip-path-generator", "CSS Clip Path Generator", "Generate clip-path polygons.", "css-tools", "CssClipPathGenerator", "Scissors", "css_clip", ["css", "clip-path"], "css"],
  ["css-flexbox-generator", "CSS Flexbox Generator", "Compose flexbox layouts.", "css-tools", "CssFlexboxGenerator", "PanelsTopLeft", "css_flex", ["css", "flexbox"], "css"],
  ["css-grid-generator", "CSS Grid Generator", "Compose CSS grid templates.", "css-tools", "CssGridGenerator", "PanelsTopLeft", "css_grid", ["css", "grid"], "css"],
  ["css-animation-generator", "CSS Animation Generator", "Generate @keyframes snippets.", "css-tools", "CssAnimationGenerator", "PlayCircle", "css_anim", ["css", "animation"], "css"],
  ["css-border-radius-generator", "CSS Border Radius Generator", "Tune border-radius corners.", "css-tools", "CssBorderRadiusGenerator", "Square", "css_radius", ["css", "radius"], "css"],
  ["css-filter-generator", "CSS Filter Generator", "Compose CSS filter stacks.", "css-tools", "CssFilterGenerator", "Filter", "css_filter", ["css", "filter"], "css"],
  ["css-transform-generator", "CSS Transform Generator", "Build CSS transforms.", "css-tools", "CssTransformGenerator", "RefreshCw", "css_transform", ["css", "transform"], "css"],

  // JS
  ["javascript-formatter", "JavaScript Formatter", "Format JavaScript code.", "javascript-tools", "JavascriptFormatter", "FileCode2", "js_format", ["javascript", "format"]],
  ["javascript-minifier", "JavaScript Minifier", "Minify JavaScript code.", "javascript-tools", "JavascriptMinifier", "Minimize2", "js_minify", ["javascript", "minify"]],
  ["javascript-beautifier", "JavaScript Beautifier", "Beautify JavaScript code.", "javascript-tools", "JavascriptBeautifier", "FileCode2", "js_format", ["javascript", "beautify"]],
  ["javascript-obfuscator", "JavaScript Obfuscator", "Lightly obfuscate JavaScript identifiers.", "javascript-tools", "JavascriptObfuscator", "Lock", "js_obfuscate", ["javascript", "obfuscate"]],
  ["javascript-deobfuscator", "JavaScript Deobfuscator", "Best-effort JS deobfuscation.", "javascript-tools", "JavascriptDeobfuscator", "Unlock", "js_deobfuscate", ["javascript", "deobfuscate"]],
  ["javascript-validator", "JavaScript Validator", "Check basic JavaScript syntax.", "javascript-tools", "JavascriptValidator", "ShieldCheck", "js_validate", ["javascript", "validate"]],
  ["javascript-playground", "JavaScript Playground", "Run JS snippets and capture output.", "javascript-tools", "JavascriptPlayground", "PlayCircle", "js_playground", ["javascript", "playground"], "special"],
  ["javascript-console", "JavaScript Console", "Evaluate expressions in a mini console.", "javascript-tools", "JavascriptConsole", "Terminal", "js_console", ["javascript", "console"], "special"],
  ["es6-converter", "ES6 Converter", "Convert common patterns toward ES6.", "javascript-tools", "Es6Converter", "Sparkles", "es6_convert", ["es6"]],
  ["babel-playground", "Babel Playground", "Explore demo ESNext down-level transforms.", "javascript-tools", "BabelPlayground", "Wand2", "babel_play", ["babel"]],

  // API
  ["graphql-explorer", "GraphQL Explorer", "Draft GraphQL queries with sample responses.", "api-tools", "GraphqlExplorer", "Network", "graphql", ["graphql"]],
  ["curl-generator", "cURL Generator", "Generate cURL commands from request fields.", "api-tools", "CurlGenerator", "Terminal", "curl_gen", ["curl"]],
  ["postman-collection-generator", "Postman Collection Generator", "Generate Postman v2.1 collection JSON.", "api-tools", "PostmanCollectionGenerator", "Package", "postman", ["postman"]],
  ["http-header-viewer", "HTTP Header Viewer", "Parse and view HTTP headers.", "api-tools", "HttpHeaderViewer", "ListOrdered", "http_headers", ["headers"]],
  ["api-mock-generator", "API Mock Generator", "Generate mock JSON from field names.", "api-tools", "ApiMockGenerator", "Bot", "api_mock", ["api", "mock"]],
  ["api-documentation-generator", "API Documentation Generator", "Draft Markdown API docs.", "api-tools", "ApiDocumentationGenerator", "BookOpen", "api_docs", ["api", "docs"]],
  ["webhook-tester", "Webhook Tester", "Craft webhook payloads and sample signatures.", "api-tools", "WebhookTester", "Webhook", "webhook", ["webhook"]],
  ["api-request-builder", "API Request Builder", "Build REST request objects.", "api-tools", "ApiRequestBuilder", "Network", "api_builder", ["api", "rest"]],

  // JWT
  ["jwt-encoder", "JWT Encoder", "Encode header/payload into an unsigned JWT.", "jwt-tools", "JwtEncoder", "KeyRound", "jwt_encode", ["jwt"]],
  ["jwt-inspector", "JWT Inspector", "Inspect JWT header, payload, and signature.", "jwt-tools", "JwtInspector", "SearchCheck", "jwt_inspect", ["jwt"]],
  ["jwt-expiry-checker", "JWT Expiry Checker", "Check JWT exp claim status.", "jwt-tools", "JwtExpiryChecker", "Clock3", "jwt_expiry", ["jwt", "expiry"]],
  ["jwt-generator", "JWT Generator", "Generate sample JWTs for testing.", "jwt-tools", "JwtGenerator", "Sparkles", "jwt_gen", ["jwt"]],

  // Encoding
  ["url-encode", "URL Encode", "Percent-encode URL strings.", "encoding-tools", "UrlEncode", "Link2", "url_encode", ["url"]],
  ["url-decode", "URL Decode", "Decode percent-encoded URLs.", "encoding-tools", "UrlDecode", "Link2", "url_decode", ["url"]],
  ["html-encode", "HTML Encode", "Encode HTML entities.", "encoding-tools", "HtmlEncode", "Code2", "html_escape", ["html"]],
  ["html-decode", "HTML Decode", "Decode HTML entities.", "encoding-tools", "HtmlDecode", "Code2", "html_unescape", ["html"]],
  ["unicode-converter", "Unicode Converter", "Convert text to Unicode code points.", "encoding-tools", "UnicodeConverter", "Type", "unicode", ["unicode"]],
  ["utf8-converter", "UTF-8 Converter", "Show UTF-8 bytes for text.", "encoding-tools", "Utf8Converter", "Binary", "utf8", ["utf-8"]],
  ["ascii-converter", "ASCII Converter", "Convert text to ASCII codes.", "encoding-tools", "AsciiConverter", "Binary", "ascii", ["ascii"]],
  ["binary-converter", "Binary Converter", "Convert text to binary.", "encoding-tools", "BinaryConverter", "Binary", "binary", ["binary"]],
  ["hex-converter", "Hex Converter", "Convert text to hexadecimal.", "encoding-tools", "HexConverter", "Binary", "hex", ["hex"]],
  ["octal-converter", "Octal Converter", "Convert numbers to octal.", "encoding-tools", "OctalConverter", "Binary", "octal", ["octal"]],
  ["base64-encode", "Base64 Encode", "Encode text to Base64.", "encoding-tools", "Base64Encode", "Binary", "b64_encode", ["base64"]],
  ["base64-decode", "Base64 Decode", "Decode Base64 to text.", "encoding-tools", "Base64Decode", "Binary", "b64_decode", ["base64"]],

  // Hash
  ["md5-generator", "MD5 Generator", "Generate MD5 hashes.", "hash-tools", "Md5Generator", "ShieldCheck", "md5", ["md5"]],
  ["sha1-generator", "SHA1 Generator", "Generate SHA-1 hashes.", "hash-tools", "Sha1Generator", "ShieldCheck", "sha1", ["sha1"]],
  ["sha256-generator", "SHA256 Generator", "Generate SHA-256 hashes.", "hash-tools", "Sha256Generator", "ShieldCheck", "sha256", ["sha256"]],
  ["sha512-generator", "SHA512 Generator", "Generate SHA-512 hashes.", "hash-tools", "Sha512Generator", "ShieldCheck", "sha512", ["sha512"]],
  ["hmac-generator", "HMAC Generator", "Generate HMAC-SHA256 signatures.", "hash-tools", "HmacGenerator", "KeyRound", "hmac", ["hmac"]],
  ["bcrypt-generator", "BCrypt Generator", "Hash passwords with bcrypt.", "hash-tools", "BcryptGenerator", "Lock", "bcrypt", ["bcrypt"]],
  ["uuid-generator", "UUID Generator", "Generate UUID v4 values.", "hash-tools", "UuidGenerator", "Sparkles", "uuid_gen", ["uuid"]],
  ["uuid-validator", "UUID Validator", "Validate UUID format.", "hash-tools", "UuidValidator", "BadgeCheck", "uuid_val", ["uuid"]],

  // SQL extras
  ["sql-to-mongo-query", "SQL to Mongo Query", "Translate simple SQL to Mongo find().", "developer-tools", "SqlToMongoQuery", "Database", "sql_mongo", ["sql", "mongo"]],
  ["sql-cheat-sheet", "SQL Cheat Sheet", "Quick SQL reference sheet.", "developer-tools", "SqlCheatSheet", "BookOpen", "sql_sheet", ["sql"]],
  ["sql-beautifier", "SQL Beautifier", "Beautify SQL queries.", "developer-tools", "SqlBeautifierTool", "Database", "sql_beautify", ["sql"]],

  // Image
  ["svg-optimizer", "SVG Optimizer", "Strip comments/metadata from SVG.", "image-tools", "SvgOptimizer", "Minimize2", "svg_opt", ["svg"]],
  ["svg-viewer", "SVG Viewer", "Preview SVG markup.", "image-tools", "SvgViewer", "Image", "svg_view", ["svg"], "special"],
  ["svg-to-png", "SVG to PNG", "Rasterize SVG to PNG.", "image-tools", "SvgToPng", "Image", "svg_png", ["svg", "png"], "special"],
  ["png-to-svg-guide", "PNG to SVG Guide", "Checklist for PNG→SVG conversion.", "image-tools", "PngToSvgGuide", "Image", "png_svg_guide", ["png", "svg"]],
  ["image-compressor", "Image Compressor", "Compress images in the browser.", "image-tools", "ImageCompressorTool", "Minimize2", "image_compress", ["compress"], "special"],
  ["image-cropper", "Image Cropper", "Crop images to an aspect ratio.", "image-tools", "ImageCropper", "Crop", "image_crop", ["crop"], "special"],
  ["image-metadata-viewer", "Image Metadata Viewer", "Inspect image dimensions and file info.", "image-tools", "ImageMetadataViewer", "Info", "image_meta", ["metadata"], "special"],
  ["exif-reader", "EXIF Reader", "Read basic image metadata in-browser.", "image-tools", "ExifReader", "Camera", "exif", ["exif"], "special"],
  ["ico-generator", "ICO Generator", "Generate favicon-sized PNG pack.", "image-tools", "IcoGenerator", "Image", "ico", ["ico"], "special"],

  // Security
  ["password-strength-checker", "Password Strength Checker", "Score password strength.", "security-tools", "PasswordStrengthChecker", "ShieldCheck", "pwd_strength", ["password"]],
  ["csr-generator", "CSR Generator", "Build OpenSSL CSR commands.", "security-tools", "CsrGenerator", "FileKey", "csr", ["csr"]],
  ["certificate-decoder", "Certificate Decoder", "Inspect PEM certificate size/fields.", "security-tools", "CertificateDecoder", "FileCheck2", "cert_decode", ["certificate"]],
  ["cors-tester", "CORS Tester", "Draft CORS response headers.", "security-tools", "CorsTester", "Globe", "cors", ["cors"]],
  ["csp-generator", "CSP Generator", "Generate Content-Security-Policy drafts.", "security-tools", "CspGenerator", "Shield", "csp", ["csp"]],
  ["security-headers-checker", "Security Headers Checker", "Recommended HTTP security headers.", "security-tools", "SecurityHeadersChecker", "ShieldCheck", "sec_headers", ["security headers"]],
  ["dns-lookup", "DNS Lookup", "DNS-over-HTTPS A record lookup.", "security-tools", "DnsLookup", "Globe", "dns", ["dns"]],
  ["whois-lookup", "WHOIS Lookup", "RDAP domain registration lookup.", "security-tools", "WhoisLookup", "Search", "whois", ["whois"]],
  ["spf-checker", "SPF Checker", "Inspect SPF TXT records.", "security-tools", "SpfChecker", "Mail", "spf", ["spf"]],
  ["dkim-checker", "DKIM Checker", "Lookup DKIM selector records.", "security-tools", "DkimChecker", "Mail", "dkim", ["dkim"]],
  ["dmarc-checker", "DMARC Checker", "Inspect DMARC policies.", "security-tools", "DmarcChecker", "Mail", "dmarc", ["dmarc"]],

  // HTTP
  ["http-status-checker", "HTTP Status Checker", "Check HTTP status for a URL.", "http-tools", "HttpStatusChecker", "Activity", "http_status", ["http", "status"]],
  ["redirect-checker", "Redirect Checker", "Guidance for redirect-chain QA.", "http-tools", "RedirectChecker", "GitBranch", "redirect", ["redirect"]],
  ["url-parser", "URL Parser", "Parse URL components.", "http-tools", "UrlParser", "Link2", "url_parse", ["url"]],
  ["url-inspector", "URL Inspector", "Inspect URL structure and query params.", "http-tools", "UrlInspector", "Search", "url_inspect", ["url"]],

  // AI dev
  ["sql-generator", "SQL Generator", "Generate SQL from a plain request.", "ai-dev-tools", "SqlGeneratorAi", "Database", "sql_gen", ["sql", "ai"]],
  ["api-generator", "API Generator", "Generate REST route stubs.", "ai-dev-tools", "ApiGenerator", "Network", "api_gen", ["api"]],
  ["commit-message-generator", "Commit Message Generator", "Draft conventional commit messages.", "ai-dev-tools", "CommitMessageGenerator", "GitBranch", "commit_msg", ["commit"]],
  ["readme-generator", "README Generator", "Generate README skeletons.", "ai-dev-tools", "ReadmeGenerator", "BookOpen", "readme", ["readme"]],
  ["dockerfile-generator", "Dockerfile Generator", "Generate Dockerfiles for common stacks.", "ai-dev-tools", "DockerfileGenerator", "Package", "dockerfile", ["docker"]],
  ["gitignore-generator", ".gitignore Generator", "Generate .gitignore files.", "ai-dev-tools", "GitignoreGenerator", "FileText", "gitignore", ["gitignore"]],
  ["env-template-generator", ".env Template Generator", "Generate .env.example templates.", "ai-dev-tools", "EnvTemplateGenerator", "FileText", "env_template", ["env"]],

  // Text
  ["character-counter", "Character Counter", "Count characters, words, and lines.", "text-tools", "CharacterCounter", "Type", "char_count", ["character"]],
  ["remove-empty-lines", "Remove Empty Lines", "Strip blank lines from text.", "text-tools", "RemoveEmptyLines", "Filter", "remove_empty", ["empty lines"]],
  ["case-converter", "Case Converter", "Convert camel, snake, kebab cases.", "text-tools", "CaseConverter", "Type", "case_convert", ["case"]],
  ["slug-generator", "Slug Generator", "Generate URL-safe slugs.", "text-tools", "SlugGenerator", "Link2", "slug", ["slug"]],
  ["random-string-generator", "Random String Generator", "Generate random strings.", "text-tools", "RandomStringGenerator", "Shuffle", "random_string", ["random"]],

  // SEO
  ["open-graph-generator", "Open Graph Generator", "Generate Open Graph meta tags.", "seo-tools", "OpenGraphGenerator", "Share2", "og_gen", ["open graph"]],
  ["canonical-url-generator", "Canonical URL Generator", "Generate canonical link tags.", "seo-tools", "CanonicalUrlGenerator", "Link2", "canonical_gen", ["canonical"]],
  ["keyword-density-checker", "Keyword Density Checker", "Analyze keyword density.", "seo-tools", "KeywordDensityChecker", "BarChart3", "keyword_density", ["keyword"]],
  ["hreflang-generator", "Hreflang Generator", "Generate hreflang tags.", "seo-tools", "HreflangGenerator", "Globe", "hreflang", ["hreflang"]],
];

export function normalizeCatalogEntry(row) {
  const [id, name, desc, category, component, icon, kind, keywords, ui = "io"] = row;
  return {
    id,
    name,
    desc,
    category,
    component,
    icon,
    kind,
    keywords,
    ui,
    path: `/${category}/${id}`,
    seoKey: id
      .replace(/^\./, "")
      .split("-")
      .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
      .join(""),
    folder: category,
  };
}

export const DEV_CATALOG_NORMALIZED = DEV_CATALOG.map(normalizeCatalogEntry);
