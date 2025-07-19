import React, { useState } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaTasks,
  FaCalendarAlt,
  FaClipboard,
  FaChartBar,
  FaBullseye,
  FaHourglass,
  FaBook,
  FaClock,
} from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import { IoMdCloseCircleOutline } from "react-icons/io";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { path: "/", icon: <FaHome />, label: "Home" },
    { path: "/habit-tracker", icon: <FaCalendarAlt />, label: "Habit Tracker" },
    { path: "/daily", icon: <FaClipboard />, label: "Daily" },
    { path: "/task-scheduler", icon: <FaTasks />, label: "Task Scheduler" },
    { path: "/daily-journal", icon: <FaBook />, label: "Daily Journal" },
    { path: "/progress-section", icon: <FaChartBar />, label: "Progress Section" },
    { path: "/goal-section", icon: <FaBullseye />, label: "Goal Section" },
    { path: "/time-analyzer", icon: <FaHourglass />, label: "Time Analyzer" },
    { path: "/my-timeline", icon: <FaClock />, label: "My Timeline" },
  ];

  return (
    <nav
      className={clsx(
        "fixed z-10 h-screen bg-primary-dark text-secondary  flex flex-col px-4",
        menuOpen ? "w-[200px]" : "w-auto"
      )}
    >
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        className="mb-4 mt-4 text-3xl mx-auto cursor-pointer"
      >
        {menuOpen ? <IoMdCloseCircleOutline /> : <TiThMenu />}
      </div>

      {/* Expanded Menu */}
      {menuOpen && (
        <ul className="text-lg space-y-10 pt-6">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className="flex items-center gap-2 text-secondary hover:text-secondary-light">
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Collapsed Menu */}
      {!menuOpen && (
        <ul className="text-2xl space-y-8 pt-6 flex flex-col items-center">
          {menuItems.map((item) => (
            <li key={item.path} className="hover:text-secondary-light">
              <Link to={item.path}>{item.icon}</Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
