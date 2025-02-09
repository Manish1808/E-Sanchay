import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FinancialBacker = () => {
  const [activeTab, setActiveTab] = useState("loans");
  const [jobListings, setJobListings] = useState([]);
  const [investmentWorkshops, setInvestmentWorkshops] = useState([]);

  const tabs = [
    { id: "loans", label: "Loan Opportunities" },
    { id: "investments", label: "Investment Resources" },
    { id: "jobs", label: "Job Listings" },
    { id: "financialAid", label: "Financial Aid" },
  ];

  const handleRegister = () => {
    toast.success("Link will be sent to SMS 1 day before the event begins.");
  };

  useEffect(() => {
    const fetchJobListings = async () => {
  const jobs = [
    { title: "Food Delivery Partner", description: "Deliver food across Hyderabad for Swiggy/Zomato.", salary: 12000, link: "#" },
    { title: "Retail Store Assistant", description: "Assist customers and manage stock in a retail store.", salary: 10000, link: "#" },
    { title: "Customer Support Executive", description: "Part-time customer service for an e-commerce company.", salary: 14000, link: "#" },
    { title: "Online Tutor", description: "Teach students online in your preferred subject.", salary: 15000, link: "#" },
    { title: "Data Entry Operator", description: "Work-from-home data entry tasks.", salary: 9000, link: "#" },
    { title: "Hotel Receptionist", description: "Part-time receptionist at a city hotel.", salary: 13000, link: "#" },
  ];
  setJobListings(jobs);
};

    const fetchInvestmentWorkshops = async () => {
      const workshops = [
        { title: "Stock Market Mastery", date: "March 15, 2025", description: "Learn stock trading strategies.", registerLink: "#" },
        { title: "Real Estate Investing 101", date: "April 5, 2025", description: "Invest in properties for rental income.", registerLink: "#" },
        { title: "Mutual Funds Explained", date: "April 20, 2025", description: "Understand mutual funds and SIPs.", registerLink: "#" },
        { title: "Crypto & Blockchain", date: "May 10, 2025", description: "Introduction to crypto investments.", registerLink: "#" },
      ].map((workshop) => ({
        ...workshop,
        points: Math.floor(Math.random() * 91) + 10,
      }));

      setInvestmentWorkshops(workshops);
    };

    fetchJobListings();
    fetchInvestmentWorkshops();
  }, []);

  const tabContent = {
    loans: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[ 
          { name: "Women Empowerment Loan", amount: "₹50,000 - ₹5,00,000", provider: "SBI", link: "#" },
          { name: "Student Education Loan", amount: "₹1,00,000 - ₹10,00,000", provider: "HDFC", link: "#" },
          { name: "Startup Business Loan", amount: "₹5,00,000 - ₹50,00,000", provider: "ICICI", link: "#" },
          { name: "Agricultural Loan", amount: "₹50,000 - ₹5,00,000", provider: "PNB", link: "#" }
        ].map((loan, index) => (
          <div key={index} className="p-4 border border-gray-600 rounded-lg bg-gray-700 shadow-md">
            <h4 className="text-blue-400 font-semibold">{loan.name}</h4>
            <p><strong>Amount:</strong> {loan.amount}</p>
            <p><strong>Provider:</strong> {loan.provider}</p>
            <a href={loan.link} className="text-blue-400 underline">Apply Here</a>
          </div>
        ))}
      </div>
    ),
    investments: (
      <ul className="list-disc pl-5">
        {investmentWorkshops.length > 0 ? (
          investmentWorkshops.map((event, index) => (
            <li key={index} className="mb-4 p-4 border border-gray-600 rounded-lg">
              <h4 className="text-blue-400 font-semibold">{event.title}</h4>
              <p><strong>Date:</strong> {event.date}</p>
              <p>{event.description}</p>
              <p><strong>Points:</strong> {event.points}</p>
              <button
                onClick={handleRegister}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
              >
                Register
              </button>
            </li>
          ))
        ) : (
          <p>Loading investment workshops...</p>
        )}
      </ul>
    ),
    jobs: (
      <ul className="list-disc pl-5">
        {jobListings.length > 0 ? (
          jobListings.map((job, index) => (
            <li key={index} className="mb-4">
              <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                <strong>{job.title}</strong>
              </a>
              <p>{job.description}</p>
              <p><strong>Salary:</strong> ₹{job.salary.toLocaleString()}</p>
            </li>
          ))
        ) : (
          <p>Loading job listings...</p>
        )}
      </ul>
    ),
    financialAid: (
      <ul className="list-disc pl-5">
        <li><strong>Government Grants:</strong> Housing and small business grants.</li>
        <li><strong>Unemployment Benefits:</strong> Financial assistance for job seekers.</li>
        <li><strong>Scholarships:</strong> Education scholarships for students.</li>
        <li><strong>Food Assistance Programs:</strong> Free or subsidized meals.</li>
      </ul>
    ),
  };

  return (
    <div className="min-h-screen bg-black-900 text-white flex flex-col items-center p-6">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-blue-400">Financial Backer</h2>

      <nav className="flex space-x-4 bg-gray-800 p-3 rounded-lg shadow-md w-4/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-md transition-all w-1/4 text-center ${
              activeTab === tab.id ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-md w-4/5">
        <h3 className="text-lg font-semibold mb-3 text-blue-400">
          {tabs.find((tab) => tab.id === activeTab)?.label}
        </h3>
        {tabContent[activeTab]}
      </div>
    </div>
  );
};

export default FinancialBacker;