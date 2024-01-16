import React, { useState, useEffect } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";
import {
  Link as ScrollLink,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
} from "react-scroll";
import LoginComp from "./loginComp";
import axios from "axios";

function App() {
  const [currentImage, setCurrentImage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [results, setResults] = useState([]);

  const [selectedOption, setSelectedOption] = useState("upcomingEvents");

  const handleLoginClick = () => {
    navigate("/login");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage % 3) + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const upcomingEventsResponse = await axios.get(
          "http://localhost:5000/api/upcoming-events"
        );
        setUpcomingEvents(upcomingEventsResponse.data);
        console.log(upcomingEvents); // Log upcomingEvents
        const resultsResponse = await axios.get(
          "http://localhost:5000/api/results"
        );
        setResults(resultsResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);
  
  const renderTable = (data) => {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            {selectedOption === "upcomingEvents" && <th>Date</th>}
            {selectedOption === "upcomingEvents" ? (
              <>
                <th>Link</th>
                <th>Description</th>
              </>
            ) : (
              <>
                <th>Result Link</th>
                <th>Date</th>
                <th>Description</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.eventName}</td>
              {selectedOption === "upcomingEvents" && <td>{item.eventDate}</td>}
              {selectedOption === "upcomingEvents" ? (
                <>
                  <td><a href={item.eventLink} target="_blank" rel="noopener noreferrer">{item.eventLink}</a></td>
                  <td>{item.description}</td>
                </>
              ) : (
                <>
                  <td><a href={item.resultLink} target="_blank" rel="noopener noreferrer">{item.resultLink}</a></td>
                  <td>{item.eventDetails ? item.eventDetails.eventDate : ''}</td>
                  <td>{item.eventDetails ? item.eventDetails.description : ''}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  
  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-menu">
          <li>
            <button className="butt" onClick={handleLoginClick}>
              AdminLogin
            </button>
          </li>
        </ul>
        <img
          src="https://www.mirlabs.org/ias22/images/viewfile.jpg"
          alt="Logo"
          className="logo"
          height="50px"
          width="220px"
        />
      </nav>

      <Element name="home" className="element">
        <div className="full-screen-background">
          <div className="image-overlay">
            <h1>Welcome to Programming Club</h1>
          </div>
          <img
            src={`${currentImage}.jpg`}
            alt={`coding-event-${currentImage}`}
          />
        </div>
      </Element>

      <div className="dropdown">
        <label htmlFor="options">Choose an option:</label>
        <select
          id="options"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="upcomingEvents">Upcoming Events</option>
          <option value="results">Results</option>
        </select>
      </div>

      <div className="section">
        <h2>
          {selectedOption === "upcomingEvents" ? "Upcoming Events" : "Results"}
        </h2>
        {selectedOption === "upcomingEvents"
          ? renderTable(upcomingEvents)
          : renderTable(results)}
      </div>
    </div>
  );
}

export default App;
