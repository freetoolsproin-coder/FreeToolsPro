export const fetchVideo = async (url) => {
  const res = await fetch("http://localhost:5000/api/download", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch video");
  }

  return res.json();
};
