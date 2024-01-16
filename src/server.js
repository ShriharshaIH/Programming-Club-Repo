const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment'); // Import the moment library

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
const uri='mongodb+srv://minip8681:kle123@cluster0.qbrivbz.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    
    if (user) {
      res.json({ message: 'Login successful!' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//for adminDashboard to add events:
const eventSchema = new mongoose.Schema({
  eventName: String,
  eventDate: String,
  eventLink: String,
  description: String, // New field for event description
});

const Event = mongoose.model('Event', eventSchema);

app.post('/api/add-event', async (req, res) => {
  try {
    const { eventName, eventDate, eventLink,description } = req.body;
    const event = new Event({ eventName, eventDate, eventLink, description });
    await event.save();
    res.json({ message: 'Event added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Get upcoming events endpoint
app.get('/api/upcoming-events', async (req, res) => {
  try {
    const today = moment(); // Use moment for current date

    const upcomingEvents = await Event.find({
      $expr: {
        $gte: [
          { $toDate: '$eventDate' }, // Convert eventDate to date
          today.toDate() // Convert moment to Date object
        ]
      }
    });

    res.json(upcomingEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// For adminDashboard to add results to past events:
const resultSchema = new mongoose.Schema({
  eventName: String,
  resultLink: String,
});

const Result = mongoose.model('Result', resultSchema);

app.post('/api/add-result', async (req, res) => {
  try {
    const { eventName, resultLink } = req.body;
    const result = new Result({ eventName, resultLink });
    await result.save();
    res.json({ message: 'Result added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/past-events', async (req, res) => {
  try {
    // Fetch past events with date earlier than today's date
    const today = moment();
    const events = await Event.find();
    const pastEvents = events.filter(event => {
      const eventDate = moment(event.eventDate, 'DD-MM-YYYY');
      return eventDate.isBefore(today, 'day');
    });

    res.json(pastEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get results endpoint
// Get results endpoint with additional information from events collection
app.get('/api/results', async (req, res) => {
  try {
    const resultsWithDetails = await Result.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'eventName',
          foreignField: 'eventName',
          as: 'eventDetails'
        }
      },
      {
        $project: {
          _id: 1,
          eventName: 1,
          resultLink: 1,
          eventDetails: {
            $arrayElemAt: ['$eventDetails', 0]
          }
        }
      }
    ]);

    res.json(resultsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
