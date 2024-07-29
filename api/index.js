const express = require('express');
const app = express();
const db = require('./Database/db.js'); // Import the database connection
const bodyParser = require('body-parser'); // Or use express.json() directly

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Default route
app.get('/', (req, res) => {
    res.send('Express Vercel');
    }
);

// Routes for the API
app.use('/users', require('./Routes/Users.js'));
app.use('/location', require('./Routes/GeoLocation.js'));

// Start the server
app.listen(8080, () => {
    console.log('Server is running on port 8080');
    }
);


module.exports = app;