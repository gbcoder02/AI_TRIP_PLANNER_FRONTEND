import React from "react";
import { useNavigate } from "react-router-dom";
import FeatureSection from "./FeatureSection";

const LandinPage = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans bg-gradient-to-r from-blue-50 to-indigo-100 text-gray-800 min-h-screen">
      {/* Header */}
      <header className="px-4 sm:px-6 py-4 flex justify-between items-center shadow bg-white">
        <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">
          AI-Trip Planner
        </h1>
        <nav className="space-x-2 sm:space-x-4 text-sm sm:text-base font-medium">
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:text-indigo-800 transition"
          >
            Let's Start
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-4 sm:px-8 lg:px-10 py-14 sm:py-20 max-w-7xl mx-auto">
        <div className="w-full max-w-xl text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Plan Your Perfect Trip
            <br />
            with <span className="text-indigo-600">AI Assistance</span>
          </h2>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">
            Get personalized travel plans in seconds. Just tell us your dream
            destination — AITripGenie handles the rest.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Start Planning
          </button>
        </div>

        <div className="w-full max-w-md mb-10 lg:mb-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
            alt="Trip planning"
            className="w-full rounded-xl shadow-xl"
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-white">
        <div className="text-center mb-12 px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-indigo-700">
            Why Use AI-Trip Planner ?
          </h3>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Smart, Fast, and Personalized Planning
          </p>
        </div>
        <FeatureSection />
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-white py-6 border-t mt-10">
        <div className="max-w-6xl mx-auto flex justify-center px-4">
          <p className="text-sm text-gray-600 text-center">
            &copy; {new Date().getFullYear()} AI-Trip Planner. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandinPage;
