@echo off
rem Windows Task Scheduler entry: daily Search Console indexing check. Read-only: writes CSV reports to
rem automation\reports\indexing\ and never changes the website or submits anything.
cd /d "%~dp0.."
if not exist automation\state mkdir automation\state
echo ==== %date% %time% >> automation\state\index-monitor.log
node scripts\automation\gsc-index-monitor.mjs >> automation\state\index-monitor.log 2>&1
