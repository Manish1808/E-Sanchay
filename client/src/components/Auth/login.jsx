import React, { useState, useContext, use } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext.jsx';
const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    mobile: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
        setIsLoading(true);  // Show loader when login starts

        try {
            let response;
            response = await axios.post(`http://localhost:8000/api/v1/auth/login`, userData);
            const user = response.data.data;
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
            toast.success("Login Successful");
            navigate('/');
        } catch (error) {
            toast.error("Invalid Credentials. Try Again");
        } finally {
            setIsLoading(false);  // Hide loader after login
        }
  };
  return (
    <>
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-xs bg-white shadow-md rounded-lg px-8 pt-6 pb-8">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
          <form>
            {/* Username */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Mobile
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                name="mobile"
                value={userData.mobile}
                onChange={handleChange}
                type="text"
                placeholder="Enter your username"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                type="password"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
                onClick={handleLogin}
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Forgot Password */}
          <p className="text-center text-gray-600 text-sm mt-4">
            <a href="#" className="text-blue-500 hover:text-blue-700 font-bold">
              Forgot Password?
            </a>
          </p>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 text-sm mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:text-blue-700 font-bold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
