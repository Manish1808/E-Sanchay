import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { Bot, X } from "lucide-react";

const SanchayAgent = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState("");
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editExpense, setEditExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/sancheyagent/expenses/${user._id}`
      );
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const addExpense = async () => {
    if (!title || !amount) {
      setMessage("Title and Amount are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/sancheyagent/createexpense",
        { userId: user._id, title, amount: Number(amount) }
      );

      setExpenses([...expenses, response.data.expense]);
      setTitle("");
      setAmount("");
      setMessage("Expense added successfully!");
    } catch (error) {
      setMessage("Error adding expense.");
    }
    setLoading(false);
  };

  const summarizeExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/sancheyagent/summarize",
        { userId: user._id, expenses }
      );

      setSummary(response.data.data.message || "No summary available.");
      setIsSummaryModalOpen(true);
    } catch (error) {
      setSummary("Error summarizing expenses.");
    }
    setLoading(false);
  };

  const updateExpense = async () => {
    if (!editExpense.title || !editExpense.amount) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/sancheyagent/expenses/${editExpense._id}`,
        { title: editExpense.title, amount: Number(editExpense.amount) }
      );

      setExpenses(
        expenses.map((exp) => (exp._id === editExpense._id ? response.data.expense : exp))
      );
      setIsEditModalOpen(false);
      setEditExpense(null);
    } catch (error) {
      setMessage("Error updating expense.");
    }
    setLoading(false);
  };

  const deleteExpense = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/v1/sancheyagent/expenses/${id}`);
      setExpenses(expenses.filter((exp) => exp._id !== id));
      setMessage("Expense deleted successfully!");
    } catch (error) {
      setMessage("Error deleting expense.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-4">Sanchay Agent - Expenses Tracker</h1>

      <div className="w-full max-w-md bg-gray-800 p-5 rounded-lg shadow-lg">
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
          onClick={addExpense}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>

        <button
          onClick={summarizeExpenses}
          disabled={loading}
          className="flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-6"
        >
          <Bot className="mr-2" size={20} /> {loading ? "Summarizing..." : "Summarize Expenses"}
        </button>
      </div>

      <ul className="w-full max-w-md mt-4">
        {expenses.map((exp) => (
          <li key={exp._id} className="flex justify-between bg-gray-700 p-2 mt-2 rounded">
            <span>{exp.title} - ₹{exp.amount}</span>
            <div>
              <button
                onClick={() => {
                  setEditExpense(exp);
                  setIsEditModalOpen(true);
                }}
                className="bg-yellow-500 px-2 py-1 rounded"
              >✏️</button>
              <button
                onClick={() => deleteExpense(exp._id)}
                className="bg-red-500 px-2 py-1 rounded ml-2"
              >🗑</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Expense Modal */}
      {isEditModalOpen && editExpense && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-white">
            <h2 className="text-xl font-bold mb-2">Edit Expense</h2>
            <input
              type="text"
              value={editExpense.title}
              onChange={(e) => setEditExpense({ ...editExpense, title: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white mb-2"
            />
            <input
              type="number"
              value={editExpense.amount}
              onChange={(e) => setEditExpense({ ...editExpense, amount: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white mb-2"
            />
            <button 
              onClick={updateExpense} 
              className="bg-blue-600 px-4 py-2 rounded"
            >
              Save
            </button>
            <button 
              onClick={() => setIsEditModalOpen(false)} 
              className="ml-2 bg-red-600 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isSummaryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-white">
            <h2 className="text-xl font-bold mb-2">Expense Summary</h2>
            <p>{summary}</p>
            <button onClick={() => setIsSummaryModalOpen(false)} className="mt-4 bg-red-600 px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SanchayAgent;
