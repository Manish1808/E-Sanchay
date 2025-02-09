import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { Bot, Edit, Trash } from "lucide-react";
import ExpensePieChart from "./expensepiechart.jsx";
import ReactMarkdown from "react-markdown"; 
const SanchayAgent = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [sloading, setsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState("");
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/sancheyagent/expenses/${user._id}`
      );
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const addOrUpdateExpense = async () => {
    if (!title || !amount) {
      setMessage("Title and Amount are required.");
      return;
    }

    setLoading(true);

    try {
      if (editingExpense) {
        // Update Expense
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/sancheyagent/expenses/${editingExpense._id}`,
          { title, amount: Number(amount) }
        );

        setExpenses(
          expenses.map((exp) =>
            exp._id === editingExpense._id ? response.data.expense : exp
          )
        );
        setEditingExpense(null);
      } else {
        // Add Expense
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/sancheyagent/createexpense`,
          { userId: user._id, title, amount: Number(amount) }
        );

        setExpenses([...expenses, response.data.expense]);
      }

      setTitle("");
      setAmount("");
      setMessage(editingExpense ? "Expense updated successfully!" : "Expense added successfully!");
    } catch (error) {
      setMessage("Error processing expense.");
    }

    setLoading(false);
  };

  const editExpense = (expense) => {
    setEditingExpense(expense);
    setTitle(expense.title);
    setAmount(expense.amount);
  };

  const deleteExpense = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/sancheyagent/expenses/${id}`);
      setExpenses(expenses.filter((exp) => exp._id !== id));
      setMessage("Expense deleted successfully!");
    } catch (error) {
      setMessage("Error deleting expense.");
    }
    setLoading(false);
  };

  const summarizeExpenses = async () => {
    setsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/sancheyagent/summarize`,
        { userId: user._id, expenses }
      );

      setSummary(response.data.data.message || "No summary available.");
      setIsSummaryModalOpen(true);
    } catch (error) {
      setSummary("Error summarizing expenses.");
    }
    setsLoading(false);
  };

  return (
    <div className="flex h-screen bg-black-900 text-white p-5">
      {/* Left Section (20%) */}
      <div className="w-1/5 flex flex-col justify-center items-center bg-gray-800 p-5 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold mb-4">Sanchay Agent</h1>

        {/* Expense Form */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-gray-700 border border-gray-600 text-white"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-gray-700 border border-gray-600 text-white"
        />
        <button
          onClick={addOrUpdateExpense}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? (editingExpense ? "Updating..." : "Adding...") : editingExpense ? "Update Expense" : "Add Expense"}
        </button>

        {/* Summarize Expenses Button (Aligned Left) */}
        <div className="w-full mt-4">
          <button
            onClick={summarizeExpenses}
            disabled={sloading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center w-full"
          >
            <Bot className="mr-2" size={20} /> {sloading ? "Summarizing..." : "Summarize Expenses"}
          </button>
        </div>
      </div>

      {/* Right Section (80%) - Grid Layout */}
      <div className="w-4/5 p-5">
        <h2 className="text-2xl font-bold mb-4">Expense List</h2>
        <div className="grid grid-cols-4 gap-3">
          {expenses.map((exp) => (
            <div key={exp._id} className="bg-gray-700 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold">{exp.title}</h3>
              <p className="text-gray-300">₹{exp.amount}</p>
              <p className="text-sm text-gray-400">
                {new Date(exp.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => editExpense(exp)}
                  className="bg-yellow-500 px-3 py-1 rounded flex items-center"
                >
                  <Edit size={16} className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => deleteExpense(exp._id)}
                  className="bg-red-500 px-3 py-1 rounded flex items-center"
                >
                  <Trash size={16} className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Modal */}
      {isSummaryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-4/5 h-4/5 text-white overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Expense Summary</h2>
            <ExpensePieChart expenses={expenses} />
            <ReactMarkdown className="whitespace-pre-wrap mt-4">{summary}</ReactMarkdown>
            <button
              onClick={() => setIsSummaryModalOpen(false)}
              className="mt-4 bg-red-600 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SanchayAgent;