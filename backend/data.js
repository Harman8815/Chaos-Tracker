const mongoose = require('mongoose');
const HabitDay = require('./models/Habbitday');  // Assuming you have your models in 'models/Habitday.js'
const Task = require('./models/Tasks');  // Assuming Task model is in 'models/Task.js'

// Your table dataHabitday
const tableData = [
  ["Wake up Early", "10", "9", "10", "9", "5", "10", "8", "9", "10", "7", "10","10", "10", "10", "8", "9", "9", "5", "10", "7", "7", "7", "8", "8", "7", "7", "6", "7", "7", "8", "10", "200"],
  ["Workout", "8", "8", "6", "6", "5", "5", "0", "5", "5", "7", "8", "7", "7", "0","0", "7", "7", "5", "7", "4", "8", "4", "7", "5", "8", "3", "8", "8", "5", "5", "0",  "200"],
  ["Read", "6", "10", "8", "7", "0", "0", "0", "9", "10", "8", "0", "8", "7", "5", "0", "9", "0", "0", "4", "0", "4", "0", "7", "0", "0", "5", "0", "5", "0", "0", "0",  "200"],
  ["DSA", "2", "6", "2", "6", "2", "2", "3", "4", "3", "3", "6", "3", "3", "3", "3", "9", "3", "3", "7", "4", "3", "6", "5", "4", "4", "6", "3", "3", "4", "2", "2", "100"],
  ["Study", "0", "8", "0", "0", "0", "0", "5", "7", "0", "0", "4", "1", "3", "7", "0", "0", "0", "3","3", "4", "4", "0", "3", "0", "0", "7", "6", "7", "0", "0", "0",  "200"],
  ["Project", "8", "0", "0", "2", "5", "0", "3", "5", "1", "9", "0", "0", "7", "7", "10", "5", "10", "6", "1", "6", "5", "8", "0", "5", "7", "0", "7", "7", "0", "0", "0", "200"],
  ["Learning", "0", "0", "0", "0", "0", "5", "0", "3", "0", "5", "0", "0", "0", "8", "7", "9", "0", "0", "0", "6", "1", "6", "5", "5", "0", "3", "1", "0", "6", "8", "8", "200"],
];

const year = 2025;
const month = 1;
const days = 31;
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ChaosTracker', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    insertData();
  })
  .catch((err) => console.log('Error connecting to MongoDB:', err));

async function insertData() {
  for (let i = 0; i < tableData.length; i++) {
    const habitData = tableData[i];

    // Check if the task already exists
    let task = await Task.findOne({ name: habitData[0] });

    // If task does not exist, create a new task
    if (!task) {
      task = new Task({ name: habitData[0] });
      await task.save();
    }

    // Ensure the habit data has 30 days, if not, fill with zero
    let values = habitData.slice(1, days + 1).map(Number); // Days 1 to 30
    while (values.length < days) {
      values.push(0); // Fill with 0 if there are fewer than 30 values
    }
    let goal = parseFloat(habitData[habitData.length-1]) //
    // Create and save the HabitDay record
    const habitDayData = new HabitDay({
      year,
      month,
      taskId: task._id,
      values, // Array of values for the habit data
      goal
    });

    await habitDayData.save();

    console.log(`Data inserted for task: ${habitData[0]}`);
  }

  console.log('All data inserted successfully!');
  mongoose.connection.close();
}
