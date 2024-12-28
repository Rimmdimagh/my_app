import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LandingPage.css'; // Custom CSS for the design
import logo from './logo.png'; // Adjust the name if necessary


const LandingPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await axios.get('http://localhost:5000/api/courses');
      setCourses(response.data);
    };
    fetchCourses();
  }, []);

  return (
    <div className="landing-page">
      {/* Logo Section */}
      <header className="site-header">
      <img src={logo} alt="Site Logo" className="logo" />
      </header>

      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <h1>Improve your skills on your own</h1>
          <h2>To prepare for a better future</h2>
          <button className="register-btn">REGISTER NOW</button>
        </div>
      </header>

      {/* Courses Section */}
      <section className="courses-section">
        <h2>Discover Our Courses</h2>
        <button className="view-more-btn">View More</button>
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <img
                src={`http://localhost:5000${course.image}`}
                alt={course.name}
              />
              <h3>{course.name}</h3>
              <p>{course.price} DT/Month</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2>Contact Us</h2>
        <form className="contact-form">
          <label htmlFor="name">NAME</label>
          <input id="name" type="text" placeholder="Jiara Martins" />
          <label htmlFor="email">EMAIL</label>
          <input id="email" type="email" placeholder="hello@reallygreatsite.com" />
          <label htmlFor="message">MESSAGE</label>
          <textarea id="message" placeholder="Write your message here"></textarea>
          <button type="submit" className="send-btn">Send the message</button>
        </form>
      </section>
    </div>
  );
};

export default LandingPage;
