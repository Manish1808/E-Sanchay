import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const ExpensePieChart = ({ expenses }) => {
  // Process expenses data for the pie chart
  const chartData = expenses.map(expense => ({
    name: expense.title,
    value: Number(expense.amount)
  }));

  // Generate colors for pie chart segments
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const getColor = (index) => COLORS[index % COLORS.length];

  return (
    <div className="w-full h-64 flex items-center justify-center">
      <PieChart width={400} height={250}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, value }) => `${name}: ₹${value}`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(index)} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `₹${value}`} />
        <Legend />
      </PieChart>
    </div>
  );
};

export default ExpensePieChart;