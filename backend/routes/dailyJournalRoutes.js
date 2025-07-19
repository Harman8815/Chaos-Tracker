const express = require('express');
const DailyJournal = require('../models/DailyJournal');
const router = express.Router();

router.post('/', async (req, res) => {
  const { date, journalEntry, tag } = req.body;
  console.log(req.body);
  if (!date || !journalEntry) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newJournal = new DailyJournal({ date, list: [journalEntry], tag: [tag] });
    await newJournal.save();
    res.status(201).json(newJournal);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: 'Error creating task', error: err });
  }
});

router.patch('/', async (req, res) => {
  let { date, journalEntry, tag } = req.body;
  console.log(req.body);

  if (!date || !journalEntry) {
    return res.status(400).json({ message: 'Date and journal entry are required' });
  }

  if (!tag) tag = ""; // Default to empty string if no tag is provided

  const formattedDate = new Date(date);

  if (isNaN(formattedDate)) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  try {
    const updatedJournal = await DailyJournal.findOneAndUpdate(
      { date: formattedDate },
      {
        $push: { list: journalEntry }, // Push journal entry to the `list` array
        $addToSet: { tag: tag } // Add tag to the `tag` array if it's not already present
      },
      { new: true }
    );

    if (!updatedJournal) {
      const newJournal = new DailyJournal({ date, list: [journalEntry], tag: [tag] });
      await newJournal.save();
      return res.status(201).json(newJournal);
    }

    res.status(200).json(updatedJournal);
  } catch (err) {
    console.error("Error updating journal entry:", err);
    res.status(500).json({ message: 'Error updating journal entry', error: err });
  }
});


router.get('/all', async (req, res) => {
  try {
    const journals = await DailyJournal.find();
    res.status(200).json(journals);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: 'Error fetching tasks', error: err });
  }
});

module.exports = router;
