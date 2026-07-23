import axios from "axios";

// Step 1: Use an alternate port 5001 or 8080 if your OS is hijacking port 5000 (Very common in macOS/Windows)
const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
});

export const generateBio = async (data) => {
  try {
    // Attempt 1: The standard route structure
    console.log(`🚀 Primary Target Attempt: ${BASE_URL}/api/generate-bio`);
    const res = await api.post("/api/generate-bio", data);
    return res.data;
  } catch (err) {
    // If the error is a 404, let's dynamically run a diagnostic backup request automatically
    if (err.response && err.response.status === 404) {
      console.warn(
        "⚠️ Route '/api/generate-bio' 404ed. Attempting structural bypass without '/api' prefix..."
      );

      try {
        // Attempt 2: Bypassing the /api sub-route directly to the base url root endpoint
        const fallbackRes = await axios.post(`${BASE_URL}/generate-bio`, data);
        console.log(
          "✅ Diagnostic Bypass Success! Your backend is missing the '/api' prefix path mapping."
        );
        return fallbackRes.data;
      } catch (fallbackErr) {
        console.error("❌ Both endpoint paths structural routing patterns returned 404.");
      }
    }

    // Comprehensive error categorization for dev console log windows
    if (err.response) {
      console.error(
        `🚨 System Triage -> Server Active but rejected with status: ${err.response.status}`
      );
    } else if (err.request) {
      console.error(
        "🚨 System Triage -> Port Ghosting. The port is open but no software app listener is bound here."
      );
    }

    throw err;
  }
};
