import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminPage = () => {
    const [courses, setCourses] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [editingCourse, setEditingCourse] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/courses');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    const handleAddCourse = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        if (image) formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:5000/api/courses', formData);
            setCourses([...courses, response.data]);
            setName('');
            setPrice('');
            setImage(null);
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        if (image) formData.append('image', image);

        try {
            const response = await axios.put(
                `http://localhost:5000/api/courses/${editingCourse._id}`,
                formData
            );
            setCourses(courses.map(course => (course._id === editingCourse._id ? response.data : course)));
            closeModal();
        } catch (error) {
            console.error('Error updating course:', error);
        }
    };

    const handleDeleteCourse = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/courses/${id}`);
            setCourses(courses.filter(course => course._id !== id));
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const openModal = (course) => {
        setEditingCourse(course);
        setName(course.name);
        setPrice(course.price);
        setImage(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setEditingCourse(null);
        setName('');
        setPrice('');
        setImage(null);
        setShowModal(false);
    };

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <div className="sidebar">
                <h2>Admin Dashboard</h2>
                <ul>
                    <li><a href="#dashboard">Dashboard</a></li>
                    <li><a href="#courses">Courses</a></li>
                    <li><a href="#settings">Settings</a></li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <header>
                    <h1>Welcome to the Admin Panel</h1>
                </header>

                <section id="add-course">
                    <h2>Add New Course</h2>
                    <form onSubmit={handleAddCourse}>
                        <label>Course Name:</label>
                        <input
                            type="text"
                            placeholder="Course Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <label>Price:</label>
                        <input
                            type="number"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <label>Image:</label>
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        <button type="submit">Add Course</button>
                    </form>
                </section>

                <section id="courses">
                    <h2>All Courses</h2>
                    <div className="course-grid">
                        {courses.map(course => (
                            <div key={course._id} className="course-card">
                                <img
                                    src={`http://localhost:5000${course.image}`}
                                    alt={course.name}
                                />
                                <h3>{course.name}</h3>
                                <p>{course.price} DT/Month</p>
                                <button onClick={() => openModal(course)}>Edit</button>
                                <button onClick={() => handleDeleteCourse(course._id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Course</h2>
                        <form onSubmit={handleUpdateCourse}>
                            <label>Course Name:</label>
                            <input
                                type="text"
                                placeholder="Course Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label>Price:</label>
                            <input
                                type="number"
                                placeholder="Price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <label>Image:</label>
                            <input
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={closeModal}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
