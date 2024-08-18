import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import fullScreanicon from "../assets/view-fullscreen-symbolic.svg";
import { IoIosAddCircleOutline } from "react-icons/io";
import "./Chart.css";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler
);

const Chart = ({ coinData }) => {
  const [chartData, setChartData] = useState({});
  const [days, setDays] = useState(7); // Default to 1 week (7 days)
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);
  const [showComparisonMenu, setShowComparisonMenu] = useState(false); // New state for comparison menu
  const [coins, setCoins] = useState([]); // List of coins for comparison

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

  useEffect(() => {
    const fetchCoinsData = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-api-key": "CG-aPicBaB8MtdyAbM9LKsrAiaK",
        },
      };

      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinData?.id}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
          options
        );
        const data = await response.json();

        if (data && data.prices) {
          const labels = data.prices.map(([timestamp]) =>
            new Date(timestamp).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          );
          const prices = data.prices.map(([, price]) => price);

          const latestPrice = prices[prices.length - 1];
          const firstPrice = prices[0];
          const priceChangeValue = latestPrice - firstPrice;
          const priceChangePercent = (
            (priceChangeValue / firstPrice) *
            100
          ).toFixed(2);

          setCurrentPrice(
            latestPrice.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })
          );
          setPriceChange(
            `${priceChangeValue >= 0 ? "+" : ""}${priceChangeValue.toFixed(
              2
            )} (${priceChangePercent}%)`
          );

          const newChartData = {
            labels: labels,
            datasets: [
              {
                label: `${coinData.name} Price (USD)`,
                data: prices,
                borderColor: "#4B49AC",
                borderWidth: 2,
                tension: 0.1,
                fill: true,
                backgroundColor: "rgba(75,73,172,0.2)",
                pointRadius: 0,
              },
            ],
          };

          if (comparisonData) {
            newChartData.datasets.push({
              label: `${comparisonData.name} Price (USD)`,
              data: comparisonData.prices,
              borderColor: "#FF6347", // Tomato color for comparison
              borderWidth: 2,
              tension: 0.1,
              fill: false,
              pointRadius: 0,
            });
          }

          setChartData(newChartData);
        } else {
          console.error("Data format is incorrect or missing");
          setChartData({});
        }
      } catch (error) {
        console.error("Error fetching coins:", error);
        setChartData({});
      }
    };

    if (coinData?.id) {
      fetchCoinsData();
    }
  }, [coinData, days, comparisonData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        type: "category",
        display: true,
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1500,
      easing: "easeOutQuad",
    },
  };

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleCompare = () => {
    setShowComparisonMenu(!showComparisonMenu); // Toggle comparison menu
  };

  const handleSelectComparisonCoin = async (coin) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-api-key": "CG-aPicBaB8MtdyAbM9LKsrAiaK",
      },
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
        options
      );
      const data = await response.json();

      if (data && data.prices) {
        const prices = data.prices.map(([, price]) => price);
        setComparisonData({ name: coin.name, prices });
        setShowComparisonMenu(false); // Close menu after selection
      } else {
        alert("Failed to fetch comparison coin data.");
      }
    } catch (error) {
      console.error("Error fetching comparison coin:", error);
    }
  };

  return (
    <div
      className={`chart-container ${isFullScreen ? "full-screen" : ""} ${
        !isFullScreen ? "" : "w-full "
      }`}
    >
      <div className="chart-navigation flex justify-between items-center">
        <div className="flex justify-evenly">
          <button
            className="px-2 py-2 rounded text-gray-700 ml-5 flex items-center gap-1"
            onClick={handleFullScreen}
          >
            <img src={fullScreanicon} alt="fullscreanlogo" width={11} />
            {isFullScreen ? "Exit Full Screen" : "Full Screen"}
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 ml-5 flex items-center gap-1"
            onClick={handleCompare}
          >
            <IoIosAddCircleOutline />
            Compare
          </button>
        </div>
        <div>
          {["1d", "3d", "1w", "1m", "6m", "1y", "max"].map((period) => (
            <button
              key={period}
              className={`ml-1 px-2 py-1 rounded text-sm hover:bg-blue-500 hover:text-white ${
                days === period
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() =>
                setDays(
                  period === "1d"
                    ? 1
                    : period === "3d"
                    ? 3
                    : period === "1w"
                    ? 7
                    : period === "1m"
                    ? 30
                    : period === "6m"
                    ? 180
                    : period === "1y"
                    ? 365
                    : "max"
                )
              }
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="chart flex flex-col items-center justify-center">
        {chartData.labels ? (
          <Line data={chartData} options={options} />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
      <div className="price-details flex justify-between mt-2">
        {/* <div className="price"></div> */}
        <p
          className={`text-lg ${
            currentPrice >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {currentPrice}%
        </p>
        <div className="price-change">{priceChange}</div>
      </div>

      {/* Comparison Menu */}
      {showComparisonMenu && (
        <div className="comparison-menu absolute top-16 left-0 w-64 bg-white shadow-lg rounded-md p-4 z-10">
          <h3 className="text-lg font-bold mb-2">Select a coin to compare:</h3>
          <ul className="overflow-y-auto max-h-60">
            {coins &&
              coins.map((coin) => (
                <li
                  key={coin.id}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                  onClick={() => handleSelectComparisonCoin(coin)}
                >
                  {coin.name}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Chart;
