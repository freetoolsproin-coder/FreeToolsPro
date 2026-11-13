@echo off
rem Windows Task Scheduler entry: posts the next tool to Instagram and logs the result.
cd /d "%~dp0.."
if not exist automation\state mkdir automation\state
echo ==== %date% %time% >> automation\state\ig-post.log
node scripts\automation\ig-post.mjs >> automation\state\ig-post.log 2>&1
