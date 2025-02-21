import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { createBrowserRouter, RouterProvider, Route, Outlet } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext.jsx';
import "./assets/loader.css";
import Navbar from './components/Navbar/navbar.jsx';
import Signup from "./components/Auth/signup.jsx";
import Login from "./components/Auth/login.jsx";
import AuthWrapper from './components/Auth/AuthWrapper.jsx';  
import Home from './pages/Home.jsx';
import Learn from './pages/learn.jsx';
import Sanchayagent from './pages/sanchayagent.jsx';
import Sandehbot from './pages/sandehbot.jsx';
import Smartinvest from './pages/smartinvest.jsx';
import Assessment from './pages/assessment.jsx';
import Financialbacker from "./pages/financialbacker.jsx";
import Rewards from './pages/rewards.jsx';
import Goal from "./pages/goal.jsx";
const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: (
      <AuthWrapper>
        <AppLayout />
      </AuthWrapper>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/learn",
        element: <Learn />,
      },
      {
        path: "/sanchayagent",
        element: <Sanchayagent />,
      },
      {
        path: "/sandehbot",
        element: <Sandehbot />,
      },
      {
        path: "/smartinvest",
        element: <Smartinvest />,
      },
      {
        path: "/assessment",
        element: <Assessment />,
      },
      {
        path: "/financialbacker",
        element: <Financialbacker />,
      },
      {
        path:"/rewards",
        element: <Rewards />
      },
      {
        path:"/goal",
        element: <Goal />
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer 
        position="bottom-right" // Change position
        autoClose={2000} // Set duration (in milliseconds)
        hideProgressBar={false} // Show/hide progress bar
        newestOnTop={true} // Show newest toast on top
        closeOnClick // Close on click
        pauseOnHover // Pause on hover
      />
    </AuthProvider>
  );
}

export default App;
