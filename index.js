const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT||3000;

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the form HTML file at the root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/form.html');
});

// Handle form submission
app.post('/', async (req, res) => {
    const { myuri } = req.body;

    // Connect to MongoDB using the URI from the form
    mongoose.connect(myuri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(async () => {
        console.log('Connected to MongoDB');

        // Define a schema and model
        const Schema = mongoose.Schema;
        const userSchema = new Schema({
            myName: { type: String },
            mySID: { type: Number, required: true }
        });
        const userModel = mongoose.model('s24students', userSchema);

        // Create and save the document
        const addNewStudent = new userModel({
            myName: 'Wing Yan Lo', 
            mySID: 300387440 
        });

        try {
            await addNewStudent.save();
            res.send(`
                <div>
                    <h1>New Student is Added</h1>
                    <p>My Name: ${addNewStudent.myName}</p>
                    <p>SID: ${addNewStudent.mySID}</p>
                </div>
            `);
        } catch (error) {
            res.status(500).send('Error adding student to the database');
        }
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        res.status(500).send('Failed to connect to MongoDB');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
