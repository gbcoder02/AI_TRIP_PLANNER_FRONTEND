import React, { useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";

// Main Login component
const Login = () => {
  // State to toggle between login and register
  const [isRegistering, setIsRegistering] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Handle Google sign-in
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Google login successful!");
      navigate("/main"); // Redirect after login
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle registration with email/password
  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Choose avatar based on gender
      let photoURL = "";
      if (gender === "male") {
        photoURL = "https://avatar.iran.liara.run/public/boy";
      } else if (gender === "female") {
        photoURL = "https://avatar.iran.liara.run/public/girl";
      } else {
        photoURL = "https://avatar.iran.liara.run/public"; // fallback/default
      }

      // Set name and photoURL
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL,
      });

      toast.success("User registered successfully!");
      navigate("/main");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle login with email/password
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      navigate("/main");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 px-4 sm:px-6 lg:px-8">
      {/* Card container */}
      <div className="max-w-md w-full space-y-8 bg-white shadow-2xl rounded-2xl p-8 sm:p-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-600 drop-shadow">
            AI - Trip Planner
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {isRegistering ? "Create a new account" : "Sign in to your account"}
          </p>
        </div>

        {/* Form inputs */}
        <form className="space-y-4">
          {isRegistering && (
            <>
              {/* Name input */}
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* Gender selection */}
              <select
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </>
          )}

          {/* Email input */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password input */}
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Conditional Register or Login button */}
          {isRegistering ? (
            <>
              <button
                type="button"
                onClick={handleRegister}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Register
              </button>
              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <span
                  onClick={() => setIsRegistering(false)}
                  className="text-indigo-600 cursor-pointer font-semibold"
                >
                  Login
                </span>
              </p>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleLogin}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Login
              </button>
              <p className="text-sm text-center text-gray-600">
                New here?{" "}
                <span
                  onClick={() => setIsRegistering(true)}
                  className="text-green-600 cursor-pointer font-semibold"
                >
                  Register
                </span>
              </p>
            </>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="text-gray-500 text-sm">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* Google login button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <FcGoogle className="text-2xl" />
            <span className="font-medium text-gray-700">
              Continue with Google
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
