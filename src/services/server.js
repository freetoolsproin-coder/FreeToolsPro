const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/check-plagiarism", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios.post(
      "https://api.copyleaks.com/v3/scans/submit",
      { text },
      {
        headers: {
          Authorization: "Bearer YOUR_API_KEY",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "API error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
