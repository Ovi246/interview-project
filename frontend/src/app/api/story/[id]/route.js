import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const storyId = params.id;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!storyId || !userId) {
      return NextResponse.json(
        { error: "Story ID and User ID are required" },
        { status: 400 }
      );
    }

    console.log("storyId", storyId);
    console.log("userId", userId);

    const response = await axios.get(`http://backend:8000/story/${storyId}`, {
      params: { userId },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching story:", error);
    return NextResponse.json(
      { error: "Failed to fetch story" },
      { status: 500 }
    );
  }
}
