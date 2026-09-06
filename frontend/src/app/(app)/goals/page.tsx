"use client";
import GoalTracker from "../../../components/trackers/GoalTracker";
export default function Page() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="glass rounded-xl h-full">
        <GoalTracker />
      </div>
    </div>
  );
}
