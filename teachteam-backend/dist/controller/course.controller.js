"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourses = void 0;
const data_source_1 = require("../data-source");
const Course_1 = require("../entity/Course");
const getCourses = async (req, res) => {
    try {
        const courseRepository = data_source_1.AppDataSource.getRepository(Course_1.Course);
        const courses = await courseRepository.find();
        res.json(courses);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch courses", error });
    }
};
exports.getCourses = getCourses;
