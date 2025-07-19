const mongoose = require("mongoose");

const dailyJournalSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  list: {
    type: Array,
    required: true
  },
  tag: {
    type: Array,
  }
});

const DailyJournal = mongoose.model("DailyJournal", dailyJournalSchema);

module.exports = DailyJournal;
