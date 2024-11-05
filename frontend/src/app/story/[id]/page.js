"use client";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import BookComponent from "@/components/BookComponent";

const StoryPage = () => {
  const { isLoaded, userId, getToken } = useAuth();
  const params = useParams();
  const [story, setStory] = useState(null);
  const [bookPages, setBookPages] = useState([]);

  useEffect(() => {
    if (isLoaded && userId && params.id) {
      fetchStory();
    }
  }, [isLoaded, userId, params.id]);

  const fetchStory = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`/api/story/${params.id}`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setStory(response.data);
      createBookPages(response.data);
    } catch (error) {
      console.error("Error fetching story:", error);
    }
  };

  const createBookPages = (storyData) => {
    const newPages = [{ type: "cover", content: storyData.topic }];
    storyData.pages.forEach((page, index) => {
      newPages.push({
        type: "text",
        content: page.content,
        number: index * 2 + 2,
      });
      newPages.push({
        type: "image",
        content: page.image,
        number: index * 2 + 3,
      });
    });
    setBookPages(newPages);
  };

  if (!isLoaded || !userId || !story) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">{story.topic}</h1>
        <BookComponent bookPages={bookPages} />
      </div>
    </div>
  );
};

export default StoryPage;
