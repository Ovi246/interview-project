import axios from "axios";

export async function POST(req, res) {
  const { topic, pages, user_id } = await req.json();
  try {
    const response = await axios.post("http://backend:8000/generate", {
      user_id,
      topic,
      pages,
    });
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate content" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
