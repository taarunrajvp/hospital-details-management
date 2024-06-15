const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser'); // Required for parsing POST request body

// Connection URI
const uri = 'mongodb://localhost:27017';

// Database Name
const dbName = 'logindb';

// Collection Name
const collectionName = 'users';

const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

// Route to get all users
app.get('/users', async (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Database and collection objects
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Find all users
        const users = await collection.find({}).toArray();
        res.json(users); // Send JSON response with users array
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        // Close the client connection
        await client.close();
    }
});

// Route to add a new hospital
app.post('/addHospital', async (req, res) => {
    const { hospitalName, city, district, state, country } = req.body;

    if (!hospitalName || !city || !district || !state || !country) {
        return res.status(400).json({ message: 'All fields (hospitalName, city, district, state, country) are required.' });
    }

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Database and collection objects
        const db = client.db(dbName);
        const collection = db.collection('hospital');

        // Create a new hospital object
        const newHospital = {
            hospitalName,
            city,
            district,
            state,
            country
        };

        // Insert the new hospital into the database
        await collection.insertOne(newHospital);

        // Respond with a success message
        res.status(201).json({ message: 'Hospital added successfully.' });
    } catch (error) {
        console.error('Error adding hospital:', error);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        // Close the client connection
        await client.close();
    }
});

// Route for user login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Database and collection objects
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Find user by email
        const user = await collection.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the provided password matches the password in the database (plain text comparison)
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        // Password is correct, return success message or token
        res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        // Close the client connection
        await client.close();
    }
});

// Route to get all hospitals
app.get('/hospitals', async (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Database and collection objects
        const db = client.db(dbName);
        const collection = db.collection('hospital');

        // Find all hospitals
        const hospitals = await collection.find({}).toArray();
        console.log(hospitals)
        res.json(hospitals); // Send JSON response with hospitals array
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        res.status(500).json({ message: 'Internal server error.' });
    } finally {
        // Close the client connection
        await client.close();
    }
});

// Start the server
app.listen(port, () => {
    console.log('Server running at http://localhost:3000');
});
