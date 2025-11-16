import React from "react";
import {
  FaMapMarkedAlt,
  FaRobot,
  FaHotel,
  FaPrint,
  FaBookmark,
} from "react-icons/fa";

// List of feature objects with icon, title, and description
const features = [
  {
    icon: <FaRobot size={24} className="text-indigo-600" />,
    title: "AI Travel Plan Generator",
    description:
      "Automatically generate detailed travel plans based on destination, group type, and budget.",
  },
  {
    icon: <FaHotel size={24} className="text-indigo-600" />,
    title: "Top Hotel Suggestions",
    description:
      "Smart recommendations for hotels with price, ratings, and map links.",
  },
  {
    icon: <FaMapMarkedAlt size={24} className="text-indigo-600" />,
    title: "Interactive Itinerary",
    description:
      "View your travel stops on an interactive map with real-time routing.",
  },
  {
    icon: <FaBookmark size={24} className="text-indigo-600" />,
    title: "Save Your Plan",
    description: "Easily save your travel plan for later reference or editing.",
  },
  {
    icon: <FaPrint size={24} className="text-indigo-600" />,
    title: "Print Full Itinerary",
    description:
      "Export or print your itinerary in a clean format for offline use.",
  },
];

// Single feature card component
const FeatureCard = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4 p-5 bg-white rounded-xl shadow hover:shadow-md transition duration-300">
    {/* Icon with background */}
    <div className="p-2 bg-indigo-100 rounded-full shrink-0">{icon}</div>

    {/* Textual content */}
    <div>
      <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  </div>
);

// Feature section layout with grid
const FeatureSection = () => (
  <div className="px-4 max-w-6xl mx-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((f, idx) => (
        <FeatureCard
          key={idx}
          icon={f.icon}
          title={f.title}
          description={f.description}
        />
      ))}
    </div>
  </div>
);

export default FeatureSection;
