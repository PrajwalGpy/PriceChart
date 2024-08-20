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
  BarElement,
  BarController,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler,
  BarElement,
  BarController
);

const Chart = ({ coinData, onPriceDataUpdate }) => {
  const [chartData, setChartData] = useState({});
  const [days, setDays] = useState("7d"); // Default to 7 days
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);
  const [showComparisonMenu, setShowComparisonMenu] = useState(false);
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchCoins = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-access-token": import.meta.env.VITE_API_URL_Api_Key,
        },
      };

      try {
        const response = await fetch(
          "https://api.coinranking.com/v2/coins?orderBy=price&limit=100",
          options
        );
        const data = await response.json();
        setCoins(data.data.coins || []);
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
          "x-access-token": import.meta.env.VITE_API_URL_Api_Key,
        },
      };

      try {
        const response = await fetch(
          `https://api.coinranking.com/v2/coin/${coinData?.coin.uuid}/history?timePeriod=${days}`,
          options
        );
        const data = await response.json();

        if (data && data.data && Array.isArray(data.data.history)) {
          const labels = data.data.history
            .map((entry) => {
              const date = new Date(entry.timestamp * 1000);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            })
            .reverse();

          const prices = data.data.history
            .map((entry) => parseFloat(entry.price))
            .reverse();

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
                label: `${coinData.coin.name} Price (USD)`,
                data: prices,
                borderColor: "#4B49AC",
                borderWidth: 2,
                tension: 0.1,
                fill: true,
                backgroundColor: "rgba(75,73,172,0.2)",
                pointRadius: 0,
                yAxisID: "y1",
              },
            ],
          };

          if (comparisonData) {
            newChartData.datasets.push({
              label: `${comparisonData.name} Price (USD)`,
              data: comparisonData.prices,
              borderColor: "#FF6347",
              borderWidth: 2,
              tension: 0.1,
              fill: false,
              pointRadius: 0,
            });
          }

          setChartData(newChartData);

          // Call the callback function to pass data to the parent component
          onPriceDataUpdate(currentPrice, priceChange);
        } else {
          console.error("Data format is incorrect or missing");
          setChartData({});
        }
      } catch (error) {
        console.error("Error fetching coin data:", error);
        setChartData({});
      }
    };

    if (coinData?.coin.uuid) {
      fetchCoinsData();
    }
  }, [coinData, days, comparisonData, onPriceDataUpdate]);

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
      y1: {
        type: "linear",
        position: "left",
        grid: {
          display: false,
        },
      },
      y2: {
        type: "linear",
        position: "right",
        grid: {
          display: false,
        },
      },
      x: {
        type: "category",
        display: true,
        grid: {
          display: false,
        },
      },
    },
    hover: {
      mode: "index",
      intersect: false,
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 7,
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
    setShowComparisonMenu(!showComparisonMenu);
  };

  const handleSelectComparisonCoin = async (coin) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-access-token": import.meta.env.VITE_API_URL_Api_Key,
      },
    };

    try {
      const response = await fetch(
        `https://api.coinranking.com/v2/coin/${coin.uuid}/history?timePeriod=${days}`,
        options
      );
      const data = await response.json();

      if (data && data.data && Array.isArray(data.data.history)) {
        const prices = data.data.history.map((entry) =>
          parseFloat(entry.price)
        );
        setComparisonData({ name: coin.name, prices });
        setShowComparisonMenu(false);
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
            className="md:px-2 md:py-2 rounded text-gray-700 ml-5 flex items-center gap-1 text-xs md:text-lg"
            onClick={handleFullScreen}
          >
            <img src={fullScreanicon} alt="fullscreanlogo" width={11} />
            {isFullScreen ? "Exit Full Screen" : "Full Screen"}
          </button>
          <button
            className="md:px-4 md:py-2 rounded bg-gray-200 text-gray-700 ml-5 flex items-center gap-1 text-xs md:text-lg"
            onClick={handleCompare}
          >
            <IoIosAddCircleOutline />
            Compare
          </button>
        </div>
        <div>
          {["12h", "1d", "7d", "1m", "3m", "1y", "max"].map((period) => (
            <button
              key={period}
              className={`ml-1 md:px-2 md:py-1 rounded text-xs md:text-sm hover:bg-blue-500 hover:text-white ${
                days === period
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() =>
                setDays(
                  period === "12h"
                    ? "12h"
                    : period === "1d"
                    ? "24h"
                    : period === "7d"
                    ? "7d"
                    : period === "1m"
                    ? "30d"
                    : period === "3m"
                    ? "3m"
                    : period === "1y"
                    ? "1y"
                    : "3y"
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
          <div>Loading chart data...</div>
        )}
      </div>
      <div className="chart-details flex flex-col items-center">
        <div className="flex flex-col items-center md:flex-row md:gap-4 mt-4">
          <span className="text-lg md:text-2xl font-bold">{currentPrice}</span>
          <span
            className={`text-sm md:text-lg font-bold ${
              priceChange && priceChange.startsWith("+")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {priceChange}
          </span>
        </div>
      </div>
      {showComparisonMenu && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Select Coin to Compare</h2>
            <div className="grid grid-cols-2 gap-4">
              {coins.map((coin) => (
                <button
                  key={coin.uuid}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
                  onClick={() => handleSelectComparisonCoin(coin)}
                >
                  {coin.name}
                </button>
              ))}
            </div>
            <button
              className="mt-4 text-red-500"
              onClick={() => setShowComparisonMenu(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chart;
