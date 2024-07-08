/*********************************************************************************
*  WEB700 – Assignment 3
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Pamela Daisy Ferrao   Student ID: 138230230    Date: 2024-06-18

*Online (vercel) link: https://assignment-4-pamela-daisy-ferraos-projects.vercel.app/

********************************************************************************/

var express = require("express"); // Import Express.js framework
var path = require("path"); // Import path module to handle file paths
var bodyParser = require("body-parser"); // Import body-parser to handle form data
var collegeData = require("./modules/collegeData.js"); // Import the module containing college data functions

var app = express(); // Create an Express application instance
var PORT = process.env.PORT || 8080; // Define the port to run the server on, using environment variable or default to 8080

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the "public" folder
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Route to get all Students
app.get("/students", function(req, res) {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course) // Fetch students by course if course query parameter is provided
            .then(function(data) {
                res.json(data); // Send the student data as a JSON response
            })
            .catch(function(err) {
                res.json({ message: "No results" }); // Send JSON response with an error message if no data found
            });
    } else {
        collegeData.getAllStudents() // Fetch all students if no course query parameter is provided
            .then(function(data) {
                res.json(data); // Send all students data as JSON response
            })
            .catch(function(err) {
                res.json({ message: "No results" }); // Send JSON response with an error message if no data found
            });
    }
});

// Route to get all TAs
app.get("/tas", function(req, res) {
    collegeData.getTAs() // Call the getTAs function from collegeData module
        .then(function(data) {
            res.json(data); // Send the JSON response with all TAs data
        })
        .catch(function(err) {
            res.json({ message: "No results" }); // Send an error message if no data is found
        });
});

// Route to get all courses
app.get("/courses", function(req, res) {
    collegeData.getCourses() // Call the getCourses function from collegeData module
        .then(function(data) {
            res.json(data); // Send the JSON response with all courses data
        })
        .catch(function(err) {
            res.json({ message: "No results" }); // Send an error message if no data is found
        });
});

// Route to get a student by their student number
app.get("/student/:num", function(req, res) {
    collegeData.getStudentByNum(req.params.num) // Call the getStudentByNum function from collegeData module with the student number as parameter
        .then(function(data) {
            res.json(data); // Send the JSON response with the student data
        })
        .catch(function(err) {
            res.json({ message: "No results" }); // Send an error message if no data is found
        });
});

// Route for the home page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/home.html")); // Send the home.html file as the response
});

// Route for the about page
app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/about.html")); // Send the about.html file as the response
});

// Route for the HTML demo page
app.get("/htmlDemo", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/htmlDemo.html")); // Send the htmlDemo.html file as the response
});

// Route to render the form for adding a new student
app.get("/students/add", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/addStudent.html")); // Send the addStudent.html file as the response
});

// Route to handle form submission and add new student
app.post("/students/add", function(req, res) {
    collegeData.addStudent(req.body) // Call the addStudent function from collegeData module with form data
        .then(function() {
            res.redirect("/students"); // Redirect to the students page after adding the student
        })
        .catch(function(err) {
            res.send("Unable to add student"); // Send an error message if unable to add the student
        });
});

// Handle 404 errors
app.use(function(req, res) {
    res.status(404).send("Page Not Found"); // Send a 404 error message if the route is not found
});

// Start the server
collegeData.initialize()
    .then(function() {
        app.listen(PORT, function() { // this code starts the server and listens on the specified port
            console.log("Server listening on port " + PORT); // Log a message on the console indicating that the server is running
        });
    })
    .catch(function(err) {
        console.log("Unable to start server: " + err);
    });
