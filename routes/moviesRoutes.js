const express = require('express');
const router = express.Router();

const { getAllMovies, getMovieById, getMoviesByYearAndGenre, addNewMovie, updateMovieById, replaceMovieById, deleteMovieById, getHighestRated, getMoviesStats, getMoviesByGenre } = require('../controllers/moviesController');

router.route('/highest-rated').get(getHighestRated,getAllMovies);

router.route('/movie-stats').get(getMoviesStats)

router.route('/movie-by-genre').get(getMoviesByGenre)

router.route('/').get(getAllMovies).post(addNewMovie);

//Middleware to handle route parameters & if some url does not match any route, it will be handled by the next middleware so it doesn't return an error or unhandled promise rejection. It will pass the control to the next middleware.
// router.param('id', checkMovieId);

router.route('/:id').get(getMovieById).patch(updateMovieById).put(replaceMovieById).delete(deleteMovieById);
router.route('/:year/:genre').get(getMoviesByYearAndGenre);

module.exports = router;