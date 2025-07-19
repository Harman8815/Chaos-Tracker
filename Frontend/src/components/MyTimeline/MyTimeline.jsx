import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaPlus } from "react-icons/fa";

const initialTimeline = [
  {
    month: "January",
    achieved: ["Completed UI for Dashboard", "Integrated MongoDB"],
    pending: ["Setup CI/CD"],
  },
  {
    month: "February",
    achieved: ["Deployed MVP", "Added login auth"],
    pending: ["Improve animations", "Write unit tests"],
  },
  {
    month: "March",
    achieved: ["Added analytics section"],
    pending: ["Create mobile version"],
  },
];

const MyTimeline = () => {
  const [timeline, setTimeline] = useState(initialTimeline);
  const [form, setForm] = useState({
    month: "",
    type: "achieved",
    goal: "",
  });

  const handleAdd = () => {
    if (!form.month || !form.goal) return;
    setTimeline((prev) => {
      const monthExists = prev.find((item) => item.month === form.month);
      if (monthExists) {
        return prev.map((item) =>
          item.month === form.month
            ? {
                ...item,
                [form.type]: [...item[form.type], form.goal],
              }
            : item
        );
      } else {
        return [
          ...prev,
          {
            month: form.month,
            achieved: form.type === "achieved" ? [form.goal] : [],
            pending: form.type === "pending" ? [form.goal] : [],
          },
        ];
      }
    });
    setForm({ month: "", type: "achieved", goal: "" });
  };

  return (
    <div className="bg-primary-dark text-white px-6 md:px-16 py-12 space-y-12">
      <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-gradientStartBlue to-gradientEndBlue">
        Monthly Timeline
      </h2>

      <div className="relative max-w-3xl mx-auto space-y-10 before:absolute before:left-4 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-gradientStartBlue before:to-gradientEndBlue before:rounded-full">
        {timeline.map((month, index) => (
          <div key={index} className="relative pl-12">
            <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-300 shadow-white-glow" />
            <h3 className="text-2xl font-semibold mb-2">{month.month}</h3>
            <div className="space-y-1 ml-2">
              {month.achieved.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-green-400">
                  <FaCheckCircle /> <span>{item}</span>
                </div>
              ))}
              {month.pending.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-yellow-300">
                  <FaTimesCircle /> <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Goal Form */}
      <div className="max-w-xl mx-auto bg-white/5 p-6 rounded-xl space-y-4 shadow-white-light">
        <h3 className="text-xl font-semibold text-center text-accent">
          Add New Goal
        </h3>
        <input
          type="text"
          placeholder="Month (e.g., April)"
          value={form.month}
          onChange={(e) => setForm({ ...form, month: e.target.value })}
          className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-400 focus:outline-none"
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full p-2 rounded bg-white/10 text-white focus:outline-none"
        >
          <option value="achieved">Achieved</option>
          <option value="pending">Pending</option>
        </select>
        <input
          type="text"
          placeholder="Goal Description"
          value={form.goal}
          onChange={(e) => setForm({ ...form, goal: e.target.value })}
          className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={handleAdd}
          className="w-full py-2 bg-gradient-to-r from-gradientStartBlue to-gradientEndBlue text-white rounded flex items-center justify-center gap-2 hover:shadow-white-glow"
        >
          <FaPlus /> Add Goal
        </button>
      </div>
    </div>
  );
};

export default MyTimeline;
