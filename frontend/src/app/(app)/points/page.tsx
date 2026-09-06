"use client";
import PointsTracker from "../../../components/trackers/PointsTracker";
export default function Page() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="glass rounded-xl p-6 h-full">
        <PointsTracker />
      </div>
    </div>
  );
}
