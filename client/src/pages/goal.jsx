import React, { useState, useEffect, useContext } from "react";
import { format } from "date-fns";
import Confetti from "react-confetti";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext.jsx";

const motivationalQuotes = [
  "Dream big and dare to fail.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "The only limit to our realization of tomorrow is our doubts of today.",
  "Don't watch the clock; do what it does. Keep going."
];

const GoalTracker = () => {
  const [goals, setGoals] = useState([]);
  const { user } = useContext(AuthContext);
  const [goalData, setGoalData] = useState({
    title: "",
    targetAmount: "",
    targetDate: ""
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [newCollectedMoney, setNewCollectedMoney] = useState({});
  const [motivationalMessage, setMotivationalMessage] = useState("");

  // **Fetch Goals on Component Mount**
  useEffect(() => {
    if (user?._id) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/goal/getgoals`, { userid: user._id });
      setGoals(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching goals");
    }
  };

  const handleInputChange = (e) => {
    setGoalData({ ...goalData, [e.target.name]: e.target.value });
  };

  // **Create Goal**
  const addGoal = async () => {
    if (!goalData.title || !goalData.targetAmount || !goalData.targetDate) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/goal/creategoal`, {
        ...goalData,
        userid: user._id
      });
      setGoals([...goals, response.data.data]);
      setGoalData({ title: "", targetAmount: "", targetDate: "" });
      toast.success("Goal added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add goal");
    }
  };

  // **Update Collected Money**
  const updateCollectedMoney = async (id, collectedAmount) => {
    try {
      const goalToUpdate = goals.find(goal => goal._id === id); // Get the specific goal by ID

      if (!goalToUpdate) {
        toast.error("Goal not found");
        return;
      }

      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/goal/updategoal/${id}`, {
        collectedAmount
      });

      setGoals(goals.map(goal => (goal._id === id ? response.data.data : goal)));

      // Correctly check if the goal is completed
      if (collectedAmount >= goalToUpdate.targetAmount) {
        setShowConfetti(true);
        setMotivationalMessage(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
        setTimeout(() => {
          setShowConfetti(false);
          setMotivationalMessage("");
        }, 5000);
      }

      toast.success("Goal updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update goal");
    }
  };

  // **Delete Goal**
  const deleteGoal = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/goal/deletegoal/${id}`);
      setGoals(goals.filter(goal => goal._id !== id));
      toast.success("Goal deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete goal");
    }
  };

  return (
    <div className="p-10 bg-gray-900 text-white min-h-screen relative flex gap-10">
      {showConfetti && <Confetti numberOfPieces={300} gravity={0.2} />}
      <div className="w-1/3 flex justify-center">
        <div className="p-6 bg-gray-800 w-full max-w-sm rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">Add New Goal</h2>
          <div className="grid gap-4">
            <label className="text-white">Title</label>
            <input className="bg-gray-700 text-white p-2 rounded-md" name="title" value={goalData.title} onChange={handleInputChange} />
            <label className="text-white">Target Amount</label>
            <input className="bg-gray-700 text-white p-2 rounded-md" name="targetAmount" type="number" value={goalData.targetAmount} onChange={handleInputChange} />
            <label className="text-white">Target Date</label>
            <input className="bg-gray-700 text-white p-2 rounded-md" name="targetDate" type="date" value={goalData.targetDate} min={format(new Date(), "yyyy-MM-dd")} onChange={handleInputChange} />
            <button onClick={addGoal} className="mt-4 bg-blue-500 hover:bg-blue-600 p-2 rounded-md">Add Goal</button>
          </div>
        </div>
      </div>

      <div className="w-2/3 grid grid-cols-2 gap-6 overflow-y-auto max-h-screen">
        {goals.map((goal) => {
          const targetMoney = parseFloat(goal.targetAmount);
          const collectedMoney = parseFloat(goal.collectedAmount || 0);
          const progress = (collectedMoney / targetMoney) * 100;

          const isGoalCompleted = collectedMoney >= targetMoney;

          // **Calculating Remaining Amount and Time**
          const remainingAmount = targetMoney - collectedMoney;
          const today = new Date();
          const targetDate = new Date(goal.targetDate);
          const daysLeft = Math.max(0, Math.floor((targetDate - today) / (1000 * 60 * 60 * 24)));

          const dailySavings = daysLeft > 0 ? (remainingAmount / daysLeft).toFixed(2) : 0;
          const monthlySavings = daysLeft > 0 ? (remainingAmount / Math.ceil(daysLeft / 30)).toFixed(2) : 0;


          return (
            <div
              key={goal._id}
              className={`p-6 bg-gray-800 w-80 h-80 rounded-lg shadow-lg flex flex-col justify-between relative transition-all 
    ${isGoalCompleted ? "completed-goal transform scale-105" : "hover:shadow-xl hover:scale-105"}
  `}
              style={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease"
              }}
            >
              <div className="space-y-3 relative z-10">
                <h3 className="text-lg font-bold text-white">{goal.title}</h3>
                <p className="text-lg">Target: ₹{goal.targetAmount}</p>
                <p className="text-lg">Collected: ₹{goal.collectedAmount}</p>
                <p className="text-lg">Target Date: {format(new Date(goal.targetDate), "dd MMM yyyy")}</p>

                {!isGoalCompleted && (
                  <>
                    <p className="text-sm text-yellow-400">Money Required: ₹{remainingAmount}</p>
                    <p className="text-sm text-yellow-400">Save Daily: ₹{dailySavings} | Monthly: ₹{monthlySavings}</p>
                  </>
                )}

                {/* Progress Bar */}
                <div className="relative w-full h-3 bg-gray-700 rounded-lg overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, rgba(255,0,150,1) 0%, rgba(0,204,255,1) 100%)`,
                      boxShadow: "0 4px 10px rgba(0, 204, 255, 0.6)"
                    }}
                  ></div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  {!isGoalCompleted ? (
                    <>
                      <input
                        className="bg-gray-700 text-white w-20 text-xs p-3 rounded-md"
                        type="number"
                        value={newCollectedMoney[goal._id] || ""}
                        onChange={(e) =>
                          setNewCollectedMoney({
                            ...newCollectedMoney,
                            [goal._id]: e.target.value
                          })
                        }
                      />
                      <button
                        onClick={() => updateCollectedMoney(goal._id, newCollectedMoney[goal._id])}
                        className="bg-green-500 hover:bg-green-600 text-xs p-3 rounded-md transition-colors"
                      >
                        Update
                      </button>
                    </>
                  ) : (
                    <p className="text-green-400 text-sm font-semibold">Goal Completed!</p>
                  )}
                  <button
                    onClick={() => deleteGoal(goal._id)}
                    className="bg-red-500 hover:bg-red-600 text-xs p-3 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Completed Overlay with Smooth Animation */}
              {isGoalCompleted && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-30 rounded-lg flex flex-col items-center justify-center animate-fade-in">
                  <span className="text-6xl text-green-500 font-bold mb-2 animate-pulse">🎉</span>
                  <span className="text-2xl text-green-400 font-bold">Completed!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalTracker;
