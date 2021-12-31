const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI;

const dbConnection = async () => {
  try {
    await mongoose.connect(url);
    console.log('connected to mongoDB');
  } catch (error) {
    console.log('error connecting to mongoDB', error.message);
  }
};

dbConnection();

const noteSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    minlength: 5,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Note', noteSchema);
