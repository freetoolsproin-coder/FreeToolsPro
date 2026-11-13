@echo off
rem Windows Task Scheduler entry: weekly traffic/keyword opportunities (Search Console) and Core Web Vitals
rem (PageSpeed Insights), then refreshes automation\reports\seo-health-latest.html. Log: automation\state\weekly.log
cd /d "%~dp0.."
if not exist automation\state mkdir automation\state
echo ==== %date% %time% >> automation\state\weekly.log
node scripts\automation\gsc-performance.mjs >> automation\state\weekly.log 2>&1
node scripts\automation\cwv-monitor.mjs >> automation\state\weekly.log 2>&1
node scripts\automation\seo-report.mjs >> automation\state\weekly.log 2>&1
