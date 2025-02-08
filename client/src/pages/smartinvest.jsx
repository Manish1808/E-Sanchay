import React, { useState } from "react";

const SmartInvest = () => {
  const [income, setIncome] = useState("");
  const [riskLevel, setRiskLevel] = useState("moderate");
  const [language, setLanguage] = useState("english");
  const [breakdown, setBreakdown] = useState(null);
  const [investmentAdvice, setInvestmentAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateBreakdown = async () => {
    if (!income || isNaN(income) || income <= 0) {
      alert("Please enter a valid monthly income");
      return;
    }

    const needs = (income * 0.6).toFixed(2);
    const wants = (income * 0.2).toFixed(2);
    const savings = (income * 0.2).toFixed(2);

    setBreakdown({ needs, wants, savings });
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:8000/api/v1/smartinvest/invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ income, riskLevel, language }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setInvestmentAdvice(data?.data?.message || "No investment advice available at the moment.");
    } catch (error) {
      console.error("Error fetching investment advice:", error);
      setInvestmentAdvice("Failed to fetch investment advice. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-400">Smart Invest</h2>

      <input
        type="number"
        placeholder="Enter your monthly income"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        className="w-full max-w-md px-4 py-2 border border-gray-600 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />
      
      <select
        value={riskLevel}
        onChange={(e) => setRiskLevel(e.target.value)}
        className="w-full max-w-md px-4 py-2 border border-gray-600 rounded-md bg-gray-800 text-white mb-4"
      >
        <option value="low">Low Risk</option>
        <option value="moderate">Moderate Risk</option>
        <option value="high">High Risk</option>
      </select>
      
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full max-w-md px-4 py-2 border border-gray-600 rounded-md bg-gray-800 text-white mb-4"
      >
        <option value="english">English</option>
        <option value="hindi">Hindi</option>
        <option value="telugu">Telugu</option>
      </select>

      <button
        onClick={calculateBreakdown}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md mb-4 transition-all"
        disabled={loading}
      >
        {loading ? "Calculating..." : "Calculate"}
      </button>

      {breakdown && (
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-blue-400">Income Allocation</h3>
          <p><strong>Needs (60%):</strong> ₹{breakdown.needs}</p>
          <p><strong>Wants (20%):</strong> ₹{breakdown.wants}</p>
          <p><strong>Savings & Investments (20%):</strong> ₹{breakdown.savings}</p>
        </div>
      )}

      {loading && (
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold mb-3 text-blue-400">Fetching Investment Advice...</h3>
          <p className="animate-pulse">Please wait...</p>
        </div>
      )}

      {!loading && investmentAdvice && (
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold mb-3 text-blue-400">Investment Recommendations</h3>
          <p>{investmentAdvice}</p>
        </div>
      )}
    </div>
  );
};

export default SmartInvest;