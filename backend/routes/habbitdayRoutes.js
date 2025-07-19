const express = require('express');
const HabitDay = require('../models/Habbitday');
const router = express.Router();

router.patch('/', async (req, res) => {
  const { year, month, values, taskId, goal } = req.body;

  try {
    console.log("Request Body:", req.body);

    let habitDay = await HabitDay.findOne({ taskId, month, year });
    console.log("Found HabitDay:", habitDay);

    if (habitDay) {
      habitDay.values = values;
      habitDay.goal = goal;
      console.log("Updating HabitDay:", habitDay);
      await habitDay.save();
    } else {
      habitDay = new HabitDay({
        taskId,
        year,
        month,
        values: values,
        goal,
      });
      console.log("Creating New HabitDay:", habitDay);
      await habitDay.save();
    }

    res.status(200).json(habitDay);
  } catch (err) {
    console.error("Error updating HabitDay:", err);
    res.status(500).json({ message: 'Error updating HabitDay', error: err });
  }
});


router.get('/', async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: 'Month and Year are required.' });
  }

  try {
    const habitData = await HabitDay.find({ month: month, year: year });

    if (!habitData || habitData.length === 0) {
      return res.status(404).json({ message: 'HabitDay not found for this month and year.' });
    }

    res.status(200).json(habitData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching HabitDay', error: err });
  }
});


module.exports = router;
