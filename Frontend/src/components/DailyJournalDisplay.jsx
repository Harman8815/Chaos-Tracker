import React, { useState, useEffect } from "react";
import Card from "./journalCard"; // Import the Card component

const DailyJournalDisplay = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/dailyJounal/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-primary-dark shadow-neon-blue rounded-3xl px-24 py-24 mx-24 my-12 min-h-screen">
      <h1 className="text-white text-center text-5xl">Daily Journal</h1>
      <p className="text-white">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel
        malesuada nisi, non vulputate arcu. Donec vel neque vel purus fermentum
        congue at vel metus.
      </p>
      <div className="pt-12 grid grid-cols-3 gap-6">
        {data
          .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sorting by date, latest first
          .map((index) => {
            const formattedDate = new Date(index.date).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            );

            return (
              <Card
                key={index._id}
                formattedDate={formattedDate}
                list={index.list}
                tag={index.tag}
              />
            );
          })}
      </div>
    </div>
  );
};

export default DailyJournalDisplay;
