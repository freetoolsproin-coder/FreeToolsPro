export async function POST(req) {
  const { bmi, calories } = await req.json();

  let tips = [];

  if (bmi > 25) tips.push("Reduce sugar & increase daily steps.");
  if (calories < 1800) tips.push("Increase protein intake.");

  return new Response(JSON.stringify({ tips }), {
    headers: { "Content-Type": "application/json" },
  });
}
