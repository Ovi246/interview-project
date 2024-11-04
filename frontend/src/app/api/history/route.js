import axios from "axios";

export async function GET(req, res) {
  try {
    const response = await axios.get("http://backend:8000/history");
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch history" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
