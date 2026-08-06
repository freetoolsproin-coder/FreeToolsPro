import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

// Eager homepage — avoid Suspense gap on the most common entry URL.
import Home from "../pages/Home";
const Tools = lazy(() => import("../pages/Tools"));
const ContactForm = lazy(() => import("../components/ContactForm"));
const AboutUs = lazy(() => import("../pages/AboutUs"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("../pages/TermsOfService"));
const Disclaimer = lazy(() => import("../pages/Disclaimer"));
const CookiePolicy = lazy(() => import("../pages/CookiePolicy"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const SeoVariantPage = lazy(() => import("../pages/SeoVariantPage"));
const BlogApexEntry = lazy(() => import("../../blog/pages/BlogApexEntry"));

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
const PdfToDocxPage = lazy(() => import("../tools/pdf-tools/PdfToDocxPage"));
const PdfToJpgPage = lazy(() => import("../tools/pdf-tools/PdfToJpgPage"));
const JpgToPdfPage = lazy(() => import("../tools/pdf-tools/JpgToPdfPage"));
const CompressPdfPage = lazy(() => import("../tools/pdf-tools/CompressPdfPage"));
const RotatePdfPage = lazy(() => import("../tools/pdf-tools/RotatePdfPage"));
const ExtractPdfPagesPage = lazy(() => import("../tools/pdf-tools/ExtractPdfPagesPage"));
const ProtectUnlockPdfPage = lazy(() => import("../tools/pdf-tools/ProtectUnlockPdfPage"));
const PdfEditorPage = lazy(() => import("../tools/pdf-tools/PdfEditorPage"));
const PdfToHindi = lazy(() => import("../tools/pdf-tools/PdfToHindi"));
const PdfToTelugu = lazy(() => import("../tools/pdf-tools/PdfToTelugu"));
const PdfToEnglish = lazy(() => import("../tools/pdf-tools/PdfToEnglish"));
const PdfSplitter = lazy(() => import("../tools/pdf-tools/PdfSplitter"));
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
const EpfChecker = lazy(() => import("../tools/business-tools/EpfChecker"));



const PinCodePostOfficeFinder = lazy(() => import("../tools/trending/PinCodePostOfficeFinder"));
const TollCalculatorIndia = lazy(() => import("../tools/calculators/TollCalculatorIndia"));
const GovernmentSchemeFinder = lazy(() => import("../tools/trending/GovernmentSchemeFinder"));
const JobNotificationTracker = lazy(() => import("../tools/trending/JobNotificationTracker"));
const ScholarshipFinder = lazy(() => import("../tools/trending/ScholarshipFinder"));
const ElectricityBillCalculator = lazy(() => import("../tools/calculators/ElectricityBillCalculator"));
const WeatherTool = lazy(() => import("../tools/trending/WeatherTool"));
const AqiChecker = lazy(() => import("../tools/trending/AqiChecker"));
const GovernmentHolidays = lazy(() => import("../tools/trending/GovernmentHolidays"));
const FestivalCalendar = lazy(() => import("../tools/trending/FestivalCalendar"));
const LlmReadinessChecker = lazy(() => import("../tools/developer-tools/LlmReadinessChecker"));
const AiTitleGenerator = lazy(() => import("../tools/ai-writing-tools/AiTitleGenerator"));
const BlogOutlineGenerator = lazy(() => import("../tools/ai-writing-tools/BlogOutlineGenerator"));
const MetaDescriptionGenerator = lazy(() => import("../tools/ai-writing-tools/MetaDescriptionGenerator"));
const FaqGenerator = lazy(() => import("../tools/ai-writing-tools/FaqGenerator"));
const ProductDescriptionGenerator = lazy(() => import("../tools/ai-writing-tools/ProductDescriptionGenerator"));
const EmailGenerator = lazy(() => import("../tools/ai-writing-tools/EmailGenerator"));
const CoverLetterGenerator = lazy(() => import("../tools/ai-writing-tools/CoverLetterGenerator"));
const LinkedinPostGenerator = lazy(() => import("../tools/ai-writing-tools/LinkedinPostGenerator"));
const TweetGenerator = lazy(() => import("../tools/ai-writing-tools/TweetGenerator"));
const RewriteTool = lazy(() => import("../tools/ai-writing-tools/RewriteTool"));
const ToneChanger = lazy(() => import("../tools/ai-writing-tools/ToneChanger"));
const TextSimplifier = lazy(() => import("../tools/ai-writing-tools/TextSimplifier"));
const AiProofreader = lazy(() => import("../tools/ai-writing-tools/AiProofreader"));
const CodeReviewer = lazy(() => import("../tools/ai-coding-tools/CodeReviewer"));
const BugFinder = lazy(() => import("../tools/ai-coding-tools/BugFinder"));
const JsonGenerator = lazy(() => import("../tools/ai-coding-tools/JsonGenerator"));
const UnitTestGenerator = lazy(() => import("../tools/ai-coding-tools/UnitTestGenerator"));
const CssGeneratorAi = lazy(() => import("../tools/ai-coding-tools/CssGeneratorAi"));
const ReactComponentGenerator = lazy(() => import("../tools/ai-coding-tools/ReactComponentGenerator"));
const ReadmeGeneratorAi = lazy(() => import("../tools/ai-coding-tools/ReadmeGeneratorAi"));
const SeoAuditAi = lazy(() => import("../tools/ai-seo-tools/SeoAuditAi"));
const AiKeywordGenerator = lazy(() => import("../tools/ai-seo-tools/AiKeywordGenerator"));
const KeywordClustering = lazy(() => import("../tools/ai-seo-tools/KeywordClustering"));
const InternalLinkingSuggestions = lazy(() => import("../tools/ai-seo-tools/InternalLinkingSuggestions"));
const AiContentOptimizer = lazy(() => import("../tools/ai-seo-tools/AiContentOptimizer"));
const ReadabilityChecker = lazy(() => import("../tools/ai-seo-tools/ReadabilityChecker"));
const HeadingOptimizer = lazy(() => import("../tools/ai-seo-tools/HeadingOptimizer"));
const FaqGeneratorSeo = lazy(() => import("../tools/ai-seo-tools/FaqGeneratorSeo"));
const AdCopyGenerator = lazy(() => import("../tools/ai-marketing-tools/AdCopyGenerator"));
const GoogleAdsHeadlineGenerator = lazy(() => import("../tools/ai-marketing-tools/GoogleAdsHeadlineGenerator"));
const FacebookAdGenerator = lazy(() => import("../tools/ai-marketing-tools/FacebookAdGenerator"));
const YoutubeTitleGenerator = lazy(() => import("../tools/ai-marketing-tools/YoutubeTitleGenerator"));
const ThumbnailTextGenerator = lazy(() => import("../tools/ai-marketing-tools/ThumbnailTextGenerator"));
const LandingPageCopyGenerator = lazy(() => import("../tools/ai-marketing-tools/LandingPageCopyGenerator"));
const CallToActionGenerator = lazy(() => import("../tools/ai-marketing-tools/CallToActionGenerator"));
const BrandSloganGenerator = lazy(() => import("../tools/ai-marketing-tools/BrandSloganGenerator"));
const BrandNameGenerator = lazy(() => import("../tools/ai-marketing-tools/BrandNameGenerator"));
const MeetingNotesSummarizer = lazy(() => import("../tools/ai-office-tools/MeetingNotesSummarizer"));
const MinutesOfMeetingGenerator = lazy(() => import("../tools/ai-office-tools/MinutesOfMeetingGenerator"));
const TaskListExtractor = lazy(() => import("../tools/ai-office-tools/TaskListExtractor"));
const ProfessionalEmailWriter = lazy(() => import("../tools/ai-office-tools/ProfessionalEmailWriter"));
const BusinessProposalGenerator = lazy(() => import("../tools/ai-office-tools/BusinessProposalGenerator"));
const InvoiceDescriptionWriter = lazy(() => import("../tools/ai-office-tools/InvoiceDescriptionWriter"));
const ExecutiveSummaryGenerator = lazy(() => import("../tools/ai-office-tools/ExecutiveSummaryGenerator"));
const AtsResumeChecker = lazy(() => import("../tools/ai-resume-career/AtsResumeChecker"));
const ResumeOptimizer = lazy(() => import("../tools/ai-resume-career/ResumeOptimizer"));
const JobDescriptionAnalyzer = lazy(() => import("../tools/ai-resume-career/JobDescriptionAnalyzer"));
const SalaryNegotiationAssistant = lazy(() => import("../tools/ai-resume-career/SalaryNegotiationAssistant"));
const SkillGapAnalyzer = lazy(() => import("../tools/ai-resume-career/SkillGapAnalyzer"));
const FlashcardGenerator = lazy(() => import("../tools/ai-learning-tools/FlashcardGenerator"));
const QuizGenerator = lazy(() => import("../tools/ai-learning-tools/QuizGenerator"));
const StudyNotesGenerator = lazy(() => import("../tools/ai-learning-tools/StudyNotesGenerator"));
const ExplainLikeIm10 = lazy(() => import("../tools/ai-learning-tools/ExplainLikeIm10"));
const CodeTutor = lazy(() => import("../tools/ai-learning-tools/CodeTutor"));
const FormulaExplainer = lazy(() => import("../tools/ai-learning-tools/FormulaExplainer"));
const EssayImprover = lazy(() => import("../tools/ai-learning-tools/EssayImprover"));
const AltTextGenerator = lazy(() => import("../tools/ai-image-helpers/AltTextGenerator"));
const ImageCaptionGenerator = lazy(() => import("../tools/ai-image-helpers/ImageCaptionGenerator"));
const OcrTextCleaner = lazy(() => import("../tools/ai-image-helpers/OcrTextCleaner"));
const ColorPaletteExtractor = lazy(() => import("../tools/ai-image-helpers/ColorPaletteExtractor"));
const PromptGeneratorImageModels = lazy(() => import("../tools/ai-image-helpers/PromptGeneratorImageModels"));
const BackgroundDescriptionGenerator = lazy(() => import("../tools/ai-image-helpers/BackgroundDescriptionGenerator"));
const PromptEnhancer = lazy(() => import("../tools/ai-prompt-engineering/PromptEnhancer"));
const PromptShortener = lazy(() => import("../tools/ai-prompt-engineering/PromptShortener"));
const PromptDebugger = lazy(() => import("../tools/ai-prompt-engineering/PromptDebugger"));
const PromptTranslator = lazy(() => import("../tools/ai-prompt-engineering/PromptTranslator"));
const PromptLibrary = lazy(() => import("../tools/ai-prompt-engineering/PromptLibrary"));
const PromptVersionComparison = lazy(() => import("../tools/ai-prompt-engineering/PromptVersionComparison"));
const PromptQualityScore = lazy(() => import("../tools/ai-prompt-engineering/PromptQualityScore"));
const RolePromptGenerator = lazy(() => import("../tools/ai-prompt-engineering/RolePromptGenerator"));
const CsvCleaner = lazy(() => import("../tools/ai-data-tools/CsvCleaner"));
const JsonCleaner = lazy(() => import("../tools/ai-data-tools/JsonCleaner"));
const DuplicateFinder = lazy(() => import("../tools/ai-data-tools/DuplicateFinder"));
const DataSummarizer = lazy(() => import("../tools/ai-data-tools/DataSummarizer"));
const SqlToCsvAi = lazy(() => import("../tools/ai-data-tools/SqlToCsvAi"));
const CsvVisualizer = lazy(() => import("../tools/ai-data-tools/CsvVisualizer"));
const WorkflowGenerator = lazy(() => import("../tools/ai-automation-tools/WorkflowGenerator"));
const SopGenerator = lazy(() => import("../tools/ai-automation-tools/SopGenerator"));
const ChecklistGenerator = lazy(() => import("../tools/ai-automation-tools/ChecklistGenerator"));
const EmailAutomationDrafts = lazy(() => import("../tools/ai-automation-tools/EmailAutomationDrafts"));
const ZapierWorkflowIdeas = lazy(() => import("../tools/ai-automation-tools/ZapierWorkflowIdeas"));
const N8nWorkflowGenerator = lazy(() => import("../tools/ai-automation-tools/N8nWorkflowGenerator"));
const ApiIntegrationAssistant = lazy(() => import("../tools/ai-automation-tools/ApiIntegrationAssistant"));
const AiWebsiteAuditor = lazy(() => import("../tools/ai-website-auditor/AiWebsiteAuditor"));
const PensionCalculator = lazy(() => import("../tools/retirement-tools/PensionCalculator"));
const NpsCalculator = lazy(() => import("../tools/retirement-tools/NpsCalculator"));
const EpfPensionEstimator = lazy(() => import("../tools/retirement-tools/EpfPensionEstimator"));
const RetirementPlanner = lazy(() => import("../tools/retirement-tools/RetirementPlanner"));
const SafeWithdrawalRateCalculator = lazy(() => import("../tools/retirement-tools/SafeWithdrawalRateCalculator"));
const FdCalculator = lazy(() => import("../tools/banking-tools/FdCalculator"));
const RdCalculator = lazy(() => import("../tools/banking-tools/RdCalculator"));
const CompoundInterestCalculator = lazy(() => import("../tools/banking-tools/CompoundInterestCalculator"));
const SimpleInterestCalculator = lazy(() => import("../tools/banking-tools/SimpleInterestCalculator"));
const SavingsInterestCalculator = lazy(() => import("../tools/banking-tools/SavingsInterestCalculator"));
const CreditCardEmiCalculator = lazy(() => import("../tools/banking-tools/CreditCardEmiCalculator"));
const CreditCardPayoffCalculator = lazy(() => import("../tools/banking-tools/CreditCardPayoffCalculator"));
const CreditUtilizationCalculator = lazy(() => import("../tools/banking-tools/CreditUtilizationCalculator"));
const TermInsuranceCalculator = lazy(() => import("../tools/insurance-tools/TermInsuranceCalculator"));
const LifeInsuranceCalculator = lazy(() => import("../tools/insurance-tools/LifeInsuranceCalculator"));
const HealthInsurancePremiumEstimator = lazy(() => import("../tools/insurance-tools/HealthInsurancePremiumEstimator"));
const VehicleInsuranceEstimator = lazy(() => import("../tools/insurance-tools/VehicleInsuranceEstimator"));
const InvoiceGenerator = lazy(() => import("../tools/business-finance/InvoiceGenerator"));
const GstInvoiceGenerator = lazy(() => import("../tools/business-finance/GstInvoiceGenerator"));
const ProfitMarginCalculator = lazy(() => import("../tools/business-finance/ProfitMarginCalculator"));
const BreakEvenCalculator = lazy(() => import("../tools/business-finance/BreakEvenCalculator"));
const DepreciationCalculator = lazy(() => import("../tools/business-finance/DepreciationCalculator"));
const RoiCalculator = lazy(() => import("../tools/business-finance/RoiCalculator"));
const BusinessValuationCalculator = lazy(() => import("../tools/business-finance/BusinessValuationCalculator"));





const LumpsumCalculator = lazy(() => import("../tools/mutual-fund-tools/LumpsumCalculator"));
const SwpCalculator = lazy(() => import("../tools/mutual-fund-tools/SwpCalculator"));
const StpCalculator = lazy(() => import("../tools/mutual-fund-tools/StpCalculator"));
const GoalPlanner = lazy(() => import("../tools/mutual-fund-tools/GoalPlanner"));
const RetirementCorpusCalculator = lazy(() => import("../tools/mutual-fund-tools/RetirementCorpusCalculator"));
const ChildEducationPlanner = lazy(() => import("../tools/mutual-fund-tools/ChildEducationPlanner"));
const FireCalculator = lazy(() => import("../tools/mutual-fund-tools/FireCalculator"));
const HomeLoanCalculator = lazy(() => import("../tools/loan-calculators/HomeLoanCalculator"));
const CarLoanCalculator = lazy(() => import("../tools/loan-calculators/CarLoanCalculator"));
const PersonalLoanCalculator = lazy(() => import("../tools/loan-calculators/PersonalLoanCalculator"));
const EducationLoanCalculator = lazy(() => import("../tools/loan-calculators/EducationLoanCalculator"));
const GoldLoanCalculator = lazy(() => import("../tools/loan-calculators/GoldLoanCalculator"));
const BusinessLoanCalculator = lazy(() => import("../tools/loan-calculators/BusinessLoanCalculator"));
const LoanPrepaymentCalculator = lazy(() => import("../tools/loan-calculators/LoanPrepaymentCalculator"));
const BalanceTransferCalculator = lazy(() => import("../tools/loan-calculators/BalanceTransferCalculator"));
const IncomeTaxCalculator = lazy(() => import("../tools/tax-tools/IncomeTaxCalculator"));
const OldVsNewTaxRegime = lazy(() => import("../tools/tax-tools/OldVsNewTaxRegime"));
const HraCalculator = lazy(() => import("../tools/tax-tools/HraCalculator"));
const StandardDeductionCalculator = lazy(() => import("../tools/tax-tools/StandardDeductionCalculator"));
const Section80cCalculator = lazy(() => import("../tools/tax-tools/Section80cCalculator"));
const CapitalGainsTaxCalculator = lazy(() => import("../tools/tax-tools/CapitalGainsTaxCalculator"));
const GstInclusiveExclusiveCalculator = lazy(() => import("../tools/tax-tools/GstInclusiveExclusiveCalculator"));
const TdsCalculator = lazy(() => import("../tools/tax-tools/TdsCalculator"));
const AdvanceTaxCalculator = lazy(() => import("../tools/tax-tools/AdvanceTaxCalculator"));
const InHandSalaryCalculator = lazy(() => import("../tools/salary-hr/InHandSalaryCalculator"));
const CtcCalculator = lazy(() => import("../tools/salary-hr/CtcCalculator"));
const SalaryBreakupCalculator = lazy(() => import("../tools/salary-hr/SalaryBreakupCalculator"));
const PfCalculator = lazy(() => import("../tools/salary-hr/PfCalculator"));
const EpfInterestCalculator = lazy(() => import("../tools/salary-hr/EpfInterestCalculator"));
const LeaveEncashmentCalculator = lazy(() => import("../tools/salary-hr/LeaveEncashmentCalculator"));
const BonusCalculator = lazy(() => import("../tools/salary-hr/BonusCalculator"));
const NoticePeriodCalculator = lazy(() => import("../tools/salary-hr/NoticePeriodCalculator"));
const JsonValidator = lazy(() => import("../tools/json-tools/JsonValidator"));
const JsonMinifier = lazy(() => import("../tools/json-tools/JsonMinifier"));
const JsonBeautifier = lazy(() => import("../tools/json-tools/JsonBeautifier"));
const JsonPrettyPrint = lazy(() => import("../tools/json-tools/JsonPrettyPrint"));
const JsonCompare = lazy(() => import("../tools/json-tools/JsonCompare"));
const JsonDiffViewer = lazy(() => import("../tools/json-tools/JsonDiffViewer"));
const JsonTreeViewer = lazy(() => import("../tools/json-tools/JsonTreeViewer"));
const JsonToXml = lazy(() => import("../tools/json-tools/JsonToXml"));
const XmlToJson = lazy(() => import("../tools/json-tools/XmlToJson"));
const JsonToCsv = lazy(() => import("../tools/json-tools/JsonToCsv"));
const JsonToTypescript = lazy(() => import("../tools/json-tools/JsonToTypescript"));
const JsonToJava = lazy(() => import("../tools/json-tools/JsonToJava"));
const JsonToCsharp = lazy(() => import("../tools/json-tools/JsonToCsharp"));
const JsonToGoStruct = lazy(() => import("../tools/json-tools/JsonToGoStruct"));
const JsonToDart = lazy(() => import("../tools/json-tools/JsonToDart"));
const JsonSchemaGenerator = lazy(() => import("../tools/json-tools/JsonSchemaGenerator"));
const HtmlFormatter = lazy(() => import("../tools/html-tools/HtmlFormatter"));
const HtmlBeautifier = lazy(() => import("../tools/html-tools/HtmlBeautifier"));
const HtmlEscape = lazy(() => import("../tools/html-tools/HtmlEscape"));
const HtmlUnescape = lazy(() => import("../tools/html-tools/HtmlUnescape"));
const HtmlEncoder = lazy(() => import("../tools/html-tools/HtmlEncoder"));
const HtmlDecoder = lazy(() => import("../tools/html-tools/HtmlDecoder"));
const HtmlPreview = lazy(() => import("../tools/html-tools/HtmlPreview"));
const HtmlToMarkdown = lazy(() => import("../tools/html-tools/HtmlToMarkdown"));
const MarkdownToHtml = lazy(() => import("../tools/html-tools/MarkdownToHtml"));
const HtmlTableGenerator = lazy(() => import("../tools/html-tools/HtmlTableGenerator"));
const HtmlEmailGenerator = lazy(() => import("../tools/html-tools/HtmlEmailGenerator"));
const HtmlEntityConverter = lazy(() => import("../tools/html-tools/HtmlEntityConverter"));
const CssFormatter = lazy(() => import("../tools/css-tools/CssFormatter"));
const CssMinifier = lazy(() => import("../tools/css-tools/CssMinifier"));
const CssShadowGenerator = lazy(() => import("../tools/css-tools/CssShadowGenerator"));
const CssClipPathGenerator = lazy(() => import("../tools/css-tools/CssClipPathGenerator"));
const CssFlexboxGenerator = lazy(() => import("../tools/css-tools/CssFlexboxGenerator"));
const CssGridGenerator = lazy(() => import("../tools/css-tools/CssGridGenerator"));
const CssAnimationGenerator = lazy(() => import("../tools/css-tools/CssAnimationGenerator"));
const CssBorderRadiusGenerator = lazy(() => import("../tools/css-tools/CssBorderRadiusGenerator"));
const CssFilterGenerator = lazy(() => import("../tools/css-tools/CssFilterGenerator"));
const CssTransformGenerator = lazy(() => import("../tools/css-tools/CssTransformGenerator"));
const JavascriptFormatter = lazy(() => import("../tools/javascript-tools/JavascriptFormatter"));
const JavascriptMinifier = lazy(() => import("../tools/javascript-tools/JavascriptMinifier"));
const JavascriptBeautifier = lazy(() => import("../tools/javascript-tools/JavascriptBeautifier"));
const JavascriptObfuscator = lazy(() => import("../tools/javascript-tools/JavascriptObfuscator"));
const JavascriptDeobfuscator = lazy(() => import("../tools/javascript-tools/JavascriptDeobfuscator"));
const JavascriptValidator = lazy(() => import("../tools/javascript-tools/JavascriptValidator"));
const JavascriptPlayground = lazy(() => import("../tools/javascript-tools/JavascriptPlayground"));
const JavascriptConsole = lazy(() => import("../tools/javascript-tools/JavascriptConsole"));
const Es6Converter = lazy(() => import("../tools/javascript-tools/Es6Converter"));
const BabelPlayground = lazy(() => import("../tools/javascript-tools/BabelPlayground"));
const GraphqlExplorer = lazy(() => import("../tools/api-tools/GraphqlExplorer"));
const CurlGenerator = lazy(() => import("../tools/api-tools/CurlGenerator"));
const PostmanCollectionGenerator = lazy(() => import("../tools/api-tools/PostmanCollectionGenerator"));
const HttpHeaderViewer = lazy(() => import("../tools/api-tools/HttpHeaderViewer"));
const ApiMockGenerator = lazy(() => import("../tools/api-tools/ApiMockGenerator"));
const ApiDocumentationGenerator = lazy(() => import("../tools/api-tools/ApiDocumentationGenerator"));
const WebhookTester = lazy(() => import("../tools/api-tools/WebhookTester"));
const ApiRequestBuilder = lazy(() => import("../tools/api-tools/ApiRequestBuilder"));
const JwtEncoder = lazy(() => import("../tools/jwt-tools/JwtEncoder"));
const JwtInspector = lazy(() => import("../tools/jwt-tools/JwtInspector"));
const JwtExpiryChecker = lazy(() => import("../tools/jwt-tools/JwtExpiryChecker"));
const JwtGenerator = lazy(() => import("../tools/jwt-tools/JwtGenerator"));
const UrlEncode = lazy(() => import("../tools/encoding-tools/UrlEncode"));
const UrlDecode = lazy(() => import("../tools/encoding-tools/UrlDecode"));
const HtmlEncode = lazy(() => import("../tools/encoding-tools/HtmlEncode"));
const HtmlDecode = lazy(() => import("../tools/encoding-tools/HtmlDecode"));
const UnicodeConverter = lazy(() => import("../tools/encoding-tools/UnicodeConverter"));
const Utf8Converter = lazy(() => import("../tools/encoding-tools/Utf8Converter"));
const AsciiConverter = lazy(() => import("../tools/encoding-tools/AsciiConverter"));
const BinaryConverter = lazy(() => import("../tools/encoding-tools/BinaryConverter"));
const HexConverter = lazy(() => import("../tools/encoding-tools/HexConverter"));
const OctalConverter = lazy(() => import("../tools/encoding-tools/OctalConverter"));
const Base64Encode = lazy(() => import("../tools/encoding-tools/Base64Encode"));
const Base64Decode = lazy(() => import("../tools/encoding-tools/Base64Decode"));
const Md5Generator = lazy(() => import("../tools/hash-tools/Md5Generator"));
const Sha1Generator = lazy(() => import("../tools/hash-tools/Sha1Generator"));
const Sha256Generator = lazy(() => import("../tools/hash-tools/Sha256Generator"));
const Sha512Generator = lazy(() => import("../tools/hash-tools/Sha512Generator"));
const HmacGenerator = lazy(() => import("../tools/hash-tools/HmacGenerator"));
const BcryptGenerator = lazy(() => import("../tools/hash-tools/BcryptGenerator"));
const UuidGenerator = lazy(() => import("../tools/hash-tools/UuidGenerator"));
const UuidValidator = lazy(() => import("../tools/hash-tools/UuidValidator"));
const SqlToMongoQuery = lazy(() => import("../tools/developer-tools/SqlToMongoQuery"));
const SqlCheatSheet = lazy(() => import("../tools/developer-tools/SqlCheatSheet"));
const SqlBeautifierTool = lazy(() => import("../tools/developer-tools/SqlBeautifierTool"));
const SvgOptimizer = lazy(() => import("../tools/image-tools/SvgOptimizer"));
const SvgViewer = lazy(() => import("../tools/image-tools/SvgViewer"));
const SvgToPng = lazy(() => import("../tools/image-tools/SvgToPng"));
const PngToSvgGuide = lazy(() => import("../tools/image-tools/PngToSvgGuide"));
const ImageCompressorTool = lazy(() => import("../tools/image-tools/ImageCompressorTool"));
const ImageCropper = lazy(() => import("../tools/image-tools/ImageCropper"));
const ImageMetadataViewer = lazy(() => import("../tools/image-tools/ImageMetadataViewer"));
const ExifReader = lazy(() => import("../tools/image-tools/ExifReader"));
const IcoGenerator = lazy(() => import("../tools/image-tools/IcoGenerator"));
const PasswordStrengthChecker = lazy(() => import("../tools/security-tools/PasswordStrengthChecker"));
const CsrGenerator = lazy(() => import("../tools/security-tools/CsrGenerator"));
const CertificateDecoder = lazy(() => import("../tools/security-tools/CertificateDecoder"));
const CorsTester = lazy(() => import("../tools/security-tools/CorsTester"));
const CspGenerator = lazy(() => import("../tools/security-tools/CspGenerator"));
const SecurityHeadersChecker = lazy(() => import("../tools/security-tools/SecurityHeadersChecker"));
const DnsLookup = lazy(() => import("../tools/security-tools/DnsLookup"));
const WhoisLookup = lazy(() => import("../tools/security-tools/WhoisLookup"));
const SpfChecker = lazy(() => import("../tools/security-tools/SpfChecker"));
const DkimChecker = lazy(() => import("../tools/security-tools/DkimChecker"));
const DmarcChecker = lazy(() => import("../tools/security-tools/DmarcChecker"));
const HttpStatusChecker = lazy(() => import("../tools/http-tools/HttpStatusChecker"));
const RedirectChecker = lazy(() => import("../tools/http-tools/RedirectChecker"));
const UrlParser = lazy(() => import("../tools/http-tools/UrlParser"));
const UrlInspector = lazy(() => import("../tools/http-tools/UrlInspector"));
const SqlGeneratorAi = lazy(() => import("../tools/ai-dev-tools/SqlGeneratorAi"));
const ApiGenerator = lazy(() => import("../tools/ai-dev-tools/ApiGenerator"));
const CommitMessageGenerator = lazy(() => import("../tools/ai-dev-tools/CommitMessageGenerator"));
const ReadmeGenerator = lazy(() => import("../tools/ai-dev-tools/ReadmeGenerator"));
const DockerfileGenerator = lazy(() => import("../tools/ai-dev-tools/DockerfileGenerator"));
const GitignoreGenerator = lazy(() => import("../tools/ai-dev-tools/GitignoreGenerator"));
const EnvTemplateGenerator = lazy(() => import("../tools/ai-dev-tools/EnvTemplateGenerator"));
const CharacterCounter = lazy(() => import("../tools/text-tools/CharacterCounter"));
const RemoveEmptyLines = lazy(() => import("../tools/text-tools/RemoveEmptyLines"));
const CaseConverter = lazy(() => import("../tools/text-tools/CaseConverter"));
const SlugGenerator = lazy(() => import("../tools/text-tools/SlugGenerator"));
const RandomStringGenerator = lazy(() => import("../tools/text-tools/RandomStringGenerator"));
const OpenGraphGenerator = lazy(() => import("../tools/seo-tools/OpenGraphGenerator"));
const CanonicalUrlGenerator = lazy(() => import("../tools/seo-tools/CanonicalUrlGenerator"));
const KeywordDensityChecker = lazy(() => import("../tools/seo-tools/KeywordDensityChecker"));
const HreflangGenerator = lazy(() => import("../tools/seo-tools/HreflangGenerator"));
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

function variantRoute(parentPath) {
  return {
    path: `${parentPath}/:variant`,
    element: (
      <Suspense fallback={fallback}>
        <SeoVariantPage parentPath={parentPath} />
      </Suspense>
    ),
  };
}

export const appRoutes = [
  {
    path: "/",
    element: <Home />,
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
    // Trailing /* required so BlogRoutes can match the path remainder (index, :slug, …).
    // Also matches bare /blog.
    path: "/blog/*",
    element: (
      <Suspense fallback={fallback}>
        <BlogApexEntry />
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
    path: "/ai-writing-tools/ai-title-generator",
    element: (
      <Suspense fallback={fallback}>
        <AiTitleGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-writing-tools/blog-outline-generator",
    element: (
      <Suspense fallback={fallback}>
        <BlogOutlineGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-writing-tools/meta-description-generator",
    element: (
      <Suspense fallback={fallback}>
        <MetaDescriptionGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-writing-tools/faq-generator",
    element: (
      <Suspense fallback={fallback}>
        <FaqGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-writing-tools/product-description-generator",
    element: (
      <Suspense fallback={fallback}>
        <ProductDescriptionGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-writing-tools/email-generator",
    element: (
      <Suspense fallback={fallback}>
        <EmailGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-writing-tools/cover-letter-generator",
    element: (
      <Suspense fallback={fallback}>
        <CoverLetterGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-writing-tools/linkedin-post-generator",
    element: (
      <Suspense fallback={fallback}>
        <LinkedinPostGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-writing-tools/tweet-generator",
    element: (
      <Suspense fallback={fallback}>
        <TweetGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-writing-tools/rewrite-tool",
    element: (
      <Suspense fallback={fallback}>
        <RewriteTool />
      </Suspense>
    ),
  },
  {
    path: "/ai-writing-tools/tone-changer",
    element: (
      <Suspense fallback={fallback}>
        <ToneChanger />
      </Suspense>
    ),
  },
  {
    path: "/ai-writing-tools/text-simplifier",
    element: (
      <Suspense fallback={fallback}>
        <TextSimplifier />
      </Suspense>
    ),
  },
  {
    path: "/ai-writing-tools/ai-proofreader",
    element: (
      <Suspense fallback={fallback}>
        <AiProofreader />
      </Suspense>
    ),
  },
  {
    path: "/ai-coding-tools/code-reviewer",
    element: (
      <Suspense fallback={fallback}>
        <CodeReviewer />
      </Suspense>
    ),
  },
  {
    path: "/ai-coding-tools/bug-finder",
    element: (
      <Suspense fallback={fallback}>
        <BugFinder />
      </Suspense>
    ),
  },
  {
    path: "/ai-coding-tools/json-generator",
    element: (
      <Suspense fallback={fallback}>
        <JsonGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-coding-tools/unit-test-generator",
    element: (
      <Suspense fallback={fallback}>
        <UnitTestGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-coding-tools/css-generator-ai",
    element: (
      <Suspense fallback={fallback}>
        <CssGeneratorAi />
      </Suspense>
    ),
  },
  {
    path: "/ai-coding-tools/react-component-generator",
    element: (
      <Suspense fallback={fallback}>
        <ReactComponentGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-coding-tools/readme-generator-ai",
    element: (
      <Suspense fallback={fallback}>
        <ReadmeGeneratorAi />
      </Suspense>
    ),
  },
  {
    path: "/ai-seo-tools/seo-audit-ai",
    element: (
      <Suspense fallback={fallback}>
        <SeoAuditAi />
      </Suspense>
    ),
  },
  {
    path: "/ai-seo-tools/ai-keyword-generator",
    element: (
      <Suspense fallback={fallback}>
        <AiKeywordGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-seo-tools/keyword-clustering",
    element: (
      <Suspense fallback={fallback}>
        <KeywordClustering />
      </Suspense>
    ),
  },
  {
    path: "/ai-seo-tools/internal-linking-suggestions",
    element: (
      <Suspense fallback={fallback}>
        <InternalLinkingSuggestions />
      </Suspense>
    ),
  },
  {
    path: "/ai-seo-tools/ai-content-optimizer",
    element: (
      <Suspense fallback={fallback}>
        <AiContentOptimizer />
      </Suspense>
    ),
  },
  {
    path: "/ai-seo-tools/readability-checker",
    element: (
      <Suspense fallback={fallback}>
        <ReadabilityChecker />
      </Suspense>
    ),
  },
  {
    path: "/ai-seo-tools/heading-optimizer",
    element: (
      <Suspense fallback={fallback}>
        <HeadingOptimizer />
      </Suspense>
    ),
  },
  {
    path: "/ai-seo-tools/faq-generator-seo",
    element: (
      <Suspense fallback={fallback}>
        <FaqGeneratorSeo />
      </Suspense>
    ),
  },
  {
    path: "/ai-marketing-tools/ad-copy-generator",
    element: (
      <Suspense fallback={fallback}>
        <AdCopyGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-marketing-tools/google-ads-headline-generator",
    element: (
      <Suspense fallback={fallback}>
        <GoogleAdsHeadlineGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-marketing-tools/facebook-ad-generator",
    element: (
      <Suspense fallback={fallback}>
        <FacebookAdGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-marketing-tools/youtube-title-generator",
    element: (
      <Suspense fallback={fallback}>
        <YoutubeTitleGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-marketing-tools/thumbnail-text-generator",
    element: (
      <Suspense fallback={fallback}>
        <ThumbnailTextGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-marketing-tools/landing-page-copy-generator",
    element: (
      <Suspense fallback={fallback}>
        <LandingPageCopyGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-marketing-tools/call-to-action-generator",
    element: (
      <Suspense fallback={fallback}>
        <CallToActionGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-marketing-tools/brand-slogan-generator",
    element: (
      <Suspense fallback={fallback}>
        <BrandSloganGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-marketing-tools/brand-name-generator",
    element: (
      <Suspense fallback={fallback}>
        <BrandNameGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-office-tools/meeting-notes-summarizer",
    element: (
      <Suspense fallback={fallback}>
        <MeetingNotesSummarizer />
      </Suspense>
    ),
  },
  {
    path: "/ai-office-tools/minutes-of-meeting-generator",
    element: (
      <Suspense fallback={fallback}>
        <MinutesOfMeetingGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-office-tools/task-list-extractor",
    element: (
      <Suspense fallback={fallback}>
        <TaskListExtractor />
      </Suspense>
    ),
  },
  {
    path: "/ai-office-tools/professional-email-writer",
    element: (
      <Suspense fallback={fallback}>
        <ProfessionalEmailWriter />
      </Suspense>
    ),
  },
  {
    path: "/ai-office-tools/business-proposal-generator",
    element: (
      <Suspense fallback={fallback}>
        <BusinessProposalGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-office-tools/invoice-description-writer",
    element: (
      <Suspense fallback={fallback}>
        <InvoiceDescriptionWriter />
      </Suspense>
    ),
  },
  {
    path: "/ai-office-tools/executive-summary-generator",
    element: (
      <Suspense fallback={fallback}>
        <ExecutiveSummaryGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-resume-career/ats-resume-checker",
    element: (
      <Suspense fallback={fallback}>
        <AtsResumeChecker />
      </Suspense>
    ),
  },
  {
    path: "/ai-resume-career/resume-optimizer",
    element: (
      <Suspense fallback={fallback}>
        <ResumeOptimizer />
      </Suspense>
    ),
  },
  {
    path: "/ai-resume-career/job-description-analyzer",
    element: (
      <Suspense fallback={fallback}>
        <JobDescriptionAnalyzer />
      </Suspense>
    ),
  },
  {
    path: "/ai-resume-career/salary-negotiation-assistant",
    element: (
      <Suspense fallback={fallback}>
        <SalaryNegotiationAssistant />
      </Suspense>
    ),
  },
  {
    path: "/ai-resume-career/skill-gap-analyzer",
    element: (
      <Suspense fallback={fallback}>
        <SkillGapAnalyzer />
      </Suspense>
    ),
  },
  {
    path: "/ai-learning-tools/flashcard-generator",
    element: (
      <Suspense fallback={fallback}>
        <FlashcardGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-learning-tools/quiz-generator",
    element: (
      <Suspense fallback={fallback}>
        <QuizGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-learning-tools/study-notes-generator",
    element: (
      <Suspense fallback={fallback}>
        <StudyNotesGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-learning-tools/explain-like-im-10",
    element: (
      <Suspense fallback={fallback}>
        <ExplainLikeIm10 />
      </Suspense>
    ),
  },
  {
    path: "/ai-learning-tools/code-tutor",
    element: (
      <Suspense fallback={fallback}>
        <CodeTutor />
      </Suspense>
    ),
  },
  {
    path: "/ai-learning-tools/formula-explainer",
    element: (
      <Suspense fallback={fallback}>
        <FormulaExplainer />
      </Suspense>
    ),
  },
  {
    path: "/ai-learning-tools/essay-improver",
    element: (
      <Suspense fallback={fallback}>
        <EssayImprover />
      </Suspense>
    ),
  },
  {
    path: "/ai-image-helpers/alt-text-generator",
    element: (
      <Suspense fallback={fallback}>
        <AltTextGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-image-helpers/image-caption-generator",
    element: (
      <Suspense fallback={fallback}>
        <ImageCaptionGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-image-helpers/ocr-text-cleaner",
    element: (
      <Suspense fallback={fallback}>
        <OcrTextCleaner />
      </Suspense>
    ),
  },
  {
    path: "/ai-image-helpers/color-palette-extractor",
    element: (
      <Suspense fallback={fallback}>
        <ColorPaletteExtractor />
      </Suspense>
    ),
  },
  {
    path: "/ai-image-helpers/prompt-generator-image-models",
    element: (
      <Suspense fallback={fallback}>
        <PromptGeneratorImageModels />
      </Suspense>
    ),
  },
  {
    path: "/ai-image-helpers/background-description-generator",
    element: (
      <Suspense fallback={fallback}>
        <BackgroundDescriptionGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-prompt-engineering/prompt-enhancer",
    element: (
      <Suspense fallback={fallback}>
        <PromptEnhancer />
      </Suspense>
    ),
  },
  {
    path: "/ai-prompt-engineering/prompt-shortener",
    element: (
      <Suspense fallback={fallback}>
        <PromptShortener />
      </Suspense>
    ),
  },
  {
    path: "/ai-prompt-engineering/prompt-debugger",
    element: (
      <Suspense fallback={fallback}>
        <PromptDebugger />
      </Suspense>
    ),
  },
  {
    path: "/ai-prompt-engineering/prompt-translator",
    element: (
      <Suspense fallback={fallback}>
        <PromptTranslator />
      </Suspense>
    ),
  },
  {
    path: "/ai-prompt-engineering/prompt-library",
    element: (
      <Suspense fallback={fallback}>
        <PromptLibrary />
      </Suspense>
    ),
  },
  {
    path: "/ai-prompt-engineering/prompt-version-comparison",
    element: (
      <Suspense fallback={fallback}>
        <PromptVersionComparison />
      </Suspense>
    ),
  },
  {
    path: "/ai-prompt-engineering/prompt-quality-score",
    element: (
      <Suspense fallback={fallback}>
        <PromptQualityScore />
      </Suspense>
    ),
  },
  {
    path: "/ai-prompt-engineering/role-prompt-generator",
    element: (
      <Suspense fallback={fallback}>
        <RolePromptGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-data-tools/csv-cleaner",
    element: (
      <Suspense fallback={fallback}>
        <CsvCleaner />
      </Suspense>
    ),
  },
  {
    path: "/ai-data-tools/json-cleaner",
    element: (
      <Suspense fallback={fallback}>
        <JsonCleaner />
      </Suspense>
    ),
  },
  {
    path: "/ai-data-tools/duplicate-finder",
    element: (
      <Suspense fallback={fallback}>
        <DuplicateFinder />
      </Suspense>
    ),
  },
  {
    path: "/ai-data-tools/data-summarizer",
    element: (
      <Suspense fallback={fallback}>
        <DataSummarizer />
      </Suspense>
    ),
  },
  {
    path: "/ai-data-tools/sql-to-csv",
    element: (
      <Suspense fallback={fallback}>
        <SqlToCsvAi />
      </Suspense>
    ),
  },
  {
    path: "/ai-data-tools/csv-visualizer",
    element: (
      <Suspense fallback={fallback}>
        <CsvVisualizer />
      </Suspense>
    ),
  },
  {
    path: "/ai-automation-tools/workflow-generator",
    element: (
      <Suspense fallback={fallback}>
        <WorkflowGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-automation-tools/sop-generator",
    element: (
      <Suspense fallback={fallback}>
        <SopGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-automation-tools/checklist-generator",
    element: (
      <Suspense fallback={fallback}>
        <ChecklistGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-automation-tools/email-automation-drafts",
    element: (
      <Suspense fallback={fallback}>
        <EmailAutomationDrafts />
      </Suspense>
    ),
  },
  {
    path: "/ai-automation-tools/zapier-workflow-ideas",
    element: (
      <Suspense fallback={fallback}>
        <ZapierWorkflowIdeas />
      </Suspense>
    ),
  },
  {
    path: "/ai-automation-tools/n8n-workflow-generator",
    element: (
      <Suspense fallback={fallback}>
        <N8nWorkflowGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-automation-tools/api-integration-assistant",
    element: (
      <Suspense fallback={fallback}>
        <ApiIntegrationAssistant />
      </Suspense>
    ),
  },
  {
    path: "/ai-website-auditor/ai-website-auditor",
    element: (
      <Suspense fallback={fallback}>
        <AiWebsiteAuditor />
      </Suspense>
    ),
  },
  {
    path: "/retirement-tools/pension-calculator",
    element: (
      <Suspense fallback={fallback}>
        <PensionCalculator />
      </Suspense>
    ),
  },
  {
    path: "/retirement-tools/nps-calculator",
    element: (
      <Suspense fallback={fallback}>
        <NpsCalculator />
      </Suspense>
    ),
  },
  {
    path: "/retirement-tools/epf-pension-estimator",
    element: (
      <Suspense fallback={fallback}>
        <EpfPensionEstimator />
      </Suspense>
    ),
  },
  {
    path: "/retirement-tools/retirement-planner",
    element: (
      <Suspense fallback={fallback}>
        <RetirementPlanner />
      </Suspense>
    ),
  },
  {
    path: "/retirement-tools/safe-withdrawal-rate-calculator",
    element: (
      <Suspense fallback={fallback}>
        <SafeWithdrawalRateCalculator />
      </Suspense>
    ),
  },
  {
    path: "/banking-tools/fd-calculator",
    element: (
      <Suspense fallback={fallback}>
        <FdCalculator />
      </Suspense>
    ),
  },
  {
    path: "/banking-tools/rd-calculator",
    element: (
      <Suspense fallback={fallback}>
        <RdCalculator />
      </Suspense>
    ),
  },
  {
    path: "/banking-tools/compound-interest-calculator",
    element: (
      <Suspense fallback={fallback}>
        <CompoundInterestCalculator />
      </Suspense>
    ),
  },
  {
    path: "/banking-tools/simple-interest-calculator",
    element: (
      <Suspense fallback={fallback}>
        <SimpleInterestCalculator />
      </Suspense>
    ),
  },
  {
    path: "/banking-tools/savings-interest-calculator",
    element: (
      <Suspense fallback={fallback}>
        <SavingsInterestCalculator />
      </Suspense>
    ),
  },
  {
    path: "/banking-tools/credit-card-emi-calculator",
    element: (
      <Suspense fallback={fallback}>
        <CreditCardEmiCalculator />
      </Suspense>
    ),
  },
  {
    path: "/banking-tools/credit-card-payoff-calculator",
    element: (
      <Suspense fallback={fallback}>
        <CreditCardPayoffCalculator />
      </Suspense>
    ),
  },
  {
    path: "/banking-tools/credit-utilization-calculator",
    element: (
      <Suspense fallback={fallback}>
        <CreditUtilizationCalculator />
      </Suspense>
    ),
  },
  {
    path: "/insurance-tools/term-insurance-calculator",
    element: (
      <Suspense fallback={fallback}>
        <TermInsuranceCalculator />
      </Suspense>
    ),
  },
  {
    path: "/insurance-tools/life-insurance-calculator",
    element: (
      <Suspense fallback={fallback}>
        <LifeInsuranceCalculator />
      </Suspense>
    ),
  },
  {
    path: "/insurance-tools/health-insurance-premium-estimator",
    element: (
      <Suspense fallback={fallback}>
        <HealthInsurancePremiumEstimator />
      </Suspense>
    ),
  },
  {
    path: "/insurance-tools/vehicle-insurance-estimator",
    element: (
      <Suspense fallback={fallback}>
        <VehicleInsuranceEstimator />
      </Suspense>
    ),
  },
  {
    path: "/business-finance/invoice-generator",
    element: (
      <Suspense fallback={fallback}>
        <InvoiceGenerator />
      </Suspense>
    ),
  },
  {
    path: "/business-finance/gst-invoice-generator",
    element: (
      <Suspense fallback={fallback}>
        <GstInvoiceGenerator />
      </Suspense>
    ),
  },
  {
    path: "/business-finance/profit-margin-calculator",
    element: (
      <Suspense fallback={fallback}>
        <ProfitMarginCalculator />
      </Suspense>
    ),
  },
  {
    path: "/business-finance/break-even-calculator",
    element: (
      <Suspense fallback={fallback}>
        <BreakEvenCalculator />
      </Suspense>
    ),
  },
  {
    path: "/business-finance/depreciation-calculator",
    element: (
      <Suspense fallback={fallback}>
        <DepreciationCalculator />
      </Suspense>
    ),
  },
  {
    path: "/business-finance/roi-calculator",
    element: (
      <Suspense fallback={fallback}>
        <RoiCalculator />
      </Suspense>
    ),
  },
  {
    path: "/business-finance/business-valuation-calculator",
    element: (
      <Suspense fallback={fallback}>
        <BusinessValuationCalculator />
      </Suspense>
    ),
  },










  {
    path: "/mutual-fund-tools/lumpsum-calculator",
    element: (
      <Suspense fallback={fallback}>
        <LumpsumCalculator />
      </Suspense>
    ),
  },
  {
    path: "/mutual-fund-tools/swp-calculator",
    element: (
      <Suspense fallback={fallback}>
        <SwpCalculator />
      </Suspense>
    ),
  },
  {
    path: "/mutual-fund-tools/stp-calculator",
    element: (
      <Suspense fallback={fallback}>
        <StpCalculator />
      </Suspense>
    ),
  },
  {
    path: "/mutual-fund-tools/goal-planner",
    element: (
      <Suspense fallback={fallback}>
        <GoalPlanner />
      </Suspense>
    ),
  },
  {
    path: "/mutual-fund-tools/retirement-corpus-calculator",
    element: (
      <Suspense fallback={fallback}>
        <RetirementCorpusCalculator />
      </Suspense>
    ),
  },
  {
    path: "/mutual-fund-tools/child-education-planner",
    element: (
      <Suspense fallback={fallback}>
        <ChildEducationPlanner />
      </Suspense>
    ),
  },
  {
    path: "/mutual-fund-tools/fire-calculator",
    element: (
      <Suspense fallback={fallback}>
        <FireCalculator />
      </Suspense>
    ),
  },
  {
    path: "/loan-calculators/home-loan-calculator",
    element: (
      <Suspense fallback={fallback}>
        <HomeLoanCalculator />
      </Suspense>
    ),
  },
  {
    path: "/loan-calculators/car-loan-calculator",
    element: (
      <Suspense fallback={fallback}>
        <CarLoanCalculator />
      </Suspense>
    ),
  },
  {
    path: "/loan-calculators/personal-loan-calculator",
    element: (
      <Suspense fallback={fallback}>
        <PersonalLoanCalculator />
      </Suspense>
    ),
  },
  {
    path: "/loan-calculators/education-loan-calculator",
    element: (
      <Suspense fallback={fallback}>
        <EducationLoanCalculator />
      </Suspense>
    ),
  },
  {
    path: "/loan-calculators/gold-loan-calculator",
    element: (
      <Suspense fallback={fallback}>
        <GoldLoanCalculator />
      </Suspense>
    ),
  },
  {
    path: "/loan-calculators/business-loan-calculator",
    element: (
      <Suspense fallback={fallback}>
        <BusinessLoanCalculator />
      </Suspense>
    ),
  },
  {
    path: "/loan-calculators/loan-prepayment-calculator",
    element: (
      <Suspense fallback={fallback}>
        <LoanPrepaymentCalculator />
      </Suspense>
    ),
  },
  {
    path: "/loan-calculators/balance-transfer-calculator",
    element: (
      <Suspense fallback={fallback}>
        <BalanceTransferCalculator />
      </Suspense>
    ),
  },
  {
    path: "/tax-tools/income-tax-calculator",
    element: (
      <Suspense fallback={fallback}>
        <IncomeTaxCalculator />
      </Suspense>
    ),
  },
  {
    path: "/tax-tools/old-vs-new-tax-regime",
    element: (
      <Suspense fallback={fallback}>
        <OldVsNewTaxRegime />
      </Suspense>
    ),
  },
  {
    path: "/tax-tools/hra-calculator",
    element: (
      <Suspense fallback={fallback}>
        <HraCalculator />
      </Suspense>
    ),
  },
  {
    path: "/tax-tools/standard-deduction-calculator",
    element: (
      <Suspense fallback={fallback}>
        <StandardDeductionCalculator />
      </Suspense>
    ),
  },
  {
    path: "/tax-tools/section-80c-calculator",
    element: (
      <Suspense fallback={fallback}>
        <Section80cCalculator />
      </Suspense>
    ),
  },
  {
    path: "/tax-tools/capital-gains-tax-calculator",
    element: (
      <Suspense fallback={fallback}>
        <CapitalGainsTaxCalculator />
      </Suspense>
    ),
  },
  {
    path: "/tax-tools/gst-inclusive-exclusive-calculator",
    element: (
      <Suspense fallback={fallback}>
        <GstInclusiveExclusiveCalculator />
      </Suspense>
    ),
  },
  {
    path: "/tax-tools/tds-calculator",
    element: (
      <Suspense fallback={fallback}>
        <TdsCalculator />
      </Suspense>
    ),
  },
  {
    path: "/tax-tools/advance-tax-calculator",
    element: (
      <Suspense fallback={fallback}>
        <AdvanceTaxCalculator />
      </Suspense>
    ),
  },
  {
    path: "/salary-hr/in-hand-salary-calculator",
    element: (
      <Suspense fallback={fallback}>
        <InHandSalaryCalculator />
      </Suspense>
    ),
  },
  {
    path: "/salary-hr/ctc-calculator",
    element: (
      <Suspense fallback={fallback}>
        <CtcCalculator />
      </Suspense>
    ),
  },
  {
    path: "/salary-hr/salary-breakup-calculator",
    element: (
      <Suspense fallback={fallback}>
        <SalaryBreakupCalculator />
      </Suspense>
    ),
  },
  {
    path: "/salary-hr/pf-calculator",
    element: (
      <Suspense fallback={fallback}>
        <PfCalculator />
      </Suspense>
    ),
  },
  {
    path: "/salary-hr/epf-interest-calculator",
    element: (
      <Suspense fallback={fallback}>
        <EpfInterestCalculator />
      </Suspense>
    ),
  },
  {
    path: "/salary-hr/leave-encashment-calculator",
    element: (
      <Suspense fallback={fallback}>
        <LeaveEncashmentCalculator />
      </Suspense>
    ),
  },
  {
    path: "/salary-hr/bonus-calculator",
    element: (
      <Suspense fallback={fallback}>
        <BonusCalculator />
      </Suspense>
    ),
  },
  {
    path: "/salary-hr/notice-period-calculator",
    element: (
      <Suspense fallback={fallback}>
        <NoticePeriodCalculator />
      </Suspense>
    ),
  },
  {
    path: "/json-tools/json-validator",
    element: (
      <Suspense fallback={fallback}>
        <JsonValidator />
      </Suspense>
    ),
  },
  {
    path: "/json-tools/json-minifier",
    element: (
      <Suspense fallback={fallback}>
        <JsonMinifier />
      </Suspense>
    ),
  },
  {
    path: "/json-tools/json-beautifier",
    element: (
      <Suspense fallback={fallback}>
        <JsonBeautifier />
      </Suspense>
    ),
  },
  {
    path: "/json-tools/json-pretty-print",
    element: (
      <Suspense fallback={fallback}>
        <JsonPrettyPrint />
      </Suspense>
    ),
  },
  {
    path: "/json-tools/json-compare",
    element: (
      <Suspense fallback={fallback}>
        <JsonCompare />
      </Suspense>
    ),
  },
  {
    path: "/json-tools/json-diff-viewer",
    element: (
      <Suspense fallback={fallback}>
        <JsonDiffViewer />
      </Suspense>
    ),
  },
  {
    path: "/json-tools/json-tree-viewer",
    element: (
      <Suspense fallback={fallback}>
        <JsonTreeViewer />
      </Suspense>
    ),
  },
  {
    path: "/json-tools/json-to-xml",
    element: (
      <Suspense fallback={fallback}>
        <JsonToXml />
      </Suspense>
    ),
  },
  {
    path: "/json-tools/xml-to-json",
    element: (
      <Suspense fallback={fallback}>
        <XmlToJson />
      </Suspense>
    ),
  },
  {
    path: "/json-tools/json-to-csv",
    element: (
      <Suspense fallback={fallback}>
        <JsonToCsv />
      </Suspense>
    ),
  },
  {
    path: "/json-tools/json-to-typescript",
    element: (
      <Suspense fallback={fallback}>
        <JsonToTypescript />
      </Suspense>
    ),
  },
  {
    path: "/json-tools/json-to-java",
    element: (
      <Suspense fallback={fallback}>
        <JsonToJava />
      </Suspense>
    ),
  },
  {
    path: "/json-tools/json-to-csharp",
    element: (
      <Suspense fallback={fallback}>
        <JsonToCsharp />
      </Suspense>
    ),
  },
  {
    path: "/json-tools/json-to-go-struct",
    element: (
      <Suspense fallback={fallback}>
        <JsonToGoStruct />
      </Suspense>
    ),
  },
  {
    path: "/json-tools/json-to-dart",
    element: (
      <Suspense fallback={fallback}>
        <JsonToDart />
      </Suspense>
    ),
  },
  {
    path: "/json-tools/json-schema-generator",
    element: (
      <Suspense fallback={fallback}>
        <JsonSchemaGenerator />
      </Suspense>
    ),
  },
  {
    path: "/html-tools/html-formatter",
    element: (
      <Suspense fallback={fallback}>
        <HtmlFormatter />
      </Suspense>
    ),
  },
  {
    path: "/html-tools/html-beautifier",
    element: (
      <Suspense fallback={fallback}>
        <HtmlBeautifier />
      </Suspense>
    ),
  },
  {
    path: "/html-tools/html-escape",
    element: (
      <Suspense fallback={fallback}>
        <HtmlEscape />
      </Suspense>
    ),
  },
  {
    path: "/html-tools/html-unescape",
    element: (
      <Suspense fallback={fallback}>
        <HtmlUnescape />
      </Suspense>
    ),
  },
  {
    path: "/html-tools/html-encoder",
    element: (
      <Suspense fallback={fallback}>
        <HtmlEncoder />
      </Suspense>
    ),
  },
  {
    path: "/html-tools/html-decoder",
    element: (
      <Suspense fallback={fallback}>
        <HtmlDecoder />
      </Suspense>
    ),
  },
  {
    path: "/html-tools/html-preview",
    element: (
      <Suspense fallback={fallback}>
        <HtmlPreview />
      </Suspense>
    ),
  },
  {
    path: "/html-tools/html-to-markdown",
    element: (
      <Suspense fallback={fallback}>
        <HtmlToMarkdown />
      </Suspense>
    ),
  },
  {
    path: "/html-tools/markdown-to-html",
    element: (
      <Suspense fallback={fallback}>
        <MarkdownToHtml />
      </Suspense>
    ),
  },
  {
    path: "/html-tools/html-table-generator",
    element: (
      <Suspense fallback={fallback}>
        <HtmlTableGenerator />
      </Suspense>
    ),
  },
  {
    path: "/html-tools/html-email-generator",
    element: (
      <Suspense fallback={fallback}>
        <HtmlEmailGenerator />
      </Suspense>
    ),
  },
  {
    path: "/html-tools/html-entity-converter",
    element: (
      <Suspense fallback={fallback}>
        <HtmlEntityConverter />
      </Suspense>
    ),
  },
  {
    path: "/css-tools/css-formatter",
    element: (
      <Suspense fallback={fallback}>
        <CssFormatter />
      </Suspense>
    ),
  },
  {
    path: "/css-tools/css-minifier",
    element: (
      <Suspense fallback={fallback}>
        <CssMinifier />
      </Suspense>
    ),
  },
  {
    path: "/css-tools/css-shadow-generator",
    element: (
      <Suspense fallback={fallback}>
        <CssShadowGenerator />
      </Suspense>
    ),
  },
  {
    path: "/css-tools/css-clip-path-generator",
    element: (
      <Suspense fallback={fallback}>
        <CssClipPathGenerator />
      </Suspense>
    ),
  },
  {
    path: "/css-tools/css-flexbox-generator",
    element: (
      <Suspense fallback={fallback}>
        <CssFlexboxGenerator />
      </Suspense>
    ),
  },
  {
    path: "/css-tools/css-grid-generator",
    element: (
      <Suspense fallback={fallback}>
        <CssGridGenerator />
      </Suspense>
    ),
  },
  {
    path: "/css-tools/css-animation-generator",
    element: (
      <Suspense fallback={fallback}>
        <CssAnimationGenerator />
      </Suspense>
    ),
  },
  {
    path: "/css-tools/css-border-radius-generator",
    element: (
      <Suspense fallback={fallback}>
        <CssBorderRadiusGenerator />
      </Suspense>
    ),
  },
  {
    path: "/css-tools/css-filter-generator",
    element: (
      <Suspense fallback={fallback}>
        <CssFilterGenerator />
      </Suspense>
    ),
  },
  {
    path: "/css-tools/css-transform-generator",
    element: (
      <Suspense fallback={fallback}>
        <CssTransformGenerator />
      </Suspense>
    ),
  },
  {
    path: "/javascript-tools/javascript-formatter",
    element: (
      <Suspense fallback={fallback}>
        <JavascriptFormatter />
      </Suspense>
    ),
  },
  {
    path: "/javascript-tools/javascript-minifier",
    element: (
      <Suspense fallback={fallback}>
        <JavascriptMinifier />
      </Suspense>
    ),
  },
  {
    path: "/javascript-tools/javascript-beautifier",
    element: (
      <Suspense fallback={fallback}>
        <JavascriptBeautifier />
      </Suspense>
    ),
  },
  {
    path: "/javascript-tools/javascript-obfuscator",
    element: (
      <Suspense fallback={fallback}>
        <JavascriptObfuscator />
      </Suspense>
    ),
  },
  {
    path: "/javascript-tools/javascript-deobfuscator",
    element: (
      <Suspense fallback={fallback}>
        <JavascriptDeobfuscator />
      </Suspense>
    ),
  },
  {
    path: "/javascript-tools/javascript-validator",
    element: (
      <Suspense fallback={fallback}>
        <JavascriptValidator />
      </Suspense>
    ),
  },
  {
    path: "/javascript-tools/javascript-playground",
    element: (
      <Suspense fallback={fallback}>
        <JavascriptPlayground />
      </Suspense>
    ),
  },
  {
    path: "/javascript-tools/javascript-console",
    element: (
      <Suspense fallback={fallback}>
        <JavascriptConsole />
      </Suspense>
    ),
  },
  {
    path: "/javascript-tools/es6-converter",
    element: (
      <Suspense fallback={fallback}>
        <Es6Converter />
      </Suspense>
    ),
  },
  {
    path: "/javascript-tools/babel-playground",
    element: (
      <Suspense fallback={fallback}>
        <BabelPlayground />
      </Suspense>
    ),
  },
  {
    path: "/api-tools/graphql-explorer",
    element: (
      <Suspense fallback={fallback}>
        <GraphqlExplorer />
      </Suspense>
    ),
  },
  {
    path: "/api-tools/curl-generator",
    element: (
      <Suspense fallback={fallback}>
        <CurlGenerator />
      </Suspense>
    ),
  },
  {
    path: "/api-tools/postman-collection-generator",
    element: (
      <Suspense fallback={fallback}>
        <PostmanCollectionGenerator />
      </Suspense>
    ),
  },
  {
    path: "/api-tools/http-header-viewer",
    element: (
      <Suspense fallback={fallback}>
        <HttpHeaderViewer />
      </Suspense>
    ),
  },
  {
    path: "/api-tools/api-mock-generator",
    element: (
      <Suspense fallback={fallback}>
        <ApiMockGenerator />
      </Suspense>
    ),
  },
  {
    path: "/api-tools/api-documentation-generator",
    element: (
      <Suspense fallback={fallback}>
        <ApiDocumentationGenerator />
      </Suspense>
    ),
  },
  {
    path: "/api-tools/webhook-tester",
    element: (
      <Suspense fallback={fallback}>
        <WebhookTester />
      </Suspense>
    ),
  },
  {
    path: "/api-tools/api-request-builder",
    element: (
      <Suspense fallback={fallback}>
        <ApiRequestBuilder />
      </Suspense>
    ),
  },
  {
    path: "/jwt-tools/jwt-encoder",
    element: (
      <Suspense fallback={fallback}>
        <JwtEncoder />
      </Suspense>
    ),
  },
  {
    path: "/jwt-tools/jwt-inspector",
    element: (
      <Suspense fallback={fallback}>
        <JwtInspector />
      </Suspense>
    ),
  },
  {
    path: "/jwt-tools/jwt-expiry-checker",
    element: (
      <Suspense fallback={fallback}>
        <JwtExpiryChecker />
      </Suspense>
    ),
  },
  {
    path: "/jwt-tools/jwt-generator",
    element: (
      <Suspense fallback={fallback}>
        <JwtGenerator />
      </Suspense>
    ),
  },
  {
    path: "/encoding-tools/url-encode",
    element: (
      <Suspense fallback={fallback}>
        <UrlEncode />
      </Suspense>
    ),
  },
  {
    path: "/encoding-tools/url-decode",
    element: (
      <Suspense fallback={fallback}>
        <UrlDecode />
      </Suspense>
    ),
  },
  {
    path: "/encoding-tools/html-encode",
    element: (
      <Suspense fallback={fallback}>
        <HtmlEncode />
      </Suspense>
    ),
  },
  {
    path: "/encoding-tools/html-decode",
    element: (
      <Suspense fallback={fallback}>
        <HtmlDecode />
      </Suspense>
    ),
  },
  {
    path: "/encoding-tools/unicode-converter",
    element: (
      <Suspense fallback={fallback}>
        <UnicodeConverter />
      </Suspense>
    ),
  },
  {
    path: "/encoding-tools/utf8-converter",
    element: (
      <Suspense fallback={fallback}>
        <Utf8Converter />
      </Suspense>
    ),
  },
  {
    path: "/encoding-tools/ascii-converter",
    element: (
      <Suspense fallback={fallback}>
        <AsciiConverter />
      </Suspense>
    ),
  },
  {
    path: "/encoding-tools/binary-converter",
    element: (
      <Suspense fallback={fallback}>
        <BinaryConverter />
      </Suspense>
    ),
  },
  {
    path: "/encoding-tools/hex-converter",
    element: (
      <Suspense fallback={fallback}>
        <HexConverter />
      </Suspense>
    ),
  },
  {
    path: "/encoding-tools/octal-converter",
    element: (
      <Suspense fallback={fallback}>
        <OctalConverter />
      </Suspense>
    ),
  },
  {
    path: "/encoding-tools/base64-encode",
    element: (
      <Suspense fallback={fallback}>
        <Base64Encode />
      </Suspense>
    ),
  },
  {
    path: "/encoding-tools/base64-decode",
    element: (
      <Suspense fallback={fallback}>
        <Base64Decode />
      </Suspense>
    ),
  },
  {
    path: "/hash-tools/md5-generator",
    element: (
      <Suspense fallback={fallback}>
        <Md5Generator />
      </Suspense>
    ),
  },
  {
    path: "/hash-tools/sha1-generator",
    element: (
      <Suspense fallback={fallback}>
        <Sha1Generator />
      </Suspense>
    ),
  },
  {
    path: "/hash-tools/sha256-generator",
    element: (
      <Suspense fallback={fallback}>
        <Sha256Generator />
      </Suspense>
    ),
  },
  {
    path: "/hash-tools/sha512-generator",
    element: (
      <Suspense fallback={fallback}>
        <Sha512Generator />
      </Suspense>
    ),
  },
  {
    path: "/hash-tools/hmac-generator",
    element: (
      <Suspense fallback={fallback}>
        <HmacGenerator />
      </Suspense>
    ),
  },
  {
    path: "/hash-tools/bcrypt-generator",
    element: (
      <Suspense fallback={fallback}>
        <BcryptGenerator />
      </Suspense>
    ),
  },
  {
    path: "/hash-tools/uuid-generator",
    element: (
      <Suspense fallback={fallback}>
        <UuidGenerator />
      </Suspense>
    ),
  },
  {
    path: "/hash-tools/uuid-validator",
    element: (
      <Suspense fallback={fallback}>
        <UuidValidator />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/sql-to-mongo-query",
    element: (
      <Suspense fallback={fallback}>
        <SqlToMongoQuery />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/sql-cheat-sheet",
    element: (
      <Suspense fallback={fallback}>
        <SqlCheatSheet />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/sql-beautifier",
    element: (
      <Suspense fallback={fallback}>
        <SqlBeautifierTool />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/svg-optimizer",
    element: (
      <Suspense fallback={fallback}>
        <SvgOptimizer />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/svg-viewer",
    element: (
      <Suspense fallback={fallback}>
        <SvgViewer />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/svg-to-png",
    element: (
      <Suspense fallback={fallback}>
        <SvgToPng />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/png-to-svg-guide",
    element: (
      <Suspense fallback={fallback}>
        <PngToSvgGuide />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/image-compressor",
    element: (
      <Suspense fallback={fallback}>
        <ImageCompressorTool />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/image-cropper",
    element: (
      <Suspense fallback={fallback}>
        <ImageCropper />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/image-metadata-viewer",
    element: (
      <Suspense fallback={fallback}>
        <ImageMetadataViewer />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/exif-reader",
    element: (
      <Suspense fallback={fallback}>
        <ExifReader />
      </Suspense>
    ),
  },
  {
    path: "/image-tools/ico-generator",
    element: (
      <Suspense fallback={fallback}>
        <IcoGenerator />
      </Suspense>
    ),
  },
  {
    path: "/security-tools/password-strength-checker",
    element: (
      <Suspense fallback={fallback}>
        <PasswordStrengthChecker />
      </Suspense>
    ),
  },
  {
    path: "/security-tools/csr-generator",
    element: (
      <Suspense fallback={fallback}>
        <CsrGenerator />
      </Suspense>
    ),
  },
  {
    path: "/security-tools/certificate-decoder",
    element: (
      <Suspense fallback={fallback}>
        <CertificateDecoder />
      </Suspense>
    ),
  },
  {
    path: "/security-tools/cors-tester",
    element: (
      <Suspense fallback={fallback}>
        <CorsTester />
      </Suspense>
    ),
  },
  {
    path: "/security-tools/csp-generator",
    element: (
      <Suspense fallback={fallback}>
        <CspGenerator />
      </Suspense>
    ),
  },
  {
    path: "/security-tools/security-headers-checker",
    element: (
      <Suspense fallback={fallback}>
        <SecurityHeadersChecker />
      </Suspense>
    ),
  },
  {
    path: "/security-tools/dns-lookup",
    element: (
      <Suspense fallback={fallback}>
        <DnsLookup />
      </Suspense>
    ),
  },
  {
    path: "/security-tools/whois-lookup",
    element: (
      <Suspense fallback={fallback}>
        <WhoisLookup />
      </Suspense>
    ),
  },
  {
    path: "/security-tools/spf-checker",
    element: (
      <Suspense fallback={fallback}>
        <SpfChecker />
      </Suspense>
    ),
  },
  {
    path: "/security-tools/dkim-checker",
    element: (
      <Suspense fallback={fallback}>
        <DkimChecker />
      </Suspense>
    ),
  },
  {
    path: "/security-tools/dmarc-checker",
    element: (
      <Suspense fallback={fallback}>
        <DmarcChecker />
      </Suspense>
    ),
  },
  {
    path: "/http-tools/http-status-checker",
    element: (
      <Suspense fallback={fallback}>
        <HttpStatusChecker />
      </Suspense>
    ),
  },
  {
    path: "/http-tools/redirect-checker",
    element: (
      <Suspense fallback={fallback}>
        <RedirectChecker />
      </Suspense>
    ),
  },
  {
    path: "/http-tools/url-parser",
    element: (
      <Suspense fallback={fallback}>
        <UrlParser />
      </Suspense>
    ),
  },
  {
    path: "/http-tools/url-inspector",
    element: (
      <Suspense fallback={fallback}>
        <UrlInspector />
      </Suspense>
    ),
  },
  {
    path: "/ai-dev-tools/sql-generator",
    element: (
      <Suspense fallback={fallback}>
        <SqlGeneratorAi />
      </Suspense>
    ),
  },
  {
    path: "/ai-dev-tools/api-generator",
    element: (
      <Suspense fallback={fallback}>
        <ApiGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-dev-tools/commit-message-generator",
    element: (
      <Suspense fallback={fallback}>
        <CommitMessageGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-dev-tools/readme-generator",
    element: (
      <Suspense fallback={fallback}>
        <ReadmeGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-dev-tools/dockerfile-generator",
    element: (
      <Suspense fallback={fallback}>
        <DockerfileGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-dev-tools/gitignore-generator",
    element: (
      <Suspense fallback={fallback}>
        <GitignoreGenerator />
      </Suspense>
    ),
  },
  {
    path: "/ai-dev-tools/env-template-generator",
    element: (
      <Suspense fallback={fallback}>
        <EnvTemplateGenerator />
      </Suspense>
    ),
  },
  {
    path: "/text-tools/character-counter",
    element: (
      <Suspense fallback={fallback}>
        <CharacterCounter />
      </Suspense>
    ),
  },
  {
    path: "/text-tools/remove-empty-lines",
    element: (
      <Suspense fallback={fallback}>
        <RemoveEmptyLines />
      </Suspense>
    ),
  },
  {
    path: "/text-tools/case-converter",
    element: (
      <Suspense fallback={fallback}>
        <CaseConverter />
      </Suspense>
    ),
  },
  {
    path: "/text-tools/slug-generator",
    element: (
      <Suspense fallback={fallback}>
        <SlugGenerator />
      </Suspense>
    ),
  },
  {
    path: "/text-tools/random-string-generator",
    element: (
      <Suspense fallback={fallback}>
        <RandomStringGenerator />
      </Suspense>
    ),
  },
  {
    path: "/seo-tools/open-graph-generator",
    element: (
      <Suspense fallback={fallback}>
        <OpenGraphGenerator />
      </Suspense>
    ),
  },
  {
    path: "/seo-tools/canonical-url-generator",
    element: (
      <Suspense fallback={fallback}>
        <CanonicalUrlGenerator />
      </Suspense>
    ),
  },
  {
    path: "/seo-tools/keyword-density-checker",
    element: (
      <Suspense fallback={fallback}>
        <KeywordDensityChecker />
      </Suspense>
    ),
  },
  {
    path: "/seo-tools/hreflang-generator",
    element: (
      <Suspense fallback={fallback}>
        <HreflangGenerator />
      </Suspense>
    ),
  },
  {
    path: "/business-tools/epf-checker",
    element: (
      <Suspense fallback={fallback}>
        <EpfChecker />
      </Suspense>
    ),
  },



  {
    path: "/trending-tools/pin-code-post-office-finder",
    element: (
      <Suspense fallback={fallback}>
        <PinCodePostOfficeFinder />
      </Suspense>
    ),
  },
  {
    path: "/calculators/toll-calculator-india",
    element: (
      <Suspense fallback={fallback}>
        <TollCalculatorIndia />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/government-scheme-finder",
    element: (
      <Suspense fallback={fallback}>
        <GovernmentSchemeFinder />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/job-notification-tracker",
    element: (
      <Suspense fallback={fallback}>
        <JobNotificationTracker />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/scholarship-finder",
    element: (
      <Suspense fallback={fallback}>
        <ScholarshipFinder />
      </Suspense>
    ),
  },
  {
    path: "/calculators/electricity-bill-calculator",
    element: (
      <Suspense fallback={fallback}>
        <ElectricityBillCalculator />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/weather",
    element: (
      <Suspense fallback={fallback}>
        <WeatherTool />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/aqi-checker",
    element: (
      <Suspense fallback={fallback}>
        <AqiChecker />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/government-holidays",
    element: (
      <Suspense fallback={fallback}>
        <GovernmentHolidays />
      </Suspense>
    ),
  },
  {
    path: "/trending-tools/festival-calendar",
    element: (
      <Suspense fallback={fallback}>
        <FestivalCalendar />
      </Suspense>
    ),
  },
  {
    path: "/developer-tools/llm-readiness-checker",
    element: (
      <Suspense fallback={fallback}>
        <LlmReadinessChecker />
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
  { path: "/pdf-tools/pdf-converter", element: <Suspense fallback={fallback}><PdfTools /></Suspense> },
  { path: "/pdf-tools/pdf-to-word", element: <Navigate to="/pdf-tools/pdf-converter" replace /> },
  { path: "/pdf-tools/merge-pdf", element: <Navigate to="/pdf-tools/pdf-merger" replace /> },
  { path: "/pdf-tools/split-pdf", element: <Navigate to="/pdf-tools/pdf-splitter" replace /> },
  { path: "/pdf-tools/pdf-to-docx", element: <Suspense fallback={fallback}><PdfToDocxPage /></Suspense> },
  { path: "/pdf-tools/pdf-to-jpg", element: <Suspense fallback={fallback}><PdfToJpgPage /></Suspense> },
  { path: "/pdf-tools/jpg-to-pdf", element: <Suspense fallback={fallback}><JpgToPdfPage /></Suspense> },
  { path: "/pdf-tools/compress-pdf", element: <Suspense fallback={fallback}><CompressPdfPage /></Suspense> },
  { path: "/pdf-tools/rotate-pdf", element: <Suspense fallback={fallback}><RotatePdfPage /></Suspense> },
  { path: "/pdf-tools/extract-pdf-pages", element: <Suspense fallback={fallback}><ExtractPdfPagesPage /></Suspense> },
  { path: "/pdf-tools/protect-unlock-pdf", element: <Suspense fallback={fallback}><ProtectUnlockPdfPage /></Suspense> },
  { path: "/pdf-tools/pdf-translator", element: <Navigate to="/pdf-tools/pdf-converter" replace /> },
  { path: "/pdf-tools/pdf-editor", element: <Suspense fallback={fallback}><PdfEditorPage /></Suspense> },
  { path: "/pdf-tools/pdf-to-hindi", element: <Suspense fallback={fallback}><PdfToHindi /></Suspense> },
  { path: "/pdf-tools/pdf-to-telugu", element: <Suspense fallback={fallback}><PdfToTelugu /></Suspense> },
  { path: "/pdf-tools/pdf-to-english", element: <Suspense fallback={fallback}><PdfToEnglish /></Suspense> },
  { path: "/pdf-tools/pdf-splitter", element: <Suspense fallback={fallback}><PdfSplitter /></Suspense> },
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
  // Programmatic SEO landings (must stay above the catch-all)
  variantRoute("/image-tools/image-format-converter"),
  variantRoute("/image-tools/image-compressor"),
  variantRoute("/image-tools/image-to-base64"),
  variantRoute("/encoding-tools/base64-decode"),
  variantRoute("/encoding-tools/base64-encode"),
  variantRoute("/trending-tools/unit-converter"),
  variantRoute("/banking-tools/simple-interest-calculator"),
  variantRoute("/banking-tools/compound-interest-calculator"),
  variantRoute("/calculators/emi-calculator"),
  variantRoute("/calculators/bmi-calculator"),
  variantRoute("/calculators/sip-calculator"),
  variantRoute("/calculators/inflation-calculator"),
  variantRoute("/calculators/loan-eligibility-calculator"),
  variantRoute("/business-tools/gst-calculator"),
  {
    path: "*",
    element: (
      <Suspense fallback={fallback}>
        <NotFoundPage />
      </Suspense>
    ),
  },
];