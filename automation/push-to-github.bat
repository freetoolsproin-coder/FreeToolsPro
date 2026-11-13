@echo off
rem Pushes this project to GitHub as the branch "astro-redesign" of freetoolsproin-coder/FreeToolsPro,
rem with the SEO workflows enabled. main (the old site) is not touched. Safe to run again later:
rem it just commits and pushes whatever changed.
rem Never committed: .env, automation\state (Google key), node_modules, dist (see .gitignore).
setlocal
cd /d "%~dp0.."
where git >nul 2>nul || (echo Git is not installed. Get it from https://git-scm.com/download/win & exit /b 1)

if not exist .git (
  git init
  git remote add origin https://github.com/freetoolsproin-coder/FreeToolsPro.git
)
git checkout -B astro-redesign

if not exist .github\workflows mkdir .github\workflows
copy /Y automation\github\seo-automation.yml .github\workflows\seo-automation.yml >nul
copy /Y automation\github\deploy.yml .github\workflows\deploy.yml >nul

git add -A
git commit -m "Astro redesign with SEO, indexing and Core Web Vitals automation"
git push -u origin astro-redesign
if errorlevel 1 (
  echo.
  echo Push failed. If Git asked you to sign in, sign in with the freetoolsproin-coder GitHub account and run this again.
  exit /b 1
)
echo.
echo Done: https://github.com/freetoolsproin-coder/FreeToolsPro/tree/astro-redesign
endlocal
