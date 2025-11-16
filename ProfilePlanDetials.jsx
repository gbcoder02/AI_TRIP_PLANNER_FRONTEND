import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import TravelPlanDisplay from "../components/TravelPlanDisplay";
import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiInfo,
  FiAlertCircle,
} from "react-icons/fi";

const ProfilePlanDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlan = async () => {
    try {
      const docRef = doc(db, "travelPlans", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPlan(docSnap.data());
      } else {
        setError("Plan not found");
      }
    } catch (error) {
      console.error("Error fetching plan details:", error);
      setError("Failed to load plan details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!location.state?.plan) {
      fetchPlan();
    } else {
      setPlan(location.state.plan);
      setLoading(false);
    }
  }, [id, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md bg-white rounded-xl shadow-md p-6 text-center">
          <FiAlertCircle className="mx-auto text-red-500 text-4xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Plan Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The requested travel plan doesn't exist."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Profile
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Travel Plan Details
          </h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        {/* Plan Overview Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-2">
                <FiMapPin className="text-indigo-500 mr-2" />
                {plan.destination || "Unnamed Destination"}
              </h2>
              <p className="text-gray-600 flex items-center">
                <FiCalendar className="mr-2" />
                {plan.days || "0"} day{plan.days !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                Active Plan
              </span>
            </div>
          </div>
        </div>

        {/* Plan Details Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-6">
            <FiInfo className="text-indigo-500 mr-2 text-xl" />
            <h3 className="text-xl font-semibold text-gray-800">
              Itinerary Details
            </h3>
          </div>

          {plan.plan ? (
            <TravelPlanDisplay data={plan.plan} />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No detailed itinerary available for this plan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePlanDetails;
