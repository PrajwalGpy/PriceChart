import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", value: 62000 },
  { name: "Tue", value: 63000 },
  { name: "Wed", value: 64000 },
  { name: "Thu", value: 61000 },
  { name: "Fri", value: 65000 },
  { name: "Sat", value: 64000 },
  { name: "Sun", value: 63179 },
];

const PriceChart = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">
            63,179.71 USD
          </h2>
          <p className="text-green-500 text-lg">+2,161.42 (3.54%)</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-sm">64,850.35</p>
        </div>
      </div>

      <div className="mt-4">
        <ul className="flex space-x-4 text-gray-500 border-b border-gray-200">
          <li className="py-2 px-4 border-b-2 border-blue-500 text-blue-500 cursor-pointer">
            Chart
          </li>
          <li className="py-2 px-4 cursor-pointer">Summary</li>
          <li className="py-2 px-4 cursor-pointer">Statistics</li>
          <li className="py-2 px-4 cursor-pointer">Analysis</li>
          <li className="py-2 px-4 cursor-pointer">Settings</li>
        </ul>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <button className="py-1 px-3 bg-blue-50 text-blue-500 rounded-lg">
            1w
          </button>
          <div className="space-x-3">
            <button className="py-1 px-3">1d</button>
            <button className="py-1 px-3">3d</button>
            <button className="py-1 px-3">1m</button>
            <button className="py-1 px-3">6m</button>
            <button className="py-1 px-3">1y</button>
            <button className="py-1 px-3">max</button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300} className="mt-4">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
