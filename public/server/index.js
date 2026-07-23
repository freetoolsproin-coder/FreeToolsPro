const express = require("express");
const cors = require("cors");
const { getInstagramVideo } = require("./scraper");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/download", async (req, res) => {
  const { url } = req.body;

  try {
    const videoUrl = await getInstagramVideo(url);
    res.json({ videoUrl });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch video" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
