import React, { useState } from "react";
import { FaTasks, FaClock, FaCheckCircle, FaPlus } from "react-icons/fa";

const TaskScheduler = () => {
  const [tasks, setTasks] = useState([
    { title: "Write daily journal", time: "08:00 AM", duration: "15 min", status: "Completed" },
    { title: "Team meeting", time: "10:30 AM", duration: "30 min", status: "Pending" },
    { title: "Code new feature", time: "01:00 PM", duration: "2 hrs", status: "In Progress" },
    { title: "Read tech blog", time: "04:30 PM", duration: "20 min", status: "Pending" },
  ]);

  const [newTask, setNewTask] = useState({ title: "", time: "", duration: "", status: "Pending" });

  const handleAddTask = () => {
    if (newTask.title && newTask.time && newTask.duration) {
      setTasks([...tasks, newTask]);
      setNewTask({ title: "", time: "", duration: "", status: "Pending" });
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur text-white rounded-xl p-6 shadow-lg w-full space-y-6">
      <h2 className="text-3xl font-bold flex items-center justify-center gap-2 text-blue-300">
        <FaTasks /> Today's Schedule
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-lg p-4 flex justify-between items-center shadow-sm"
            >
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FaCheckCircle
                    className={`$ {
                      task.status === "Completed"
                        ? "text-green-400"
                        : task.status === "In Progress"
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                  {task.title}
                </h3>
                <p className="text-sm text-gray-300">
                  <FaClock className="inline mr-1" /> {task.time} - {task.duration}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm $ {
                  task.status === "Completed"
                    ? "bg-green-600"
                    : task.status === "In Progress"
                    ? "bg-yellow-500"
                    : "bg-gray-600"
                }`}
              >
                {task.status}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white/5 p-4 rounded-lg shadow-inner space-y-4">
          <h3 className="text-xl font-semibold text-center text-accent-light">
            Add New Task
          </h3>
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Time (e.g., 09:00 AM)"
            value={newTask.time}
            onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
            className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Duration (e.g., 30 min)"
            value={newTask.duration}
            onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
            className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={handleAddTask}
            className="w-full bg-gradient-to-r from-gradientStartBlue to-gradientEndBlue text-white py-2 rounded flex items-center justify-center gap-2 hover:shadow-white-glow"
          >
            <FaPlus /> Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskScheduler;