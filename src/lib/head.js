// Inline <head> scripts, shared by Base.astro and the preview harness.

/** Google Analytics consent defaults, read from the stored choice before analytics loads. */
export const CONSENT_DEFAULTS = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}(function(){var n=false;try{var s=JSON.parse(localStorage.getItem("ftp_cookie_consent")||"null");n=!!(s&&s.analytics)}catch(e){}gtag("consent","default",{analytics_storage:n?"granted":"denied",wait_for_update:500})})();`;
