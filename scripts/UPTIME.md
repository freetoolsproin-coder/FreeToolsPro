# Uptime monitor for https://freetoolspro.in
#
# Local one-shot check:
#   npm run uptime:check
#
# Test alerts (email + SMS if configured):
#   npm run uptime:test
#
# Setup
# 1. Copy .env.uptime.example → .env.uptime
# 2. Set ALERT_EMAIL (defaults to support@freetoolspro.in)
# 3. For SMS: create a Twilio account, buy a number, set:
#      ALERT_PHONE=+91xxxxxxxxxx
#      TWILIO_ACCOUNT_SID=...
#      TWILIO_AUTH_TOKEN=...
#      TWILIO_FROM_NUMBER=+1...
# Optional: EmailJS Account → API keys → Private Key → EMAILJS_PRIVATE_KEY
#    (recommended for GitHub Actions)
# 5. EmailJS dashboard → Account → Security → enable
#    "Allow EmailJS API for non-browser applications"
#    (required for Node / GitHub Actions)
#
# GitHub Actions
# - Push the workflow at .github/workflows/uptime.yml
# - Repo → Settings → Secrets and variables → Actions
#   Add: ALERT_EMAIL, ALERT_PHONE, EMAILJS_*, TWILIO_*
# - Schedule runs every 10 minutes; alerts only on down/recovery transitions
#
# Note: SMS cannot be sent without a provider (Twilio). Email works via EmailJS
# after enabling non-browser API access in the EmailJS security settings.
