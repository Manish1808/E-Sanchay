import React, { useState, useContext } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

const SmartInvest = () => {
  const { user } = useContext(AuthContext);
  const [income, setIncome] = useState(user.income || "");
  const [riskLevel, setRiskLevel] = useState("moderate");
  const [language, setLanguage] = useState("english");
  const [breakdown, setBreakdown] = useState(null);
  const [investmentAdvice, setInvestmentAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const calculateBreakdown = async () => {
    const parsedIncome = parseFloat(income);
    if (!parsedIncome || isNaN(parsedIncome) || parsedIncome <= 0) {
      alert("Please enter a valid monthly income");
      return;
    }

    const needs = (parsedIncome * 0.6).toFixed(2);
    const wants = (parsedIncome * 0.2).toFixed(2);
    const savings = (parsedIncome * 0.2).toFixed(2);

    setBreakdown({ needs, wants, savings });
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/smartinvest/invest`, {
        income: parsedIncome,
        riskLevel,
        language,
      });

      setInvestmentAdvice(response.data?.data?.message || "No investment advice available at the moment.");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching investment advice:", error);
      setInvestmentAdvice("Failed to fetch investment advice. Please try again later.");
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const data1 = [
    { name: 'Needs', money: parseFloat(income) * 0.6 },
    { name: 'Wants', money: parseFloat(income) * 0.2 },
    { name: 'Savings/Investments', money: parseFloat(income) * 0.2 },
  ];

  const getInvestmentBreakdown = () => {
    let longTermGrowth, incomeGeneration, safetyFund;
    const savingsAmount = data1[2].money;

    if (riskLevel === "moderate") {
      longTermGrowth = savingsAmount * 0.7;
      incomeGeneration = savingsAmount * 0.2;
      safetyFund = savingsAmount * 0.1;
    } else if (riskLevel === "high") {
      longTermGrowth = savingsAmount * 0.7;
      incomeGeneration = savingsAmount * 0.3;
      safetyFund = 0;
    } else { // Low risk
      longTermGrowth = savingsAmount * 0.5;
      incomeGeneration = savingsAmount * 0.3;
      safetyFund = savingsAmount * 0.2;
    }

    return [
      { name: 'Long-Term Growth', money: longTermGrowth },
      { name: 'Income Generation', money: incomeGeneration },
      { name: 'Safety/Emergency Fund', money: safetyFund },
    ];
  };

  const data2 = getInvestmentBreakdown();

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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[95svw] max-w-6xl text-white flex flex-col max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Investment Recommendations</h3>
            <div className="flex-grow overflow-auto p-2 border border-gray-700 rounded-md bg-gray-900 max-h-[600px]">
              <ReactMarkdown>{investmentAdvice}</ReactMarkdown>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              <PieChart width={350} height={350}>
                <Pie data={data1} dataKey="money" outerRadius={120} label>
                  {data1.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" />
              </PieChart>
              <PieChart width={350} height={350}>
                <Pie data={data2} dataKey="money" outerRadius={120} label>
                  {data2.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" />
              </PieChart>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-red-600 px-4 py-2 rounded self-end">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartInvest;
