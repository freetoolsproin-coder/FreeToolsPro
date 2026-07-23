const axios = require("axios");

async function getInstagramVideo(url) {
  try {
    const response = await axios.get(
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
    );

    const html = response.data.contents;

    const match = html.match(/"video_url":"([^"]+)"/);

    if (match && match[1]) {
      return match[1].replace(/\\u0026/g, "&");
    }

    throw new Error("Video not found");
  } catch (err) {
    throw err;
  }
}

module.exports = { getInstagramVideo };
