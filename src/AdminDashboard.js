import React, { useState,useEffect } from 'react';
import axios from 'axios';
import "./AdminDashboard.css";
const AdminDashboard = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedOption, setSelectedOption] = useState('addNewEvent');
  const [pastEvents, setPastEvents] = useState([]);
  const [selectedPastEvent, setSelectedPastEvent] = useState('');



  useEffect(() => {
    // Fetch past events from the server
    const fetchPastEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/past-events');
        setPastEvents(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPastEvents();
  }, []);


  const handleAddEvent = async () => {
    try {
      // Send a POST request to your server to add a new event
      await axios.post('http://localhost:5000/api/add-event', {
        eventName,
        eventDate,
        eventLink,
        description: eventDescription, // Include description in the request
      });
      alert('Event added successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add event. Please try again.');
    }
  };

  const handleAddResult = async () => {
    try {
      await axios.post('http://localhost:5000/api/add-result', {
        eventName: selectedPastEvent,
        resultLink: eventLink,
      });
      alert('Result added successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add result. Please try again.');
    }
  };



  return (
    <div className="admin-dashboard">
      <div className="klelogo">
        <img
          src="https://www.mirlabs.org/ias22/images/viewfile.jpg"
          alt="Logo"
          className="logo"
          height="50px"
          width="220px"
        />
      </div>
      
      <h2 id="heading"><b>Welcome to the Admin Dashboard</b></h2>

      <div className="admin-options">
        <label id="sheading"><b>Add New Event</b>
          <input
            type="radio"
            value="addNewEvent"
            checked={selectedOption === 'addNewEvent'}
            onChange={() => setSelectedOption('addNewEvent')}
          />
          
        </label>

        <label id="sheading"><b>Add Result to Past Events</b>
          <input
            type="radio"
            value="addResult"
            checked={selectedOption === 'addResult'}
            onChange={() => setSelectedOption('addResult')}
          />
          
        </label>
      </div>

      {selectedOption === 'addNewEvent' && (
        <div className="admin-form">
          <label>Event Name:</label>
          <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />

          <label>Event Date:</label>
          <input type="text" placeholder="dd-mm-yyyy" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />

          <label>Event Link:</label>
          <input type="text" value={eventLink} onChange={(e) => setEventLink(e.target.value)} />

          <label>Event Description:</label>
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          ></textarea>

          <button onClick={handleAddEvent}>Add Event</button>
        </div>
      )}

      {selectedOption === 'addResult' && (
        <div className="admin-form">
          <label>Select Past Event:</label>
          <select value={selectedPastEvent} onChange={(e) => setSelectedPastEvent(e.target.value)}>
            <option value="">Select an event</option>
            {pastEvents.map((event) => (
              <option key={event._id} value={event.eventName}>
                {event.eventName}
              </option>
            ))}
          </select>

          <label>Result Link:</label>
          <input type="text" value={eventLink} onChange={(e) => setEventLink(e.target.value)} />

          <button onClick={handleAddResult}>Add Result</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
