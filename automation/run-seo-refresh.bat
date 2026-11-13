@echo off
rem Windows Task Scheduler entry: monthly SEO refresh. Writes a report to automation\reports\ and
rem changes nothing on the site. Add --apply after seo-refresh.mjs once you trust the proposals.
cd /d "%~dp0.."
if not exist automation\state mkdir automation\state
echo ==== %date% %time% >> automation\state\seo-refresh.log
node scripts\automation\seo-refresh.mjs >> automation\state\seo-refresh.log 2>&1
