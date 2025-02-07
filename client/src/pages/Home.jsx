import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-orange-200 min-h-screen p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">

        <Link to="/learn" className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-blue-100 hover:bg-blue-200 transition duration-300">
          <img className="h-40 w-full object-cover" src="/chatbot.jpg" alt="Learn Finance" />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 text-gray-900">Learn Finance</div>
          </div>
        </Link>

        <Link to="/sanchayagent" className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-blue-100 hover:bg-blue-200 transition duration-300">
          <img className="h-40 w-full object-cover" src="/sanchayagent.jpg" alt="Sanchay-Agent" />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 text-gray-900">Sanchay-Agent</div>
          </div>
        </Link>

        <Link to="/sandehbot" className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-blue-100 hover:bg-blue-200 transition duration-300">
          <img className="h-40 w-full object-cover" src="/chatbot.jpg" alt="Sandeh-Bot" />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 text-gray-900">Sandeh-Bot</div>
          </div>
        </Link>

        <Link to="/smartinvest" className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-blue-100 hover:bg-blue-200 transition duration-300">
          <img className="h-40 w-full object-cover" src="/chatbot.jpg" alt="Smart Invest" />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 text-gray-900">Smart Invest</div>
          </div>
        </Link>

        <Link to="/assessment" className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-blue-100 hover:bg-blue-200 transition duration-300">
          <img className="h-40 w-full object-cover" src="/chatbot.jpg" alt="Assessment" />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 text-gray-900">Assessment</div>
          </div>
        </Link>

        <Link to="/financialbacker" className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-blue-100 hover:bg-blue-200 transition duration-300">
          <img className="h-40 w-full object-cover" src="/chatbot.jpg" alt="Financial Backer" />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 text-gray-900">Financial Backer</div>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default Home;
