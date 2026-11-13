@echo off
rem Windows Task Scheduler entry: daily SEO automation.
rem   1. sitemap-submit   validates the live sitemap; submits it to Search Console + IndexNow only if it changed
rem   2. index monitor    URL Inspection API for every sitemap URL (read-only)
rem   3. seo-audit        technical SEO / AEO audit of the live site (read-only)
rem   4. seo-report       combines everything into automation\reports\seo-health-latest.html
rem Each step runs even if an earlier one fails. Log: automation\state\seo-daily.log
cd /d "%~dp0.."
if not exist automation\state mkdir automation\state
echo ==== %date% %time% >> automation\state\seo-daily.log
node scripts\automation\sitemap-submit.mjs >> automation\state\seo-daily.log 2>&1
node scripts\automation\gsc-index-monitor.mjs >> automation\state\seo-daily.log 2>&1
node scripts\automation\seo-audit.mjs >> automation\state\seo-daily.log 2>&1
node scripts\automation\seo-report.mjs >> automation\state\seo-daily.log 2>&1
