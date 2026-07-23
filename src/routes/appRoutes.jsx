import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Home = lazy(() => import("../pages/Home"));
const Tools = lazy(() => import("../pages/Tools"));
const ContactForm = lazy(() => import("../components/ContactForm"));
const AboutUs = lazy(() => import("../pages/AboutUs"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("../pages/TermsOfService"));
const Disclaimer = lazy(() => import("../pages/Disclaimer"));
const CookiePolicy = lazy(() => import("../pages/CookiePolicy"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const BlogRoutes = lazy(() => import("../pages/blog/BlogRoutes"));

const GstCalculator = lazy(() => import("../tools/business-tools/GstCalculator"));
const SalaryCalculator = lazy(() => import("../tools/business-tools/SalaryCalculator"));
const InvoiceTemplateCreator = lazy(
  () => import("../tools/business-tools/InvoiceTemplateCreator")
);
const QuotationGenerator = lazy(() => import("../tools/business-tools/QuotationGenerator"));
const InventoryCalculator = lazy(() => import("../tools/business-tools/InventoryCalculator"));
const PayrollCalculator = lazy(() => import("../tools/business-tools/PayrollCalculator"));
const RentReceiptGenerator = lazy(() => import("../tools/business-tools/RentReceiptGenerator"));
const PanCardNameChecker = lazy(() => import("../tools/business-tools/PanCardNameChecker"));
const IfscCodeFinder = lazy(() => import("../tools/business-tools/IfscCodeFinder"));
const AgeCalculator = lazy(() => import("../tools/calculators/AgeCalculator"));
const BmiCalculator = lazy(() => import("../tools/calculators/BmiCalculator"));
const CalorieCalculator = lazy(() => import("../tools/calculators/CalorieCalculator"));
const EmiCalculator = lazy(() => import("../tools/calculators/EmiCalculator"));
const SipCalculator = lazy(() => import("../tools/calculators/SipCalculator"));
const InflationCalculator = lazy(() => import("../tools/calculators/InflationCalculator"));
const PpfCalculator = lazy(() => import("../tools/calculators/PpfCalculator"));
const LoanEligibilityCalculator = lazy(
  () => import("../tools/calculators/LoanEligibilityCalculator")
);
const MortgageCalculator = lazy(() => import("../tools/calculators/MortgageCalculator"));
const StockProfitCalculator = lazy(() => import("../tools/calculators/StockProfitCalculator"));
const OptionProfitCalculator = lazy(() => import("../tools/calculators/OptionProfitCalculator"));
const GratuityCalculator = lazy(() => import("../tools/calculators/GratuityCalculator"));
const GpaCalculator = lazy(() => import("../tools/calculators/GpaCalculator"));
const DateDiff = lazy(() => import("../tools/developer-tools/DateDiff"));
const IpLookup = lazy(() => import("../tools/developer-tools/IpLookup"));
const JsonFormatter = lazy(() => import("../tools/developer-tools/JsonFormatter"));
const JwtDecoder = lazy(() => import("../tools/developer-tools/JwtDecoder"));
const MetaTagGenerator = lazy(() => import("../tools/developer-tools/MetaTagGenerator"));
const PlagiarismChecker = lazy(() => import("../tools/developer-tools/PlagiarismChecker"));
const PythonFormatter = lazy(() => import("../tools/developer-tools/PythonFormatter"));
const RobotsTxtGenerator = lazy(() => import("../tools/developer-tools/RobotsTxtGenerator"));
const SitemapGenerator = lazy(() => import("../tools/developer-tools/SitemapGenerator"));
const TimestampConverter = lazy(() => import("../tools/developer-tools/TimestampConverter"));
const UseSpeedTest = lazy(() => import("../tools/developer-tools/UseSpeedTest"));
const WebsiteTrafficChecker = lazy(() => import("../tools/developer-tools/WebsiteTrafficChecker"));
const BrokenLinkChecker = lazy(() => import("../tools/developer-tools/BrokenLinkChecker"));
const WebsiteSpeedChecker = lazy(() => import("../tools/developer-tools/WebsiteSpeedChecker"));
const DomainAgeChecker = lazy(() => import("../tools/developer-tools/DomainAgeChecker"));
const SslChecker = lazy(() => import("../tools/developer-tools/SslChecker"));
const BacklinkChecker = lazy(() => import("../tools/developer-tools/BacklinkChecker"));
const GoogleIndexChecker = lazy(() => import("../tools/developer-tools/GoogleIndexChecker"));
const InternalLinkAnalyzer = lazy(() => import("../tools/developer-tools/InternalLinkAnalyzer"));
const WebsiteSeoAudit = lazy(() => import("../tools/developer-tools/WebsiteSeoAudit"));
const CoreWebVitalsChecker = lazy(() => import("../tools/developer-tools/CoreWebVitalsChecker"));
const CanonicalChecker = lazy(() => import("../tools/developer-tools/CanonicalChecker"));
const CssBeautifier = lazy(() => import("../tools/developer-tools/CssBeautifier"));
const HtmlMinifier = lazy(() => import("../tools/developer-tools/HtmlMinifier"));
const TailwindCssGenerator = lazy(() => import("../tools/developer-tools/TailwindCssGenerator"));
const ApiTester = lazy(() => import("../tools/developer-tools/ApiTester"));
const Base64Encoder = lazy(() => import("../tools/image-tools/Base64Encoder"));
const ImageResizer = lazy(() => import("../tools/image-tools/ImageResizer"));
const ImageToBase64 = lazy(() => import("../tools/image-tools/ImageToBase64"));
const AllInOneImageToolkit = lazy(() => import("../tools/image-tools/AllInOneImageToolkit"));
const ImageToText = lazy(() => import("../tools/image-tools/ImageToText"));
const ImageFormatConverter = lazy(() => import("../tools/image-tools/ImageFormatConverter"));

const FaviconGenerator = lazy(() => import("../tools/image-tools/FaviconGenerator"));
const SchemaMarkupGenerator = lazy(() => import("../tools/image-tools/SchemaMarkupGenerator"));
const AiImageGenerator = lazy(() => import("../tools/image-tools/AiImageGenerator"));

const PdfTools = lazy(() => import("../tools/pdf-tools/PdfTools"));
const MergePDF = lazy(() => import("../tools/pdf-tools/MergePDF"));
const YouTubeThumbnailDownloader = lazy(
  () => import("../tools/social-media-tools/YouTubeThumbnailDownloader")
);
const InstagramDownloader = lazy(() => import("../tools/social-media-tools/InstagramDownloader"));
const AIInstagramCaptionGenerator = lazy(
  () => import("../tools/social-media-tools/AIInstagramCaptionGenerator")
);
const YouTubeMoneyCalculator = lazy(
  () => import("../tools/social-media-tools/YouTubeMoneyCalculator")
);
const BlogTitleGenerator = lazy(() => import("../tools/social-media-tools/BlogTitleGenerator"));
const AIBioGenerator = lazy(() => import("../tools/social-media-tools/AIBioGenerator"));
const AiStoryGenerator = lazy(() => import("../tools/social-media-tools/AiStoryGenerator"));
const AiEssayWriter = lazy(() => import("../tools/social-media-tools/AiEssayWriter"));
const YoutubeTagsGenerator = lazy(() => import("../tools/social-media-tools/YoutubeTagsGenerator"));
const AiResumeBuilder = lazy(() => import("../tools/social-media-tools/AiResumeBuilder"));
const DateAddSubtractCalculator = lazy(
  () => import("../tools/calculators/DateAddSubtractCalculator")
);
const WordCounter = lazy(() => import("../tools/text-tools/WordCounter"));
const GrammarChecker = lazy(() => import("../tools/text-tools/GrammarChecker"));
const LoremIpsumGenerator = lazy(() => import("../tools/text-tools/LoremIpsumGenerator"));
const AiContentChecker = lazy(() => import("../tools/trending/AiContentChecker"));
const ColorPicker = lazy(() => import("../tools/trending/ColorPicker"));
const CurrencyConverter = lazy(() => import("../tools/trending/CurrencyConverter"));
const FancyTextGenerator = lazy(() => import("../tools/trending/FancyTextGenerator"));
const PasswordGenerator = lazy(() => import("../tools/trending/PasswordGenerator"));
const QrCodeScanner = lazy(() => import("../tools/trending/QrCodeScanner"));
const QrCodeGenerator = lazy(() => import("../tools/trending/QrCodeGenerator"));
const UnitConverter = lazy(() => import("../tools/trending/UnitConverter"));
const GradientGenerator = lazy(() => import("../tools/trending-tools/GradientGenerator"));
const GlassmorphismGenerator = lazy(() => import("../tools/trending-tools/GlassmorphismGenerator"));
const AiPromptOptimizer = lazy(() => import("../tools/social-media-tools/AiPromptOptimizer"));
const AiResumeScore = lazy(() => import("../tools/social-media-tools/AiResumeScore"));
const ImageToPrompt = lazy(() => import("../tools/image-tools/ImageToPrompt"));
const AiHumanizer = lazy(() => import("../tools/social-media-tools/AiHumanizer"));
const ScreenResolutionDetector = lazy(() => import("../tools/developer-tools/ScreenResolutionDetector"));
const CsvToJson = lazy(() => import("../tools/developer-tools/CsvToJson"));
const PageSpeedAnalyzer = lazy(() => import("../tools/developer-tools/PageSpeedAnalyzer"));
const EmailRewriter = lazy(() => import("../tools/text-tools/EmailRewriter"));
const DuplicateLineRemover = lazy(() => import("../tools/text-tools/DuplicateLineRemover"));
const TrimText = lazy(() => import("../tools/text-tools/TrimText"));
const WrapText = lazy(() => import("../tools/text-tools/WrapText"));
const IndentText = lazy(() => import("../tools/text-tools/IndentText"));
const JustifyText = lazy(() => import("../tools/text-tools/JustifyText"));
const SortLinesAZ = lazy(() => import("../tools/text-tools/SortLinesAZ"));
const ReverseLines = lazy(() => import("../tools/text-tools/ReverseLines"));
const ShuffleLines = lazy(() => import("../tools/text-tools/ShuffleLines"));
const NumberLines = lazy(() => import("../tools/text-tools/NumberLines"));
const CodeExplainer = lazy(() => import("../tools/developer-tools/CodeExplainer"));
const DocumentationGenerator = lazy(() => import("../tools/developer-tools/DocumentationGenerator"));
const BugReportGenerator = lazy(() => import("../tools/developer-tools/BugReportGenerator"));
const FlowchartBuilder = lazy(() => import("../tools/developer-tools/FlowchartBuilder"));
const DatabaseSchemaDesigner = lazy(() => import("../tools/developer-tools/DatabaseSchemaDesigner"));
const YamlValidator = lazy(() => import("../tools/developer-tools/YamlValidator"));
const YamlFormatter = lazy(() => import("../tools/developer-tools/YamlFormatter"));
const YamlToJson = lazy(() => import("../tools/developer-tools/YamlToJson"));
const JsonToYaml = lazy(() => import("../tools/developer-tools/JsonToYaml"));
const YamlDiff = lazy(() => import("../tools/developer-tools/YamlDiff"));
const CsvViewer = lazy(() => import("../tools/developer-tools/CsvViewer"));
const CsvToXml = lazy(() => import("../tools/developer-tools/CsvToXml"));
const CsvToSql = lazy(() => import("../tools/developer-tools/CsvToSql"));
const ExcelToJson = lazy(() => import("../tools/developer-tools/ExcelToJson"));
const JsonToExcel = lazy(() => import("../tools/developer-tools/JsonToExcel"));
const CsvMerge = lazy(() => import("../tools/developer-tools/CsvMerge"));
const CsvSplitter = lazy(() => import("../tools/developer-tools/CsvSplitter"));
const SqlFormatter = lazy(() => import("../tools/developer-tools/SqlFormatter"));
const SqlMinifier = lazy(() => import("../tools/developer-tools/SqlMinifier"));
const SqlValidator = lazy(() => import("../tools/developer-tools/SqlValidator"));
const SqlQueryBuilder = lazy(() => import("../tools/developer-tools/SqlQueryBuilder"));
const SqlToJson = lazy(() => import("../tools/developer-tools/SqlToJson"));
const JsonToSqlInsert = lazy(() => import("../tools/developer-tools/JsonToSqlInsert"));
const SqlDiff = lazy(() => import("../tools/developer-tools/SqlDiff"));
const SqlExplain = lazy(() => import("../tools/developer-tools/SqlExplain"));
const RegexTester = lazy(() => import("../tools/developer-tools/RegexTester"));
const RegexGenerator = lazy(() => import("../tools/developer-tools/RegexGenerator"));
const RegexCheatSheet = lazy(() => import("../tools/developer-tools/RegexCheatSheet"));
const RegexExplainer = lazy(() => import("../tools/developer-tools/RegexExplainer"));
const PingTool = lazy(() => import("../tools/developer-tools/PingTool"));
const AadhaarMaskTool = lazy(() => import("../tools/image-tools/AadhaarMaskTool"));
const AiLogoGenerator = lazy(() => import("../tools/image-tools/AiLogoGenerator"));
const PassportPhotoMaker = lazy(() => import("../tools/image-tools/PassportPhotoMaker"));
const SignatureGenerator = lazy(() => import("../tools/image-tools/SignatureGenerator"));
const StudyPlanner = lazy(() => import("../tools/trending/StudyPlanner"));
const BarcodeGenerator = lazy(() => import("../tools/trending/BarcodeGenerator"));
const GeminiPromptGenerator = lazy(() => import("../tools/social-media-tools/GeminiPromptGenerator"));
const TwitterCardGenerator = lazy(() => import("../tools/social-media-tools/TwitterCardGenerator"));
const InterviewQuestionGenerator = lazy(() => import("../tools/social-media-tools/InterviewQuestionGenerator"));
const WhatsAppUrlGenerator = lazy(() => import("../tools/social-media-tools/WhatsAppUrlGenerator"));

const fallback = (
  <div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>
);

export const appRoutes = [
  {
    path: "/",
    element: (
      <Suspense fallback={fallback}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/tools",
    element: (
      <Suspense fallback={fallback}>
        <Tools />
      </Suspense>
    ),
  },
  {
    path: "/blog/*",
    element: (
      <Suspense fallback={fallback}>
        <BlogRoutes />
      </Suspense>
    ),
  },
  {
    path: "/tools/",
    element: (
      <Suspense fallback={fallback}>
        <Tools />
      </Suspense>
    ),
  },
  {
    path: "/contact",
    element: (
      <Suspense fallback={fallback}>
        <ContactForm />
      </Suspense>
    ),
  },
  { path: "/Contact", element: <Navigate to="/contact" replace /> },
  {
    path: "/about",
    element: (
      <Suspense fallback={fallback}>
        <AboutUs />
      </Suspense>
    ),
  },
  {
    path: "/privacy-policy",
    element: (
      <Suspense fallback={fallback}>
        <PrivacyPolicy />
      </Suspense>
    ),
  },
  { path: "/privacy", element: <Navigate to="/privacy-policy" replace /> },
  {
    path: "/terms",
    element: (
      <Suspense fallback={fallback}>
        <TermsOfService />
      </Suspense>
    ),
  },
  { path: "/terms-and-conditions", element: <Navigate to="/terms" replace /> },
  {
    path: "/disclaimer",
    element: (
      <Suspense fallback={fallback}>
        <Disclaimer />
      </Suspense>
    ),
  },
  {
    path: "/cookie-policy",
    element: (
      <Suspense fallback={fallback}>
        <CookiePolicy />
      </Suspense>
    ),
  },
  { path: "/cookies", element: <Navigate to="/cookie-policy" replace /> },
  {
    path: "/business-tools/gst-calculator",
    element: (
      <Suspense fallback={fallback}>
        <GstCalculator />
      </Suspense>
    ),
  },
  {
    path: "/business-tools/salary-calculator",
    element: (
      <Suspense fallback={fallback}>
        <SalaryCalculator />
      </Suspense>
    ),
  },
  {
    path: "/business-tools/invoice-template-creator",
    element: (
      <Suspense fallback={fallback}>
        <InvoiceTemplateCreator />
      </Suspense>
    ),
  },
  {
    path: "/business-tools/quotation-generator",
    element: (
      <Suspense fallback={fallback}>
        <QuotationGenerator />
      </Suspense>
    ),
  },
  {
    path: "/business-tools/inventory-calculator",
    element: (
      <Suspense fallback={fallback}>
        <InventoryCalculator />
      </Suspense>
    ),
  },
  {
    path: "/business-tools/payroll-calculator",
    element: (
      <Suspense fallback={fallback}>
        <PayrollCalculator />
      </Suspense>
    ),
  },
  {
    path: "/business-tools/rent-receipt-generator",
    element: (
      <Suspense fallback={fallback}>
        <RentReceiptGenerator />
      </Suspense>
    ),
  },
  {
    path: "/business-tools/pan-card-name-checker",
    element: (
      <Suspense fallback={fallback}>
        <PanCardNameChecker />
      </Suspense>
    ),
  },
  {
    path: "/business-tools/ifsc-code-finder",
    element: (
      <Suspense fallback={fallback}>
        <IfscCodeFinder />
      </Suspense>
    ),
  },
  {
    path: "/calculators/age-calculator",
    element: (
      <Suspense fallback={fallback}>
        <AgeCalculator />
      </Suspense>
    ),
  },
  {
    path: "/calculators/bmi-calculator",
    element: (
      <Suspense fallback={fallback}>
        <BmiCalculator />
      </Suspense>
    ),
  },
  {
    path: "/calculators/calorie-calculator",
    element: (
      <Suspense fallback={fallback}>
        <CalorieCalculator />
      </Suspense>
    ),
  },
  {
    path: "/calculators/emi-calculator",
    element: (
      <Suspense fallback={fallback}>
        <EmiCalculator />
      </Suspense>
    ),
  },
  {
    path: "/calculators/emi-calculator-amm",
    element: <Navigate to="/calculators/emi-calculator" replace />,
  },
  {
    path: "/calculators/sip-calculator",
    element: (
      <Suspense fallback={fallback}>
        <SipCalculator />
      </Suspense>
    ),
  },
  {
    path: "/calculators/inflation-calculator",
    element: (
      <Suspense fallback={fallback}>
        <InflationCalculator />
      </Suspense>
    ),
  },
  {
    path: "/calculators/ppf-calculator",
    element: (
      <Suspense fallback={fallback}>
        <PpfCalculator />
      </Suspense>
    ),
  },
  {
    path: "/calculators/loan-eligibility-calculator",
    element: (
      <Suspense fallback={fallback}>
        <LoanEligibilityCalculator />
      </Suspense>
    ),
  },
  {
    path: "/calculators/mortgage-calculator",
    element: (
      <Suspense fallback={fallback}>
        <MortgageCalculator />
      </Suspense>
    ),
  },
  {
    path: "/calculators/stock-profit-calculator",
    element: (
      <Suspense fallback={fallback}>
        <StockProfitCalculator />
      </Suspense>
    ),
  },
  {
    path: "/calculators/option-profit-calculator",
    element: (
      <Suspense fallback={fallback}>
        <OptionProfitCalculator />
      </Suspense>
    ),
  },
  {
    path: "/calculators/gratuity-calculator",
    element: (
      <Suspense fallback={fallback}>
        <GratuityCalculator />
      </Suspense>
    ),
  },
  {
    path: "/calculators/gpa-calculator",
    element: (
      <Suspense fallback={fallback}>
        <GpaCalculator />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/date-difference",
    element: (
      <Suspense fallback={fallback}>
        <DateDiff />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/ip-lookup",
    element: (
      <Suspense fallback={fallback}>
        <IpLookup />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/json-formatter",
    element: (
      <Suspense fallback={fallback}>
        <JsonFormatter />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/jwt-decoder",
    element: (
      <Suspense fallback={fallback}>
        <JwtDecoder />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/meta-tag-generator",
    element: (
      <Suspense fallback={fallback}>
        <MetaTagGenerator />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/plagiarism-checker",
    element: (
      <Suspense fallback={fallback}>
        <PlagiarismChecker />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/python-formatter",
    element: (
      <Suspense fallback={fallback}>
        <PythonFormatter />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/robots-generator",
    element: (
      <Suspense fallback={fallback}>
        <RobotsTxtGenerator />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/sitemap-generator",
    element: (
      <Suspense fallback={fallback}>
        <SitemapGenerator />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/timestamp-converter",
    element: (
      <Suspense fallback={fallback}>
        <TimestampConverter />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/speed-test",
    element: (
      <Suspense fallback={fallback}>
        <UseSpeedTest />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/ip-address-checker",
    element: <Navigate to="/developer-tools/ip-lookup" replace />,
  },
  {
    path: "/developer-tools/ip-address",
    element: <Navigate to="/developer-tools/ip-lookup" replace />,
  },
  {
    path: "/developer-tools/website-traffic-checker",
    element: (
      <Suspense fallback={fallback}>
        <WebsiteTrafficChecker />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/broken-link-checker",
    element: (
      <Suspense fallback={fallback}>
        <BrokenLinkChecker />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/website-speed-checker",
    element: (
      <Suspense fallback={fallback}>
        <WebsiteSpeedChecker />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/domain-age-checker",
    element: (
      <Suspense fallback={fallback}>
        <DomainAgeChecker />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/ssl-checker",
    element: (
      <Suspense fallback={fallback}>
        <SslChecker />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/backlink-checker",
    element: (
      <Suspense fallback={fallback}>
        <BacklinkChecker />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/google-index-checker",
    element: (
      <Suspense fallback={fallback}>
        <GoogleIndexChecker />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/internal-link-analyzer",
    element: (
      <Suspense fallback={fallback}>
        <InternalLinkAnalyzer />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/website-seo-audit",
    element: (
      <Suspense fallback={fallback}>
        <WebsiteSeoAudit />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/core-web-vitals-checker",
    element: (
      <Suspense fallback={fallback}>
        <CoreWebVitalsChecker />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/canonical-checker",
    element: (
      <Suspense fallback={fallback}>
        <CanonicalChecker />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/css-beautifier",
    element: (
      <Suspense fallback={fallback}>
        <CssBeautifier />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/html-minifier",
    element: (
      <Suspense fallback={fallback}>
        <HtmlMinifier />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/tailwind-css-generator",
    element: (
      <Suspense fallback={fallback}>
        <TailwindCssGenerator />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/api-tester",
    element: (
      <Suspense fallback={fallback}>
        <ApiTester />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/base64-encoder",
    element: (
      <Suspense fallback={fallback}>
        <Base64Encoder />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/image-resizer",
    element: (
      <Suspense fallback={fallback}>
        <ImageResizer />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/image-to-base64",
    element: (
      <Suspense fallback={fallback}>
        <ImageToBase64 />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/all-in-one-image-toolkit",
    element: (
      <Suspense fallback={fallback}>
        <AllInOneImageToolkit />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/image-to-text-extractor",
    element: (
      <Suspense fallback={fallback}>
        <ImageToText />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/image-format-converter",
    element: (
      <Suspense fallback={fallback}>
        <ImageFormatConverter />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/favicon-generator",
    element: (
      <Suspense fallback={fallback}>
        <FaviconGenerator />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/schema-markup-generator",
    element: (
      <Suspense fallback={fallback}>
        <SchemaMarkupGenerator />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/ai-image-generator",
    element: (
      <Suspense fallback={fallback}>
        <AiImageGenerator />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/image-to-prompt",
    element: (
      <Suspense fallback={fallback}>
        <ImageToPrompt />
      </Suspense>
    ),
  },
  {
    path: "/pdf-tools/pdf-converter",
    element: (
      <Suspense fallback={fallback}>
        <PdfTools />
      </Suspense>
    ),
  },
  {
    path: "/pdf-tools/pdf-merger",
    element: (
      <Suspense fallback={fallback}>
        <MergePDF />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/youtube-thumbnail-downloader",
    element: (
      <Suspense fallback={fallback}>
        <YouTubeThumbnailDownloader />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/instagram-video-downloader",
    element: (
      <Suspense fallback={fallback}>
        <InstagramDownloader />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/ai-instagram-caption-generator",
    element: (
      <Suspense fallback={fallback}>
        <AIInstagramCaptionGenerator />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/youtube-money-calculator",
    element: (
      <Suspense fallback={fallback}>
        <YouTubeMoneyCalculator />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/blog-title-generator",
    element: (
      <Suspense fallback={fallback}>
        <BlogTitleGenerator />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/ai-bio-generator",
    element: (
      <Suspense fallback={fallback}>
        <AIBioGenerator />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/ai-story-generator",
    element: (
      <Suspense fallback={fallback}>
        <AiStoryGenerator />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/ai-essay-writer",
    element: (
      <Suspense fallback={fallback}>
        <AiEssayWriter />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/youtube-tags-generator",
    element: (
      <Suspense fallback={fallback}>
        <YoutubeTagsGenerator />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/ai-resume-builder",
    element: (
      <Suspense fallback={fallback}>
        <AiResumeBuilder />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/ai-prompt-optimizer",
    element: (
      <Suspense fallback={fallback}>
        <AiPromptOptimizer />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/ai-prompt-improver",
    element: <Navigate to="/social-media-tools/ai-prompt-optimizer" replace />,
  },
  {
    path: "/social-media-tools/ai-resume-score",
    element: (
      <Suspense fallback={fallback}>
        <AiResumeScore />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/ai-humanizer",
    element: (
      <Suspense fallback={fallback}>
        <AiHumanizer />
      </Suspense>
    ),
  },
  {
    path: "/calculators/date-add-subtract-calculator",
    element: (
      <Suspense fallback={fallback}>
        <DateAddSubtractCalculator />
      </Suspense>
    ),
  },
  {
    path: "/text-tools/word-counter",
    element: (
      <Suspense fallback={fallback}>
        <WordCounter />
      </Suspense>
    ),
  },
  {
    path: "/text-tools/grammar-checker",
    element: (
      <Suspense fallback={fallback}>
        <GrammarChecker />
      </Suspense>
    ),
  },
  {
    path: "/text-tools/lorem-ipsum-generator",
    element: (
      <Suspense fallback={fallback}>
        <LoremIpsumGenerator />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/ai-content-detector",
    element: (
      <Suspense fallback={fallback}>
        <AiContentChecker />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/color-picker",
    element: (
      <Suspense fallback={fallback}>
        <ColorPicker />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/currency-converter",
    element: (
      <Suspense fallback={fallback}>
        <CurrencyConverter />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/fancy-text-generator",
    element: (
      <Suspense fallback={fallback}>
        <FancyTextGenerator />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/qr-code-scanner",
    element: (
      <Suspense fallback={fallback}>
        <QrCodeScanner />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/qr-code-generator",
    element: (
      <Suspense fallback={fallback}>
        <QrCodeGenerator />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/unit-converter",
    element: (
      <Suspense fallback={fallback}>
        <UnitConverter />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/password-generator",
    element: (
      <Suspense fallback={fallback}>
        <PasswordGenerator />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/gradient-generator",
    element: (
      <Suspense fallback={fallback}>
        <GradientGenerator />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/glassmorphism-generator",
    element: (
      <Suspense fallback={fallback}>
        <GlassmorphismGenerator />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/whatsapp-url-generator",
    element: (
      <Suspense fallback={fallback}>
        <WhatsAppUrlGenerator />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/interview-question-generator",
    element: (
      <Suspense fallback={fallback}>
        <InterviewQuestionGenerator />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/twitter-card-generator",
    element: (
      <Suspense fallback={fallback}>
        <TwitterCardGenerator />
      </Suspense>
    ),
  },
  {
    path: "/social-media-tools/gemini-prompt-generator",
    element: (
      <Suspense fallback={fallback}>
        <GeminiPromptGenerator />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/barcode-generator",
    element: (
      <Suspense fallback={fallback}>
        <BarcodeGenerator />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/study-planner",
    element: (
      <Suspense fallback={fallback}>
        <StudyPlanner />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/signature-generator",
    element: (
      <Suspense fallback={fallback}>
        <SignatureGenerator />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/passport-photo-maker",
    element: (
      <Suspense fallback={fallback}>
        <PassportPhotoMaker />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/ai-logo-generator",
    element: (
      <Suspense fallback={fallback}>
        <AiLogoGenerator />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/aadhaar-mask-tool",
    element: (
      <Suspense fallback={fallback}>
        <AadhaarMaskTool />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/page-speed-analyzer",
    element: (
      <Suspense fallback={fallback}>
        <PageSpeedAnalyzer />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/csv-to-json",
    element: (
      <Suspense fallback={fallback}>
        <CsvToJson />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/screen-resolution-detector",
    element: (
      <Suspense fallback={fallback}>
        <ScreenResolutionDetector />
      </Suspense>
    ),
  },
  { path: "/text-tools/email-rewriter", element: <Suspense fallback={fallback}><EmailRewriter /></Suspense> },
  { path: "/text-tools/duplicate-line-remover", element: <Suspense fallback={fallback}><DuplicateLineRemover /></Suspense> },
  { path: "/text-tools/trim-text", element: <Suspense fallback={fallback}><TrimText /></Suspense> },
  { path: "/text-tools/wrap-text", element: <Suspense fallback={fallback}><WrapText /></Suspense> },
  { path: "/text-tools/unwrap-text", element: <Navigate to="/text-tools/wrap-text" replace /> },
  { path: "/text-tools/indent-text", element: <Suspense fallback={fallback}><IndentText /></Suspense> },
  { path: "/text-tools/outdent-text", element: <Navigate to="/text-tools/indent-text" replace /> },
  { path: "/text-tools/justify-text", element: <Suspense fallback={fallback}><JustifyText /></Suspense> },
  { path: "/text-tools/sort-lines-az", element: <Suspense fallback={fallback}><SortLinesAZ /></Suspense> },
  { path: "/text-tools/sort-lines-za", element: <Navigate to="/text-tools/sort-lines-az" replace /> },
  { path: "/text-tools/reverse-lines", element: <Suspense fallback={fallback}><ReverseLines /></Suspense> },
  { path: "/text-tools/shuffle-lines", element: <Suspense fallback={fallback}><ShuffleLines /></Suspense> },
  { path: "/text-tools/number-lines", element: <Suspense fallback={fallback}><NumberLines /></Suspense> },
  { path: "/text-tools/remove-line-numbers", element: <Navigate to="/text-tools/number-lines" replace /> },
  { path: "/developer-tools/code-explainer", element: <Suspense fallback={fallback}><CodeExplainer /></Suspense> },
  { path: "/developer-tools/documentation-generator", element: <Suspense fallback={fallback}><DocumentationGenerator /></Suspense> },
  { path: "/developer-tools/bug-report-generator", element: <Suspense fallback={fallback}><BugReportGenerator /></Suspense> },
  { path: "/developer-tools/flowchart-builder", element: <Suspense fallback={fallback}><FlowchartBuilder /></Suspense> },
  { path: "/developer-tools/database-schema-designer", element: <Suspense fallback={fallback}><DatabaseSchemaDesigner /></Suspense> },
  { path: "/developer-tools/yaml-validator", element: <Suspense fallback={fallback}><YamlValidator /></Suspense> },
  { path: "/developer-tools/yaml-formatter", element: <Suspense fallback={fallback}><YamlFormatter /></Suspense> },
  { path: "/developer-tools/yaml-to-json", element: <Suspense fallback={fallback}><YamlToJson /></Suspense> },
  { path: "/developer-tools/json-to-yaml", element: <Suspense fallback={fallback}><JsonToYaml /></Suspense> },
  { path: "/developer-tools/yaml-diff", element: <Suspense fallback={fallback}><YamlDiff /></Suspense> },
  { path: "/developer-tools/csv-viewer", element: <Suspense fallback={fallback}><CsvViewer /></Suspense> },
  { path: "/developer-tools/csv-to-xml", element: <Suspense fallback={fallback}><CsvToXml /></Suspense> },
  { path: "/developer-tools/csv-to-sql", element: <Suspense fallback={fallback}><CsvToSql /></Suspense> },
  { path: "/developer-tools/excel-to-json", element: <Suspense fallback={fallback}><ExcelToJson /></Suspense> },
  { path: "/developer-tools/json-to-excel", element: <Suspense fallback={fallback}><JsonToExcel /></Suspense> },
  { path: "/developer-tools/csv-merge", element: <Suspense fallback={fallback}><CsvMerge /></Suspense> },
  { path: "/developer-tools/csv-splitter", element: <Suspense fallback={fallback}><CsvSplitter /></Suspense> },
  { path: "/developer-tools/sql-formatter", element: <Suspense fallback={fallback}><SqlFormatter /></Suspense> },
  { path: "/developer-tools/sql-beautifier", element: <Navigate to="/developer-tools/sql-formatter" replace /> },
  { path: "/developer-tools/sql-minifier", element: <Suspense fallback={fallback}><SqlMinifier /></Suspense> },
  { path: "/developer-tools/sql-validator", element: <Suspense fallback={fallback}><SqlValidator /></Suspense> },
  { path: "/developer-tools/sql-query-builder", element: <Suspense fallback={fallback}><SqlQueryBuilder /></Suspense> },
  { path: "/developer-tools/sql-to-json", element: <Suspense fallback={fallback}><SqlToJson /></Suspense> },
  { path: "/developer-tools/json-to-sql-insert", element: <Suspense fallback={fallback}><JsonToSqlInsert /></Suspense> },
  { path: "/developer-tools/sql-diff", element: <Suspense fallback={fallback}><SqlDiff /></Suspense> },
  { path: "/developer-tools/sql-explain", element: <Suspense fallback={fallback}><SqlExplain /></Suspense> },
  { path: "/developer-tools/regex-tester", element: <Suspense fallback={fallback}><RegexTester /></Suspense> },
  { path: "/developer-tools/regex-generator", element: <Suspense fallback={fallback}><RegexGenerator /></Suspense> },
  { path: "/developer-tools/regex-cheat-sheet", element: <Suspense fallback={fallback}><RegexCheatSheet /></Suspense> },
  { path: "/developer-tools/regex-explainer", element: <Suspense fallback={fallback}><RegexExplainer /></Suspense> },
  { path: "/developer-tools/ping-tool", element: <Suspense fallback={fallback}><PingTool /></Suspense> },
  {
    path: "*",
    element: (
      <Suspense fallback={fallback}>
        <NotFoundPage />
      </Suspense>
    ),
  },
];