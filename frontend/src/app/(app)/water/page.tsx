"use client";
import WaterTracker from "../../../components/trackers/WaterTracker";
export default function Page() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="glass rounded-xl h-full">
        <WaterTracker />
      </div>
    </div>
  );
}
