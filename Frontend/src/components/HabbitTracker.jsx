import React, { useState, useEffect } from "react";

const HabitTracker = () => {
  const [editable, setEditable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [taskGoals, setTaskGoals] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  let daysInMonth = getDaysInMonth(year, month);
  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  const fetchHabitData = async () => {

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/habbitday?month=${month}&year=${year}`
      );
      const data = await response.json();
      if (!data) return null;

      const formattedData = data.map((taskData) => {
        const task = taskList.find(
          (task) => task.taskId === taskData.taskId
        ) || { taskName: "Unknown Task" };
        const taskName = task.taskName;
        const values = taskData.values || [];
        return [taskName, ...values];
      });

      setTableData([
        [
          "Task",
          ...Array.from(
            { length: getDaysInMonth(year, month) },
            (_, i) => `${i + 1}`
          ),
        ],
        ...formattedData,
      ]);

      const taskGoalsData = data.reduce((acc, rawdata) => {
        const task = taskList.find(
          (task) => task.taskId === rawdata.taskId
        ) || { taskName: "Unknown Task", taskId: null };
        const goal = rawdata.goal || 0;

        acc.push({
          taskId: task.taskId,
          taskName: task.taskName,
          goal: goal,
        });

        return acc;
      }, []);

      setTaskGoals(taskGoalsData);
      daysInMonth = getDaysInMonth(year, month);
    } catch (error) {
      console.error("Error fetching habit data:", error);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/tasks");
        const data = await response.json();

        if (Array.isArray(data)) {
          const taskMapping = data.map((task, index) => ({
            taskId: task._id,
            taskName: task.name,
          }));

          setTaskList(taskMapping);
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    fetchHabitData();
  }, [month, year, taskList]);

  const handleInputChange = (rowIndex, cellIndex, newValue) => {
    rowIndex += 1;
    setTableData((prevTableData) => {
      const updatedTableData = [...prevTableData];
      updatedTableData[rowIndex][cellIndex] = newValue;
      return updatedTableData;
    });
  };

  const save = async () => {
    for (let i = 1; i < tableData.length; i++) {
      const taskName = tableData[i][0];
      const task = taskList.find((task) => task.taskName === taskName);

      const payload = {
        month: month,
        year: year,
        taskId: task.taskId,
        values: tableData[i].slice(1),
        goal: taskGoals.find((goal) => goal.taskName === task.taskName).goal,
      };

      try {
        const response = await fetch("http://127.0.0.1:5000/api/habbitday", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Data saved successfully:", result);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }
  };

  return (
    <div className="bg-primary-dark min-h-screen p-4">
      <div className="flex justify-end items-center mb-4">
        <label className="text-white flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            onChange={(e) => setEditable(e.target.checked)}
          />
          Editable
        </label>
      </div>

      <div className="myTable bg-white rounded shadow p-4 overflow-auto">
       
        <table className="w-full border-collapse border text-center border-gray-300">
        <thead>
  <tr>
    
  <th className="border border-gray-300 px-2 py-1">Task</th>
    {/* Render headers for the first row of tableData, limited to daysInMonth */}
    {Array.from({ length: daysInMonth }, (_, index) => (
      <th key={index} className="border border-gray-300 px-2 py-1">
        {index + 1}
      </th>
    ))}
    {/* Add fixed columns for Total and Goal */}
    <th className="border border-gray-300 px-2 py-1">Total</th>
    <th className="border border-gray-300 px-2 py-1">Goal</th>
  </tr>
</thead>

          <tbody>
            {tableData.slice(1).map((row, rowIndex) => {
              const taskName = row[0];
              const taskGoal = taskGoals.find(
                (task) => task.taskName === taskName
              );
              const goal = taskGoal ? taskGoal.goal : 0;

              const rowTotal = row
                .slice(1)
                .reduce((sum, cell) => sum + (parseInt(cell) || 0), 0);

              return (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${rowIndex}-${cellIndex}`}
                      className="border border-gray-300 px-2 py-1"
                    >
                      {cellIndex > 0 && editable ? (
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) =>
                            handleInputChange(
                              rowIndex,
                              cellIndex,
                              e.target.value
                            )
                          }
                          className="w-full bg-transparent"
                        />
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                  <td className="border border-gray-300 px-2 py-1">
                    {rowTotal}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">{goal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bottomContainer mt-8 flex flex-row align-center justify-between">
        <div className="searchDropDown flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <select
              className="border border-gray-300 rounded px-2 py-1"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              <option value={1}>January</option>
              <option value={2}>February</option>
              <option value={3}>March</option>
              <option value={4}>April</option>
              <option value={5}>May</option>
              <option value={6}>June</option>
              <option value={7}>July</option>
              <option value={8}>August</option>
              <option value={9}>September</option>
              <option value={10}>October</option>
              <option value={11}>November</option>
              <option value={12}>December</option>
            </select>
            <select
              className="border border-gray-300 rounded px-2 py-1"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
            <button
              onClick={fetchHabitData}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Fetch
            </button>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={save}
          >
            Save
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Create Backup
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
            Restore
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
