"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import BookComponent from "@/components/BookComponent";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";

const Dashboard = () => {
  const { isLoaded, userId, getToken } = useAuth();
  const [topic, setTopic] = useState("");
  const [pages, setPages] = useState(1);
  const [story, setStory] = useState(null);
  const [bookPages, setBookPages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyHistory, setStoryHistory] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchStoryHistory();
    }
  }, [userId]);

  const fetchStoryHistory = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`/api/history/`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setStoryHistory(response.data.history);
    } catch (error) {
      console.error("Error fetching story history:", error);
      toast.error("Failed to fetch story history. Please try again.");
    }
  };

  const generateStory = async () => {
    // Input validation
    if (!topic.trim()) {
      toast.error("Please enter a topic before generating a story.");
      return;
    }

    if (pages < 1 || pages > 10) {
      toast.error("Number of pages must be between 1 and 10.");
      return;
    }

    setIsGenerating(true);
    try {
      const token = await getToken();
      const response = await axios.post(
        "/api/generate-content",
        { topic, pages, user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStory(response.data);
      createBookPages(response.data);
      fetchStoryHistory(); // Refresh the history after generating a new story
      toast.success("Story generated successfully!");
    } catch (error) {
      console.error("Error generating story:", error);
      toast.error("Failed to generate story. Please try again.");
    } finally {
      setIsGenerating(false);
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

  if (!isLoaded || !userId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Story Generator</h1>
          <UserButton />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic"
              className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={100} // Limit topic length
            />
            <input
              type="number"
              value={pages}
              onChange={(e) =>
                setPages(
                  Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
                )
              }
              min="1"
              max="10"
              className="w-24 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={generateStory}
              disabled={isGenerating || !topic.trim()}
              className={`px-6 py-2 text-white rounded-md transition-colors flex items-center justify-center ${
                isGenerating || !topic.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isGenerating ? (
                <>
                  <ClipLoader color="#ffffff" size={20} className="mr-2" />
                  Generating...
                </>
              ) : (
                "Generate Story"
              )}
            </button>
          </div>
        </div>
        {bookPages.length > 0 && <BookComponent bookPages={bookPages} />}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Your Story History</h2>
          {storyHistory.length > 0 ? (
            <ul className="space-y-2">
              {storyHistory.map((story) => (
                <li
                  key={story.id}
                  className="flex justify-between items-center"
                >
                  <span>{story.topic}</span>
                  <Link href={`/story/${story.id}`}>
                    <span className="text-blue-500 hover:text-blue-600 cursor-pointer">
                      View Story
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No stories generated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
