import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { FaUserCircle } from "react-icons/fa";

// ProfileIcon component displays user icon with a dropdown menu
const ProfileIcon = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to control dropdown visibility
  const dropdownRef = useRef(); // Ref to detect outside clicks
  const navigate = useNavigate();
  const auth = getAuth(); // Get Firebase Auth instance
  const user = auth.currentUser; // Get current logged-in user

  // Toggle dropdown open/close
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Log the user out and navigate to login page
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to home/login
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Navigate to profile page with user data
  const handleProfileClick = () => {
    if (user) {
      navigate("/profile", {
        state: {
          name: user.displayName || "Guest",
          email: user.email,
          uid: user.uid,
          photoURL: auth.currentUser.photoURL,
        },
      });
      setDropdownOpen(false);
    } else {
      alert("Please log in to access your profile.");
    }
  };

  // Close dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile icon button */}
      <button
        onClick={toggleDropdown}
        title="Account"
        className="text-gray-700 hover:text-blue-600"
      >
        <FaUserCircle size={30} />
      </button>

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
          <button
            onClick={handleProfileClick}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
