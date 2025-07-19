import React from "react";
import { FaSun, FaMoon, FaCheckCircle, FaRegCircle } from "react-icons/fa";

const dailySchedule = [
  {
    label: "Morning",
    icon: <FaSun />,
    tasks: [
      { task: "Wake up & stretch", done: true },
      { task: "Check emails", done: false },
      { task: "Code for 1 hour", done: true },
    ],
  },
  {
    label: "Afternoon",
    icon: <FaSun />,
    tasks: [
      { task: "Attend team meeting", done: true },
      { task: "Push commits", done: false },
    ],
  },
  {
    label: "Evening",
    icon: <FaSun />,
    tasks: [
      { task: "Workout", done: true },
      { task: "Watch a tech video", done: false },
    ],
  },
  {
    label: "Night",
    icon: <FaMoon />,
    tasks: [
      { task: "Write daily summary", done: false },
      { task: "Read 10 pages", done: true },
    ],
  },
];

const Daily = () => {
  return (
    <div className="bg-primary-dark min-h-screen text-white py-10 px-6 md:px-16 space-y-10 font-sans">
      <h2 className="text-3xl font-bold text-center text-gradient-to-r from-gradientStartGreen to-gradientEnd shadow-white-glow">
        Daily Routine Tracker
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dailySchedule.map((section, index) => (
          <div key={index} className="bg-white/10 p-6 rounded-xl shadow-custom space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-accent">
              {section.icon} {section.label}
            </h3>
            <div className="space-y-2">
              {section.tasks.map((item, idx) => (
                <p key={idx} className="flex items-center gap-2">
                  {item.done ? (
                    <FaCheckCircle className="text-green-400" />
                  ) : (
                    <FaRegCircle className="text-yellow-300" />
                  )}
                  {item.task}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Daily;
