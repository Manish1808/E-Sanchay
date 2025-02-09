import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { toast } from "react-toastify";

const rewards = [
  { id: 1, title: "Amazon Gift Card", pointsRequired: 50000, image: "/amazon.webp" },
  { id: 2, title: "Shopping Voucher", pointsRequired: 5000, image: "/shop.jpg" },
  { id: 3, title: "Travel Bag", pointsRequired: 7000, image: "/travelbag.jpg" },
  { id: 4, title: "Water Bottle", pointsRequired: 40, image: "/bottle.webp" },
  { id: 5, title: "Mobile Recharge", pointsRequired: 5000, image: "/recharge.jpg" },
  { id: 6, title: "Movie Coupons", pointsRequired: 6000, image: "/movie.jpg" },
];

const RewardsGrid = () => {
  const { user } = useContext(AuthContext);
  const userPoints = user?.points || 0;

  const handleRedeem = (requiredPoints) => {
    if (userPoints >= requiredPoints) {
      toast.success("Coupon will be sent via SMS!");
    } else {
      toast.error("Insufficient points!");
    }
  };

  return (
    <div className="bg-black min-h-[50vh] p-6 flex justify-center text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-gray-800 border border-gray-700 hover:scale-105 transition-transform p-4 flex flex-col items-center"
          >
            <img className="h-32 w-full object-cover rounded mb-3" src={reward.image} alt={reward.title} />
            <h3 className="text-lg font-semibold">{reward.title}</h3>
            <p className="text-gray-400 text-sm mb-2">Points Required: {reward.pointsRequired}</p>
            <button
              onClick={() => handleRedeem(reward.pointsRequired)}
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition"
            >
              Redeem
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsGrid;
