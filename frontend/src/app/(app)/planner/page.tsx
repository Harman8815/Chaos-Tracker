"use client";
import Planner from "../../../components/trackers/Planner";
export default function Page() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="glass rounded-xl h-full">
        <Planner />
      </div>
    </div>
  );
}
