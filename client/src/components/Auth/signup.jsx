import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext.jsx";

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    fullname: "",
    mobile: "+91",
    password: "",
    confirmPassword: "",
    occupation: "",
    income: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  // Function to validate mobile number using Numerify API
  const validateMobileNumber = async (mobile) => {
    try {
      const options = {
        method: "GET",
        url: `https://apilayer.net/api/validate?access_key=${import.meta.env.VITE_NUMERIFY_API}`,
        params: { number: mobile },
      };
      const response = await axios.request(options);
      console.log(response.data);
      if (response.data.valid && response.data.country_code === "IN") {
        return true;
      } else {
        toast.error("Invalid Indian mobile number");
        return false;
      }
    } catch (error) {
      console.log(error);
      toast.error("Error validating mobile number");
      return false;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (userData.password !== userData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate mobile number before proceeding
    const isMobileValid = await validateMobileNumber(userData.mobile);
    if (!isMobileValid) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/register`,
        userData
      );
      const user = response.data.data;
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast.success("Signup Successful");
      navigate("/");
    } catch (error) {
      toast.error("Invalid Credentials. Try Again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg px-8 pt-6 pb-8">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="fullname"
            >
              Full Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="fullname"
              name="fullname"
              value={userData.fullname}
              onChange={handleChange}
              type="text"
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="mobile"
            >
              Mobile Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="mobile"
              name="mobile"
              value={userData.mobile}
              onChange={handleChange}
              type="tel"
              placeholder="Enter your mobile number"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              type="password"
              placeholder="Enter password"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              type="password"
              placeholder="Confirm your password"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="occupation"
            >
              Occupation
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="occupation"
              name="occupation"
              value={userData.occupation}
              onChange={handleChange}
              type="text"
              placeholder="Your occupation"
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="income"
            >
              Income
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="income"
              name="income"
              value={userData.income}
              onChange={handleChange}
              type="number"
              placeholder="Your income"
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-700 font-bold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
