import { useEffect, useState } from "react";
import axios from "axios";
import TravelPlanDisplay from "./TravelPlanDisplay";

import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";

const TravelForm = () => {
  // Form input states
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [groupType, setGroupType] = useState("");
  const [budgetType, setBudgetType] = useState("");

  // State to store response and loader flags
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // AI prompt for travel plan
    const prompt = `Give a ${days}-day travel plan for a ${groupType} visiting ${destination} on a ${budgetType} budget. 
Return only raw JSON data without any code block or explanation.

Use this structure:
1. "hotels": [{ name, addr, price, img, coords, rating }]
2. "itinerary": [{ day, places: [{ name, desc (≤30 words), img, coords, ticket, rating, travel_time, best_time (≤30 words) }] }]

Use brief field names and keep content concise.`;

    try {
      setLoading(true); // Start loading
      const res = await axios.post("http://localhost:5000/api/content", {
        question: prompt,
      });

      const result = res.data.result;
      let travelData;

      // Parse different possible response structures
      if (typeof result === "string") {
        try {
          const parsed = JSON.parse(result);
          travelData = parsed.hotels && parsed.itinerary ? parsed : null;
        } catch (e) {
          console.error("Failed to parse JSON string:", result);
        }
      } else if (result.hotels && result.itinerary) {
        travelData = result;
      } else if (result.response && typeof result.response === "string") {
        try {
          const parsed = JSON.parse(result.response);
          travelData = parsed.hotels && parsed.itinerary ? parsed : null;
        } catch (e) {
          console.error("Failed to parse result.response:", result.response);
        }
      }

      // If no valid data, show error
      if (
        !travelData ||
        !Array.isArray(travelData.hotels) ||
        !Array.isArray(travelData.itinerary)
      ) {
        throw new Error("Parsed travel plan is missing required fields.");
      }

      // Ensure ratings are numbers
      const cleanRating = (val) => {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? 0 : parsed;
      };

      // Clean hotel and itinerary data
      const cleanHotels = travelData.hotels.map((h) => ({
        ...h,
        rating: cleanRating(h.rating),
      }));

      const cleanItinerary = travelData.itinerary.map((day) => ({
        day: day.day,
        places: day.places.map((p) => ({
          ...p,
          rating: cleanRating(p.rating),
        })),
      }));

      // Set final cleaned data
      setResponse({ hotels: cleanHotels, itinerary: cleanItinerary });
      // console.log("✅ Final Parsed Data:", {
      //   hotels: cleanHotels,
      //   itinerary: cleanItinerary,
      // });
    } catch (error) {
      console.error("❌ Error generating/saving travel plan:", error);
      setResponse("Error generating or saving content. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Save plan to Firestore
  const handleSavePlan = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("Please log in to save your travel plan.");
      return;
    }

    try {
      setSaving(true);
      const docRef = await addDoc(collection(db, "travelPlans"), {
        uid: user.uid,
        destination,
        days,
        groupType,
        budgetType,
        createdAt: new Date(),
        plan: response,
      });
      toast.success("✅ Travel plan saved successfully!");
      // console.log("Saved with ID: ", docRef.id);
    } catch (err) {
      console.error("Error saving travel plan:", err);
      toast.error("❌ Failed to save travel plan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Travel Plan Form */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          ✈️ Travel Plan Generator
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Destination input */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="e.g., Paris, Tokyo, Goa"
            />
          </div>

          {/* Number of days input */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Days of Travel
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="e.g., 5"
            />
          </div>

          {/* Group type selection */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Travel Group Type
            </label>
            <select
              value={groupType}
              onChange={(e) => setGroupType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">-- Select --</option>
              <option value="couple">Couple</option>
              <option value="family">Family</option>
              <option value="solo">Solo</option>
              <option value="friends">Friends</option>
            </select>
          </div>

          {/* Budget selection */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Budget Type
            </label>
            <select
              value={budgetType}
              onChange={(e) => setBudgetType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">-- Select --</option>
              <option value="budget">Low</option>
              <option value="moderate">Moderate</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {loading ? "Generating..." : "🚀 Generate Plan"}
          </button>
        </form>
      </div>

      {/* Travel Plan Display */}
      <div className="mt-10">
        {loading ? (
          <div className="text-center text-blue-600 font-medium text-lg">
            Generating travel plan...
          </div>
        ) : typeof response === "object" ? (
          <div className="bg-white border rounded-xl shadow-sm p-4">
            {/* Show travel plan data */}
            <TravelPlanDisplay data={response} />

            {/* Save button */}
            {response && typeof response === "object" && (
              <div className="mt-6 text-right">
                <button
                  onClick={handleSavePlan}
                  className={`bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 ${
                    saving ? "opacity-70 cursor-not-allowed animate-pulse" : ""
                  }`}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "💾 Save Plan"}
                </button>
              </div>
            )}
          </div>
        ) : response ? (
          <p className="text-red-500 font-semibold mt-4">{response}</p>
        ) : null}
      </div>
    </div>
  );
};

export default TravelForm;
