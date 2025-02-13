// Import Express.js
const express = require('express');
// Create an Express application
const app = express();
const User = require('./models/User');

require('dotenv').config();
// Define the port number FOR THE SERVER
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error:', error);
});


// Built-in middleware functions in Express.js
app.use(express.json()); // for parsing application/json requests
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded requests

// //Custom middleware function
// app.use((req, res, next) => {
//     console.log('Request received at:', new Date().toLocaleString());
//     next();
// });

// // Define the route for the homepage
// app.get('/', (req, res) => {
//     res.send('Welcome to the homepage!');
// });

// app.get('/about', (req, res) => {
//     res.send('This is the about page!');
// });

// // Dynamic route: Accepts use ID as a parameter
// app.get('/user/:id', (req, res) => {
//     const userId = req.params.id; // Extract the route parameter
//     res.send(`User ID: ${userId}`);
// });


// swagger configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Express API with Swagger",
            version: "1.0.0",
            description: "A simple Express API with Swagger documentation"
        },
        servers: [
            {
                url: `http://localhost:${port}`
            }
        ]
    },
    apis: ["server.js"], // files containing annotations for Swagger
}
// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Query parameters: Accepts query parameters
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User created successfully
 */

app.post('/users', async (req, res) => {
    
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({error: "Bad Request"});
    }
});

// Get all users
/**
 * @swagger
 * /users:
 *  get:
 *    summary: Get all users
 *    description: Retrieve a list of all users
 *    responses:
 *      '200':
 *        description: A list of users
 */
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

// Get a user by ID and update the user
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update a user by ID with the provided details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User updated successfully
 */
app.put("/users/:id", async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(user);
});

// Delete a user
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User deleted successfully
 */
app.delete("/users/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.send("User deleted successfully");
});


// start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Swagger documentation is available at http://localhost:${port}/api-docs`);

});