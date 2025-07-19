import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const ProgressSection = () => {
  const productivityData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Focus Hours",
        data: [2, 4, 3, 5, 4, 1, 2],
        backgroundColor: "#FF7043",
      },
    ],
  };

  const progressLineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Total Hours Focused",
        data: [15, 18, 16, 20],
        fill: true,
        backgroundColor: "rgba(0, 150, 136, 0.2)",
        borderColor: "#009688",
      },
    ],
  };

  const distributionData = {
    labels: ["Work", "Exercise", "Leisure", "Sleep"],
    datasets: [
      {
        data: [40, 10, 20, 30],
        backgroundColor: ["#0004FF", "#FF7043", "#E91E63", "#009688"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-primary-dark min-h-screen text-white py-14 px-6 md:px-16 font-sans space-y-14">
      <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-gradientStartBlue to-gradientEndBlue drop-shadow-white-glow">
        Progress Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
       <div className="bg-white/10 rounded-xl p-6 shadow-neon-pink text-center h-[400px] flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-secondary-light">
              Time Distribution
            </h3>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <Doughnut
              data={distributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "white", padding: 12 },
                  },
                },
              }}
            />
          </div>
        </div> <div className="bg-white/10 rounded-xl p-6 shadow-custom text-center h-[400px] flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-accent-light">
              Focus Per Day
            </h3>
          </div>
          <div className="flex-grow">
            <Bar
              data={productivityData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-6 shadow-neon-pink text-center h-[400px] flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-secondary-light">
              Time Distribution
            </h3>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <Doughnut
              data={distributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "white", padding: 12 },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 xl:col-span-3 bg-white/10 rounded-xl p-6 shadow-neon-blue text-center h-[400px]">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">
            Weekly Progress
          </h3>
          <div className="h-[320px]">
            <Line
              data={progressLineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: "white",
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: { color: "white" },
                    grid: { color: "#ffffff10" },
                  },
                  y: {
                    ticks: { color: "white" },
                    grid: { color: "#ffffff10" },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;
