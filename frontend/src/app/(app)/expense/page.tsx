"use client";
import ExpenseTracker from "../../../components/trackers/ExpenseTracker";
export default function Page() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="glass rounded-xl h-full">
        <ExpenseTracker />
      </div>
    </div>
  );
}
