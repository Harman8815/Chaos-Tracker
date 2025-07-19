import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Core Components
import NavBar from "./components/NavBar";
import Home from "./components/Home";

// Daily Utilities
import Daily from "./components/Daily/Daily";
import DailyJournal from "./section/DailyJournal";

// Planning & Scheduling
import TaskScheduler from "./components/TaskScheduler/TaskScheduler";
import HabbitTracker from "./components/HabbitTracker";
import Goals from "./components/Goals/Goals";

// Analysis & Visualization
import TimeAnalyze from "./components/TimeAnalyze/TimeAnalyze";
import ProgressSection from "./components/ProgressSection/ProgressSection";
import MyTimeline from "./components/MyTimeline/MyTimeline";

const App = () => {
  return (
    <Router>
      <div className="flex flex-row">
        <NavBar />
        <main className="flex-grow ml-[60px] ">
          <Routes>
            {/* Core */}
            <Route path="/" element={<Home />} />

            {/* Daily Section */}
            <Route path="/daily" element={<Daily />} />
            <Route path="/daily-journal" element={<DailyJournal />} />

            {/* Planning & Scheduling */}
            <Route path="/task-scheduler" element={<TaskScheduler />} />
            <Route path="/habit-tracker" element={<HabbitTracker />} />
            <Route path="/goal-section" element={<Goals />} />

            {/* Analytics & Insights */}
            <Route path="/time-analyzer" element={<TimeAnalyze />} />
            <Route path="/progress-section" element={<ProgressSection />} />
            <Route path="/my-timeline" element={<MyTimeline />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
