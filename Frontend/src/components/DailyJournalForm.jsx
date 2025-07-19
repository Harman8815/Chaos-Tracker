import React, { useState, useEffect } from "react";

const DailyJournalForm = () => {
  const [date, setDate] = useState("");
  const [tag, setTag] = useState("coding");
  const [journalEntry, setJournalEntry] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    setDate(currentDate.toISOString().split("T")[0]);
    setTag("coding");
    setJournalEntry("");
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const entry = {
      date,
      tag,
      journalEntry,
    };
    console.log(entry);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/dailyJounal/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Journal Entry Submitted:", data);
      } else {
        console.error("Error submitting journal entry:", response.statusText);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="bg-primary-dark flex flex-row justify-between   mx-32 my-12 ">
      <div className="   shadow-neon-blue  rounded-3xl py-5 px-10">
        <h2 className="text-accent-light text-3xl font-bold py-3 text-center">
          Enter New Journal
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          {/* Date Input */}
          <div className="flex flex-row gap-9">
            <div className="mb-4 ">
              <label className="block mb-2 font-medium text-accent-light ">
                Date:
              </label>
              <input
                type="date"
                className="border rounded px-3 py-2 w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            {/* Tag Input */}
            <div className="mb-4 w-48">
              <label className="block mb-2 font-medium text-accent-light ">
                Tag:
              </label>
              <select
                className="border rounded px-3 py-2 w-full"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                {["coding", "development", "study", "work"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Journal Entry */}
          <div className="mb-4 w-[400px] ">
            <label className="block mb-2 font-medium text-accent-light ">
              Journal Entry:
            </label>
            <textarea
              className="border rounded px-3 py-2 w-full"
              rows="4"
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex flex-row justify-center w-full ">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 "
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className=" shadow-neon-blue">
        <img
          src="https://via.placeholder.com/400
"
          alt=""
        />
      </div>
    </div>
  );
};

export default DailyJournalForm;
