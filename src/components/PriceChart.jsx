import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PriceChart = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [coins, setCoins] = useState([]); // Initialize as an empty array
  const [selectedCoin, setSelectedCoin] = useState("Select a Coin");
  const [coinData, setCoinData] = useState(null);
  const [activeTab, setActiveTab] = useState("Chart"); // Track the active tab

  useEffect(() => {
    const fetchCoins = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-api-key": "CG-aPicBaB8MtdyAbM9LKsrAiaK",
        },
      };

      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/list",
          options
        );
        const data = await response.json();
        setCoins(data || []); // Ensure data is an array or set an empty array
      } catch (error) {
        console.error("Error fetching coins:", error);
        setCoins([]); // Set coins to an empty array on error
      }
    };

    fetchCoins();
  }, []);

  const fetchCoinData = async (coin) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-api-key": "CG-aPicBaB8MtdyAbM9LKsrAiaK",
      },
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coin.id}`,
        options
      );
      const data = await response.json();
      setCoinData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching coin details:", error);
    }
  };

  useEffect(() => {
    if (selectedCoin !== "Select a Coin") {
      const selectedCoinObject = coins.find(
        (coin) => coin.name === selectedCoin
      );
      if (selectedCoinObject) fetchCoinData(selectedCoinObject);
    }
  }, [selectedCoin, coins]);

  const handleSelectCoin = (coin) => {
    setSelectedCoin(coin.name);
    setShowMenu(false);
  };

  // Dummy data for chart (if actual historical data is not available)
  const chartData = [
    { name: "Mon", value: 62000 },
    { name: "Tue", value: 63000 },
    { name: "Wed", value: 64000 },
    { name: "Thu", value: 61000 },
    { name: "Fri", value: 65000 },
    { name: "Sat", value: 64000 },
    { name: "Sun", value: 63179 },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
      {/* Coin Information */}
      {coinData ? (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">
              {coinData.market_data.current_price.usd.toLocaleString()} USD
            </h2>
            <p
              className={`text-lg ${
                coinData.market_data.price_change_percentage_24h >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {coinData.market_data.price_change_percentage_24h}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">
              {coinData.market_data.high_24h.usd.toLocaleString()} (24h High)
            </p>
            <p className="text-gray-500 text-sm">
              {coinData.market_data.low_24h.usd.toLocaleString()} (24h Low)
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Select a coin to view data</p>
      )}

      {/* Toggle Menu */}
      <div className="relative mt-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="py-2 px-4 bg-gray-200 rounded-lg w-full text-left focus:outline-none"
        >
          {selectedCoin}
          <span className="float-right">▼</span>
        </button>
        {showMenu && (
          <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 w-full max-h-60 overflow-y-auto">
            {Array.isArray(coins) && coins.length > 0 ? (
              coins.map((coin) => (
                <li
                  key={coin.id}
                  onClick={() => handleSelectCoin(coin)}
                  className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                >
                  {coin.name} ({coin.symbol.toUpperCase()})
                </li>
              ))
            ) : (
              <li className="py-2 px-4 text-center text-gray-500">
                No coins available
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-4">
        <ul className="flex space-x-4 text-gray-500 border-b border-gray-200">
          <li
            className={`py-2 px-4 cursor-pointer ${
              activeTab === "Chart"
                ? "border-b-2 border-blue-500 text-blue-500"
                : ""
            }`}
            onClick={() => setActiveTab("Chart")}
          >
            Chart
          </li>
          <li
            className={`py-2 px-4 cursor-pointer ${
              activeTab === "Summary"
                ? "border-b-2 border-blue-500 text-blue-500"
                : ""
            }`}
            onClick={() => setActiveTab("Summary")}
          >
            Summary
          </li>
          <li className="py-2 px-4 cursor-pointer">Statistics</li>
          <li className="py-2 px-4 cursor-pointer">Analysis</li>
          <li className="py-2 px-4 cursor-pointer">Settings</li>
        </ul>
      </div>

      {/* Conditional Rendering Based on Active Tab */}
      <div className="mt-4">
        {activeTab === "Chart" && (
          <ResponsiveContainer width="100%" height={300} className="mt-4">
            <LineChart data={chartData}>
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
        )}
        {activeTab === "Summary" && (
          <div className=" mt-4 overflow-y-scroll h-72 ">
            <div className="">{coinData.description?.en} </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceChart;
