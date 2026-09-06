"use client";
import JournalTracker from "../../../components/trackers/JournalTracker";
export default function Page() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="glass rounded-xl h-full">
        <JournalTracker />
      </div>
    </div>
  );
}
