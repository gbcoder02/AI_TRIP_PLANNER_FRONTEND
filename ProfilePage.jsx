import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FiArrowLeft, FiMapPin, FiCalendar, FiEye } from "react-icons/fi";

// Profile page component
const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, email, photoURL } = location.state || {};

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPlans = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "travelPlans"),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);

      const fetchedPlans = [];
      querySnapshot.forEach((doc) => {
        fetchedPlans.push({ id: doc.id, ...doc.data() });
      });

      setPlans(fetchedPlans);
    } catch (error) {
      console.error("Failed to fetch travel plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <button
            onClick={() => navigate("/main")}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors text-sm font-medium"
          >
            <FiArrowLeft className="mr-2" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Your Profile
          </h1>
          <div className="w-6 md:w-8" />
        </div>

        {/* User Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <img
            src={photoURL || "https://avatar.iran.liara.run/public"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 shadow"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-gray-800 truncate">
              {name || "User"}
            </h2>
            <p className="text-gray-600 break-words">
              {email || "No email provided"}
            </p>
          </div>
        </div>

        {/* Travel Plans */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <FiMapPin className="mr-2 text-indigo-600" />
            Your Travel Plans
          </h3>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                You haven’t created any travel plans yet.
              </p>
              <button
                onClick={() => navigate("/main")}
                className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Create Your First Plan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-2">
                    <FiMapPin className="text-indigo-500 mr-2" />
                    <h4 className="font-medium text-gray-800">
                      {plan.destination || "Unnamed Destination"}
                    </h4>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <FiCalendar className="mr-2" />
                    <span>{plan.days || "0"} days</span>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/plan/${plan.id}`, { state: { plan } })
                    }
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors text-sm font-medium"
                  >
                    <FiEye className="mr-1" />
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
