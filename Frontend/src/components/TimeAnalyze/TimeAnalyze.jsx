// Required dependencies:
// npm install react-icons chart.js react-chartjs-2 react-calendar

import React, { useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaRedo,
  FaClock,
  FaBell,
  FaHourglassEnd,
  FaCalendarAlt,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const getTimeLeftToday = () => {
  const now = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const diff = end.getTime() - now.getTime();
  const hrs = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { hrs, mins, secs, totalSecs: Math.floor(diff / 1000) };
};

const formatTime = (t) => {
  const hrs = Math.floor(t / 3600);
  const mins = Math.floor((t % 3600) / 60);
  const secs = t % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const TimeAnalyze = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeftToday());
  const [stopwatch, setStopwatch] = useState(0);
  const [running, setRunning] = useState(false);
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeftToday());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;
    if (running) {
      timer = setInterval(() => setStopwatch((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    let interval;
    if (isPomoRunning) {
      interval = setInterval(() => {
        setPomoTime((prev) => {
          if (prev === 0) {
            setIsBreak(!isBreak);
            return isBreak ? 25 * 60 : 5 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPomoRunning, isBreak]);

  const adjustPomoTime = (amount) => {
    setPomoTime((prev) => Math.max(60, prev + amount));
  };

  const pieData = {
    labels: ["Productive", "Break", "Idle"],
    datasets: [
      {
        data: [6, 2, 4],
        backgroundColor: ["#4ade80", "#facc15", "#f87171"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Focus Minutes",
        data: [120, 90, 150, 100, 80, 60, 140],
        backgroundColor: "#60a5fa",
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white",
          font: {
            size: 14,
          },
        },
      },
    },
    layout: {
      padding: 24,
    },
    radius: "80%",
    cutout: "70%",
  };

  return (
    <div className="bg-primary-dark text-white py-10 px-6 md:px-16 space-y-10 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur shadow-lg text-center flex flex-col justify-center items-center">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
            <FaCalendarAlt /> Calendar
          </h2>
          <Calendar
            onChange={setDate}
            value={date}
            className="text-black rounded shadow"
          />
        </div>

        <div className="bg-white/10 rounded-xl p-6 backdrop-blur shadow-lg text-center flex flex-col justify-center">
          <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
            <FaClock /> Time Left Today
          </h2>
          <p className="text-4xl font-mono mt-2 text-accent-light">
            {`${timeLeft.hrs}h ${timeLeft.mins}m ${timeLeft.secs}s`}
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-6 backdrop-blur shadow-lg text-center flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-2">Remaining Totals</h2>
          <p className="text-md">Hours Left: {timeLeft.hrs}</p>
          <p className="text-md">Minutes Left: {timeLeft.mins}</p>
          <p className="text-md">Seconds Left: {timeLeft.secs}</p>
          <p className="mt-2 text-sm text-gray-300">
            Total Seconds: {timeLeft.totalSecs}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur shadow-lg text-center flex flex-col justify-center">
          <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
            <FaClock /> Digital Clock
          </h2>
          <p className="text-5xl font-mono mt-4 text-blue-300">
            {new Date().toLocaleTimeString()}
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-6 backdrop-blur shadow-lg text-center flex flex-col justify-center">
          <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
            <FaBell /> Stopwatch
          </h2>
          <p className="text-4xl font-mono mt-2 text-yellow-300">
            {formatTime(stopwatch)}
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <button onClick={() => setRunning(true)} className="bg-green-600 px-4 py-2 rounded-full">
              <FaPlay />
            </button>
            <button onClick={() => setRunning(false)} className="bg-yellow-500 px-4 py-2 rounded-full">
              <FaPause />
            </button>
            <button onClick={() => { setRunning(false); setStopwatch(0); }} className="bg-red-500 px-4 py-2 rounded-full">
              <FaRedo />
            </button>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-6 backdrop-blur shadow-lg text-center">
          <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
            <FaHourglassEnd /> Pomodoro
          </h2>
          <div className="mt-4 flex items-center justify-center gap-4">
            <button onClick={() => adjustPomoTime(-60)} className="bg-blue-800 px-3 py-2 rounded-full">
              <FaMinus />
            </button>
            <div className="flex flex-col items-center">
              <p className="text-4xl font-mono text-blue-400">{formatTime(pomoTime)}</p>
              <p className="text-sm text-blue-300 mt-1">Microseconds: {(pomoTime * 1000).toLocaleString()} µs</p>
            </div>
            <button onClick={() => adjustPomoTime(60)} className="bg-blue-600 px-3 py-2 rounded-full">
              <FaPlus />
            </button>
          </div>
          <p className="mt-2 text-sm">Phase: {isBreak ? "Break" : "Focus"}</p>
          <div className="mt-4 flex justify-center items-center gap-3 flex-wrap">
            <button onClick={() => setIsPomoRunning(true)} className="bg-green-600 px-4 py-2 rounded-full">
              <FaPlay />
            </button>
            <button onClick={() => setIsPomoRunning(false)} className="bg-yellow-500 px-4 py-2 rounded-full">
              <FaPause />
            </button>
            <button onClick={() => { setIsPomoRunning(false); setPomoTime(25 * 60); setIsBreak(false); }} className="bg-red-500 px-4 py-2 rounded-full">
              <FaRedo />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur h-[500px] shadow-lg w-full text-center">
          <h2 className="text-xl font-semibold">Time Usage (Pie Chart)</h2>
          <Pie data={pieData} options={pieOptions} />
        </div>

        <div className="bg-white/10 rounded-xl p-6 backdrop-blur shadow-lg w-full text-center">
          <h2 className="text-xl font-semibold mb-4">Weekly Focus (Bar Chart)</h2>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default TimeAnalyze;
