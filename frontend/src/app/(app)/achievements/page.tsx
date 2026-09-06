"use client";
import Achievements from "../../../components/trackers/Achievements";
export default function Page() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="glass rounded-xl p-6 h-full">
        <Achievements />
      </div>
    </div>
  );
}
