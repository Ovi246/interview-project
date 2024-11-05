"use client";
import { useState } from "react";
import { useAuth, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const features = [
    {
      title: "60-Second Story Generation",
      description: "Create unique stories in just a minute!",
    },
    {
      title: "AI-Powered Illustrations",
      description: "Bring your stories to life with AI-generated images",
    },
    {
      title: "Interactive Book Interface",
      description: "Read your stories in a beautiful, interactive book format",
    },
  ];

  const packages = [
    { name: "Free Trial", price: "Free", stories: 3, duration: "per day" },
    { name: "Standard", price: "$9.99", stories: 30, duration: "per month" },
    {
      name: "Premium",
      price: "$19.99",
      stories: "Unlimited",
      duration: "per month",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">StoryMagic</h1>
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <SignUpButton mode="modal">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Sign Up
              </button>
            </SignUpButton>
          )}
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <motion.h2
            className="text-5xl font-bold mb-4 text-gray-800"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Create Magical Stories in Seconds
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Unleash your imagination with AI-powered storytelling and
            illustrations
          </motion.p>
          <SignUpButton mode="modal">
            <motion.button
              className="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try for Free
            </motion.button>
          </SignUpButton>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Features
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h4 className="text-xl font-semibold mb-2 text-blue-600">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Pricing
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h4 className="text-2xl font-semibold mb-2 text-blue-600">
                  {pkg.name}
                </h4>
                <p className="text-4xl font-bold mb-4">{pkg.price}</p>
                <p className="text-gray-600 mb-4">
                  {pkg.stories} stories {pkg.duration}
                </p>
                {pkg.name === "Free Trial" ? (
                  <SignUpButton mode="modal">
                    <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
                      Start Free Trial
                    </button>
                  </SignUpButton>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                    onClick={() => setShowModal(true)}
                  >
                    Choose Plan
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Coming Soon!</h3>
            <p className="mb-4">
              Paid plans will be available soon. For now, enjoy our free trial!
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
