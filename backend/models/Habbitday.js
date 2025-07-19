const mongoose = require('mongoose');

const habitDaySchema = new mongoose.Schema({
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  values: { type: [Number], required: true },  
  goal: { type: Number, required: true },
});

const HabitDay = mongoose.model('HabitDay', habitDaySchema);

module.exports = HabitDay;
