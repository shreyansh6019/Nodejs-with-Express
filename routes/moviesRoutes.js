const express = require('express');
const router = express.Router();

const { 
    getAllMovies, 
    getMovieById, 
    getMoviesByYearAndGenre, 
    addNewMovie, 
    updateMovieById, 
    replaceMovieById, 
    deleteMovieById, 
    getHighestRated, 
    getMoviesStats, 
    getMoviesByGenre 
 } = require('../controllers/moviesController');

 const {
    protect,
    restrict
 } = require('../controllers/authController')

router.route('/highest-rated').get(protect,getHighestRated,getAllMovies);

router.route('/movie-stats').get(protect,getMoviesStats)

router.route('/movie-by-genre').get(protect,getMoviesByGenre)

router.route('/').get(protect,getAllMovies).post(protect,restrict('admin'),addNewMovie);

//Middleware to handle route parameters & if some url does not match any route, it will be handled by the next middleware so it doesn't return an error or unhandled promise rejection. It will pass the control to the next middleware.
// router.param('id', checkMovieId);

router.route('/:id').get(protect,getMovieById).patch(protect,updateMovieById).put(protect,replaceMovieById).delete(protect,restrict('admin'),deleteMovieById);
router.route('/:year/:genre').get(protect,getMoviesByYearAndGenre);

module.exports = router;