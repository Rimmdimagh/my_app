const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// MongoDB Schema and Model
const courseSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
});
const Course = mongoose.model('Course', courseSchema);

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses' });
    }
});

// Add a new course
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, price } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const newCourse = new Course({ name, price, image: imagePath });
        await newCourse.save();

        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: 'Error adding course' });
    }
});

// Update an existing course
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        const updatedData = {
            name,
            price,
        };

        // Si une nouvelle image est ajoutée
        if (req.file) {
            updatedData.image = `/uploads/${req.file.filename}`;
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: 'Error updating course' });
    }
});

// Delete a course
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCourse = await Course.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course' });
    }
});

module.exports = router;
