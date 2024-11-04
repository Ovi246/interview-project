"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [content, setContent] = useState("");
  const [history, setHistory] = useState([]);

  const fetchContent = async () => {
    try {
      const response = await axios.post("/api/generate-content");
      setContent(response.data.content);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get("/api/history");
      setHistory(response.data.history);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div>
      <button onClick={fetchContent}>Refresh Content</button>
      <div>{content}</div>
      <div>
        <h3>History</h3>
        {history.map((item, index) => (
          <div key={index}>
            {item.content} - {new Date(item.timestamp).toLocaleString()}
          </div>
        ))}
      </div>
    </div>
  );
}
