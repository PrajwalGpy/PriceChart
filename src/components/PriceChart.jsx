import React, { useState, useEffect } from "react";
import Summary from "./Summary";
import Chart from "./Chart";

const PriceChart = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [coins, setCoins] = useState([]);
  const [selectedCoinName, setSelectedCoinName] = useState("Select a Coin");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [coinData, setCoinData] = useState(null);
  const [activeTab, setActiveTab] = useState("Chart");

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
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100",
          options
        );
        const data = await response.json();
        setCoins(data || []);
      } catch (error) {
        console.error("Error fetching coins:", error);
        setCoins([]);
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
        `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=30&interval=daily`,
        options
      );
      const marketDataResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coin.id}`,
        options
      );
      const priceData = await response.json();
      const marketData = await marketDataResponse.json();

      setCoinData({
        ...marketData,
        prices: priceData.prices,
      });
    } catch (error) {
      console.error("Error fetching coin details:", error);
    }
  };

  useEffect(() => {
    if (selectedCoinName !== "Select a Coin") {
      const selectedCoinObject = coins.find(
        (coin) => coin.name === selectedCoinName
      );
      if (selectedCoinObject) fetchCoinData(selectedCoinObject);
    }
  }, [selectedCoinName, coins]);

  const handleSelectCoin = (coin) => {
    setSelectedCoinName(coin.name);
    setSelectedCoin(coin);
    setShowMenu(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-[730px] mx-auto">
      {/* Coin Information */}
      {coinData && coinData.market_data ? (
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
          {selectedCoinName}
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
        {activeTab === "Chart" && coinData && <Chart coinData={coinData} />}
        {activeTab === "Summary" && <Summary coinData={coinData} />}
      </div>
    </div>
  );
};

export default PriceChart;
