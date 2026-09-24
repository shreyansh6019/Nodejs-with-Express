const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const fs = require('fs');

const Movie = require('../models/movieModel');

mongoose.connect(process.env.CONN_STR, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then((conn) => {
    console.log(conn.connections);
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

//Read JSON file and import data into MongoDB
const moviesData = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'));

const deleteMovies = async () => {
    try {
        await Movie.deleteMany();
        console.log('All movies deleted successfully');
    } catch (err) {
        console.error('Error deleting movies:', err);
    } finally {
        process.exit();
    }
};

const importMovies = async () => {
    try {
        await Movie.create(moviesData);
        console.log('Movies imported successfully');
    } catch (err) {
        console.error('Error importing movies:', err);
    } finally {
        process.exit();
    }
};

//Check command line arguments to determine whether to import or delete data
if (process.argv[2] === '--import') {
    importMovies();
} else if (process.argv[2] === '--delete') {
    deleteMovies();
}
