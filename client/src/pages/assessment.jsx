import React, { useState, useEffect,useContext } from 'react';
import {toast} from 'react-toastify';
import {AuthContext} from "../contexts/AuthContext.jsx";
import { RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';
import axios from 'axios';
const Assessment = () => {
  const { user, setUser } = useContext(AuthContext);

  const questions = [
    { question: "What is the best way to save money for long-term financial security?", options: ["Spending less than you earn", "Investing in a diversified portfolio", "Keeping all money in a savings account", "Relying on a single income source"], correctAnswer: "b" },
    { question: "What is a good strategy for reducing debt?", options: ["Ignoring it", "Paying off high-interest debt first", "Borrowing more money", "Keeping it on a credit card"], correctAnswer: "b" },
    { question: "How can you start saving for retirement?", options: ["By spending all your income", "By putting money in a high-interest savings account", "By investing in stocks", "By not having a budget"], correctAnswer: "b" },
    { question: "What is the primary benefit of a budget?", options: ["Increasing expenses", "Managing income and expenses effectively", "Eliminating savings", "Avoiding financial goals"], correctAnswer: "b" },
    { question: "Why is an emergency fund important?", options: ["To cover unexpected expenses", "To spend more", "To avoid investing", "To keep all money in cash"], correctAnswer: "a" },
    { question: "Which investment option provides the highest potential returns?", options: ["Savings account", "Bonds", "Stock market", "Fixed deposit"], correctAnswer: "c" },
    { question: "What is a key advantage of compound interest?", options: ["Money grows over time with interest on interest", "Decreases savings", "Only benefits large deposits", "Reduces income"], correctAnswer: "a" },
    { question: "What should you do before making a large purchase?", options: ["Buy immediately", "Compare prices and save up", "Ignore budget", "Take out unnecessary loans"], correctAnswer: "b" },
    { question: "How can you improve your credit score?", options: ["Not paying bills on time", "Keeping low credit utilization", "Closing all credit accounts", "Taking excessive loans"], correctAnswer: "b" },
    { question: "Why is it important to diversify investments?", options: ["Reduces risk", "Increases losses", "Only benefits the wealthy", "Eliminates profit"], correctAnswer: "a" },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [notAttemptedCount, setNotAttemptedCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) {
      moveToNextQuestion(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const resetQuiz = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/updatepoints`, {
        points: score * 10,
        userid: user._id,
      });
  
      const updatedUser = response.data.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));
  
      // Ensure setUser is defined
      if (setUser) {
        setUser(updatedUser);
      }
  
      toast.success(`Score updated successfully!`);
    } catch (error) {
      toast.error("Failed to update points. Try again.");
      console.log(error);
    }
  
    // Reset quiz state
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setTimeLeft(30);
    setScore(0);
    setIncorrectCount(0);
    setNotAttemptedCount(0);
    setQuizCompleted(false);
  };
  
  

  const handleNextQuestion = () => {
    moveToNextQuestion(false);
  };

  const moveToNextQuestion = (timeout) => {
    if (timeout || selectedOption === null) {
      setNotAttemptedCount((prev) => prev + 1);
    } else {
      const currentQuestion = questions[currentQuestionIndex];
      if (selectedOption === currentQuestion.correctAnswer) {
        setScore((prevScore) => prevScore + 1);
      } else {
        setIncorrectCount((prevCount) => prevCount + 1);
      }
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
    }
  };

  if (quizCompleted) {
    const totalQuestions = questions.length;
    const data = [
      { name: 'Correct', value: (score / totalQuestions) * 100, fill: '#28a745' },
      { name: 'Incorrect', value: (incorrectCount / totalQuestions) * 100, fill: '#dc3545' },
      { name: 'Not Attempted', value: (notAttemptedCount / totalQuestions) * 100, fill: '#ffc107' },
    ];

    return (
      
      <div className="flex flex-col items-center justify-center h-screen bg-black-900">
        <h2 className="text-2xl font-bold mb-8 text-white">Quiz Completed!</h2>
        <RadialBarChart width={400} height={300} cx="50%" cy="50%" innerRadius="10%" outerRadius="100%" barSize={15} data={data} startAngle={180} endAngle={0}>
          <RadialBar label={{ position: 'insideStart', fill: '#fff' }} background dataKey="value" />
          <Tooltip />
          <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ marginTop: 200 }} />
        </RadialBarChart>
        
        <p className="mt-4 text-white">Correct Answers: {score}</p>
        <p className="text-white">Incorrect Answers: {incorrectCount}</p>
        <p className="text-white">Not Attempted: {notAttemptedCount}</p>
        <p className="text-white font-bold">Score: {score}/{totalQuestions}</p>
        <button onClick={resetQuiz} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Retry?</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black-900">
      <h2 className="text-2xl font-bold mb-4 text-white">Question {currentQuestionIndex + 1} of {questions.length}</h2>
      <p className="text-lg mb-4 text-white">Time Left: {timeLeft} seconds</p>
      <p className="text-white font-semibold mb-4">{currentQuestion.question}</p>
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {currentQuestion.options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <input type="radio" id={`option${index}`} name="options" value={String.fromCharCode(65 + index).toLowerCase()} onChange={handleOptionChange} checked={selectedOption === String.fromCharCode(65 + index).toLowerCase()} className="text-blue-400" />
            <label htmlFor={`option${index}`} className="text-white">{`${String.fromCharCode(65 + index)}) ${option}`}</label>
          </div>
        ))}
      </div>
      <button onClick={handleNextQuestion} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}</button>
    </div>
  );
};

export default Assessment;
