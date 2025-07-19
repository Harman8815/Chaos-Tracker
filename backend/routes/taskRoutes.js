const express = require('express');
const Task = require('../models/Tasks');
const router = express.Router();

// Create Task
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  console.log(name);
  try {
    const newTask = new Task({ name, description });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err });
  }
});

// Get All Tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err });
  }
});

module.exports = router;
