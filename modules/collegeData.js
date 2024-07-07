// Import the fs module to handle file system operations.
const fs = require('fs');

// Define the Data class to structure the student and course data.
class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

// Declare a variable to hold the data collection once it's initialized.
let dataCollection = null;

// Function to initialize the data collection by reading and parsing JSON files.
function initialize() {
    return new Promise((resolve, reject) => {
        // Read the students.json file.
        fs.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => {
            if (err) {
                // If there's an error reading the file, reject the promise.
                return reject("Unable to read students.json");
            }

            let students;
            try {
                // Try to parse the student data.
                students = JSON.parse(studentDataFromFile);
            } catch (parseErr) {
                // If parsing fails, reject the promise.
                return reject("Unable to parse students.json");
            }

            // Read the courses.json file.
            fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
                if (err) {
                    // If there's an error reading the file, reject the promise.
                    return reject("Unable to read courses.json");
                }

                let courses;
                try {
                    // Try to parse the course data.
                    courses = JSON.parse(courseDataFromFile);
                } catch (parseErr) {
                    // If parsing fails, reject the promise.
                    return reject("Unable to parse courses.json");
                }

                // Once both files are successfully read and parsed, create a new Data object.
                dataCollection = new Data(students, courses);
                // Resolve the promise to indicate successful initialization.
                resolve();
            });
        });
    });
}

// Function to get all students from the data collection.
function getAllStudents() {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.students.length > 0) {
            // If students exist in the data collection, resolve the promise with the student data.
            resolve(dataCollection.students);
        } else {
            // If no students are found, reject the promise.
            reject("No results returned");
        }
    });
}

// Function to get all courses from the data collection.
function getCourses() {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.courses.length > 0) {
            // If courses exist in the data collection, resolve the promise with the course data.
            resolve(dataCollection.courses);
        } else {
            // If no courses are found, reject the promise.
            reject("No results returned");
        }
    });
}

// Function to get all TAs (students who are TAs) from the data collection.
function getTAs() {
    return new Promise((resolve, reject) => {
        if (dataCollection) {
            // Filter the students to find those who are TAs.
            const TAs = dataCollection.students.filter(student => student.TA);
            if (TAs.length > 0) {
                // If TAs are found, resolve the promise with the TA data.
                resolve(TAs);
            } else {
                // If no TAs are found, reject the promise.
                reject("No results returned");
            }
        } else {
            // If dataCollection is not initialized, reject the promise.
            reject("No results returned");
        }
    });
}

// Function to get students by course from the data collection.
function getStudentsByCourse(course) {
    return new Promise((resolve, reject) => {
        if (dataCollection) {
            // Filter the students to find those who belong to the specified course.
            const studentsByCourse = dataCollection.students.filter(student => student.course == course);
            if (studentsByCourse.length > 0) {
                // If students are found, resolve the promise with the student data.
                resolve(studentsByCourse);
            } else {
                // If no students are found, reject the promise.
                reject("No results returned");
            }
        } else {
            // If dataCollection is not initialized, reject the promise.
            reject("No results returned");
        }
    });
}

// Function to get a student by student number from the data collection.
function getStudentByNum(num) {
    return new Promise((resolve, reject) => {
        if (dataCollection) {
            // Find the student whose studentNum matches the provided number.
            const student = dataCollection.students.find(student => student.studentNum == num);
            if (student) {
                // If a student is found, resolve the promise with the student data.
                resolve(student);
            } else {
                // If no student is found, reject the promise.
                reject("No results returned");
            }
        } else {
            // If dataCollection is not initialized, reject the promise.
            reject("No results returned");
        }
    });
}

// Function to add a new student to the data collection.
function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        if (dataCollection) {
            // Ensure TA status is properly set
            if (studentData.TA === undefined) {
                studentData.TA = false; // Default to false if TA status is not provided
            } else {
                studentData.TA = true; // Set to true if TA status is provided
            }

            // Calculate student number
            studentData.studentNum = dataCollection.students.length + 1;

            // Push the new student data into the collection
            dataCollection.students.push(studentData);

            // Resolve the promise indicating successful addition
            resolve();
        } else {
            // Reject the promise if dataCollection is not initialized
            reject("Data collection not initialized");
        }
    });
}

// Export the functions for use in other modules.
module.exports = {
    initialize,
    getAllStudents,
    getCourses,
    getTAs,
    getStudentsByCourse,
    getStudentByNum,
    addStudent
};
