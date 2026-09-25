

const Movie = require('../models/movieModel');
const APIFeatures = require('../utils/apiFeatures')

const CustomError = require('../utils/customError');

const asyncErrorHandler = require('../utils/asyncErrorHandler');

exports.getHighestRated = (req, res, next) => {
    Object.defineProperty(req, "query", {
        value: { ...req.query, sort: "-ratings", limit: "5" },
        writeable: true,
    });
    next();
}

exports.getAllMovies = async (req, res, next) => {
    
    try {
        const apiFeatures = new APIFeatures(Movie.find(), req.query).sort().limitFields().paginate();
        const movies = await apiFeatures.query
        //Mongoose 6.0 or less
        // const excludeFields = ['page', 'sort', 'limit', 'fields'];
        // const queryObj = { ...req.query };
        // excludeFields.forEach(field => delete queryObj[field]);
        // const movies = await Movie.find(queryObj);

        //Mongoose 6.1 or more
        // const movies = await Movie.find(req.query).where('duration').gt(req.query.duration);

        //Sorting technique
        // let query = Movie.find();
        // if(req.query.sort) {
        //     let sortBy = req.query.sort.split(',').join(' ');
        //     query.sort(sortBy);
        // }else{
        //     query.sort('-createdAt')
        // }
        // const movies = await query;

        //LIMITING FIELDS LOGIC
        // let query = Movie.find();
        // if(req.query.fields){
        //     const fields=req.query.fields.split(",").join(" ");
        //     query.select(fields);
        // } else {
        //     query.select('-__v');
        // }
        // const movies = await query;

        //PAGINATION
        // let query = Movie.find();
        // const page=req.query.page*1 || 1;
        // const limit=req.query.limit*1 || 10;
        // const skip = (page-1)*limit;
        // query.skip(skip).limit(limit);
        // if(req.query.page){
        //     const moviesCount=await Movie.countDocuments();
        //     if(skip >= moviesCount){
        //         throw new Error("Page not found")
        //     }
        // }
        // const movies = await query;

        //Without any query
        // const movies=await Movie.find();

        res.status(200).json({
            status: 'success',
            results: movies.length,
            data: {
                movies
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getMovieById = asyncErrorHandler(async (req, res, next) => {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            // return res.status(404).json({
            //     status: 'fail',
            //     message: 'Movie not found'
            // });
            const error = new CustomError(404, `Movie with ID:${req.params.id} not found`);
            return next(error);
        }
        res.status(200).json({
            status: 'success',
            data: {
                movie
            }
        });
});

// exports.getMovieById = async (req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id);
//         if (!movie) {
//             return res.status(404).json({
//                 status: 'fail',
//                 message: 'Movie not found'
//             });
//         }
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 movie
//             }
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err.message
//         });
//     }
// };


exports.getMoviesByYearAndGenre = asyncErrorHandler(async (req, res, next) => {
        const { year, genre } = req.params;
        const movies = await Movie.find({ year: year, genre: genre });
        if (movies.length === 0) {
            // return res.status(404).json({
            //     status: 'fail',
            //     message: 'No movies found for the given year and genre'
            // });
            const error = new CustomError(404, `No movies found for the given year and genre`);
            return next(error);
        }
        res.status(200).json({
            status: 'success',
            results: movies.length,
            data: {
                movies
            }
        });
});

// exports.getMoviesByYearAndGenre = async (req, res) => {
//     try {
//         const { year, genre } = req.params;
//         const movies = await Movie.find({ year: year, genre: genre });
//         if (movies.length === 0) {
//             return res.status(404).json({
//                 status: 'fail',
//                 message: 'No movies found for the given year and genre'
//             });
//         }
//         res.status(200).json({
//             status: 'success',
//             results: movies.length,
//             data: {
//                 movies
//             }
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err.message
//         });
//     }
// };

exports.addNewMovie = asyncErrorHandler(async (req, res, next) => {
        const newMovie = await Movie.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                movie: newMovie
            }
        });
});

// exports.addNewMovie = async (req, res) => {
//     try {
//         const newMovie = await Movie.create(req.body);
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 movie: newMovie
//             }
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err.message
//         });
//     }
// };

exports.updateMovieById = asyncErrorHandler(async (req, res, next) => {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedMovie) {
            // return res.status(404).json({
            //     status: 'fail',
            //     message: 'Movie not found'
            // });
            const error = new CustomError(404, `Movie with ID:${req.params.id} not found`);
            return next(error);
        }
        res.status(200).json({
            status: 'success',
            data: {
                movie: updatedMovie
            }
        });
});
// exports.updateMovieById = async (req, res) => {
//     try {
//         const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true
//         });
//         if (!updatedMovie) {
//             return res.status(404).json({
//                 status: 'fail',
//                 message: 'Movie not found'
//             });
//         }
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 movie: updatedMovie
//             }
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err.message
//         });
//     }
// };


exports.replaceMovieById = asyncErrorHandler(async (req, res, next) => {
        const replacedMovie = await Movie.findOneAndReplace({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        });
        if (!replacedMovie) {
            // return res.status(404).json({
            //     status: 'fail',
            //     message: 'Movie not found'
            // });
            const error = new CustomError(404, `Movie with ID:${req.params.id} not found`);
            return next(error);
        }
        res.status(200).json({
            status: 'success',
            data: {
                movie: replacedMovie
            }
        });
});

// exports.replaceMovieById = async (req, res) => {
//     try {
//         const replacedMovie = await Movie.findOneAndReplace({ _id: req.params.id }, req.body, {
//             new: true,
//             runValidators: true
//         });
//         if (!replacedMovie) {
//             return res.status(404).json({
//                 status: 'fail',
//                 message: 'Movie not found'
//             });
//         }
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 movie: replacedMovie
//             }
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err.message
//         });
//     }
// };

exports.deleteMovieById = asyncErrorHandler(async (req, res, next) => {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) {
            // return res.status(404).json({
            //     status: 'fail',
            //     message: 'Movie not found'
            // });
            const error = new CustomError(404, `Movie with ID:${req.params.id} not found`);
            return next(error);
        }
        res.status(200).json({
            status: 'Success',
            message: "Movie deleted successfully.",
            data: deletedMovie
        });
});

// exports.deleteMovieById = async (req, res) => {
//     try {
//         const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
//         if (!deletedMovie) {
//             return res.status(404).json({
//                 status: 'fail',
//                 message: 'Movie not found'
//             });
//         }
//         res.status(204).json({
//             status: 'success',
//             data: null
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err.message
//         });
//     }
// };

exports.getMoviesStats = asyncErrorHandler(async (req, res, next) => {
        const stats = await Movie.aggregate([
            {
                $match: {
                    ratings: {$gte: 4.0}
                }
            },
            {
                $group: {
                    _id: '$releaseYear',
                    avgRating: { $avg: '$ratings'},
                    minRating: { $min: '$ratings'},
                    maxRating: { $max: '$ratings'},
                    totalRating: { $sum: '$ratings'},
                    movieCount: { $sum: 1 }
                }
            },
            {
                $sort: { minRating: 1 }
            }
        ]);
        res.status(200).json({
            status: 'success',
            count: stats.length,
            data: {
                stats
            }
        });
});

// exports.getMoviesStats = async (req, res) => {
//     try{
//         const stats = await Movie.aggregate([
//             {
//                 $match: {
//                     ratings: {$gte: 4.0}
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$releaseYear',
//                     avgRating: { $avg: '$ratings'},
//                     minRating: { $min: '$ratings'},
//                     maxRating: { $max: '$ratings'},
//                     totalRating: { $sum: '$ratings'},
//                     movieCount: { $sum: 1 }
//                 }
//             },
//             {
//                 $sort: { minRating: 1 }
//             }
//         ]);
//         res.status(200).json({
//             status: 'success',
//             count: stats.length,
//             data: {
//                 stats
//             }
//         });
//     } catch(err){
//         res.status(400).json({
//             status: 'fail',
//             message: err.message
//         });
//     }
// };

exports.getMoviesByGenre = asyncErrorHandler(async (req, res, next) => {
        const genre = req.params.genre;
        const movies = await Movie.aggregate([
            {
                $unwind: '$genres'
            },
            {
                $group: {
                    _id: '$genres',
                    movieCount: { $sum: 1 },
                    movies: { $push: '$name'},
                }
            },
            { $addFields: { genre: '$_id'} },
            { $project: {_id: 0}},
            { $sort: {movieCount: -1}},
            // { $limit: 5 },
            // { $match : { genre: genre}} //not working
        ])
        res.status(200).json({
            status: 'success',
            count: movies.length,
            data: {
                movies
            }
        });
});

// exports.getMoviesByGenre = async (req, res) => {
//     try{
//         const genre = req.params.genre;
//         const movies = await Movie.aggregate([
//             {
//                 $unwind: '$genres'
//             },
//             {
//                 $group: {
//                     _id: '$genres',
//                     movieCount: { $sum: 1 },
//                     movies: { $push: '$name'},
//                 }
//             },
//             { $addFields: { genre: '$_id'} },
//             { $project: {_id: 0}},
//             { $sort: {movieCount: -1}},
//             // { $limit: 5 },
//             // { $match : { genre: genre}} //not working
//         ])
//         res.status(200).json({
//             status: 'success',
//             count: movies.length,
//             data: {
//                 movies
//             }
//         });
//     }catch(err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err.message
//         });
//     }
// }

// const fs = require('fs');
// let movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'));

// exports.checkMovieId = (req, res, next, value) => {
//     console.log(`Movie ID: ${value}`);
//     let movie = movies.find(m => m.id === value);
//     if(!movie) {
//         return res.status(404).json({
//             message: 'Movie not found',
//             status: 404
//         });
//     }
//     next();
// };

// exports.validateMovieData = (req, res, next) => {
//     const { name, year, genre, rating } = req.body;
//     if (!name || !year || !genre || !rating) {
//         return res.status(400).json({
//             message: 'Missing required movie data',
//             status: 400
//         });
//     }
//     next();
// };

// //GET all movies
// exports.getAllMovies = (req, res) => {
//     res.status(200).json({
//         message: 'List of movies',
//         status: 200,
//         total: movies.length,
//         data: {
//             movies: movies
//         }
//     });
// };

// //GET movie by ID
// exports.getMovieById = (req, res) => {
//     let movieId = parseInt(req.params.id);
//     let movie = movies.find(m => m.id === movieId);
//     res.status(200).json({
//         message: 'Movie found',
//         status: 200,
//         data: {
//             movie: movie
//         }
//     });
// };


// //GET movie by multiple route parameters
// exports.getMoviesByYearAndGenre = (req, res) => {
//     console.log(req.params);
//     let year = parseInt(req.params.year);
//     let genre = req.params.genre;
//     let filteredMovies = movies.filter(m => m.year === year && m.genre.toLowerCase() === genre.toLowerCase());
//     if (filteredMovies.length > 0) {
//         res.status(200).json({
//             message: 'Movies found',
//             status: 200,
//             total: filteredMovies.length,
//             data: {
//                 movies: filteredMovies
//             }
//         });
//     } else {
//         res.status(404).json({
//             message: 'No movies found for the given year and genre',
//             status: 404
//         });
//     }
// };

// //POST new movie
// exports.addNewMovie = (req, res) => {
//     let newMovie = {
//         id: req.body.id || movies.length + 1,
//         name: req.body.name,
//         year: req.body.year,
//         genre: req.body.genre,
//         rating: req.body.rating
//     };
//     movies.push(newMovie);
//     fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
//         if (err) {
//             return res.status(500).json({
//                 message: 'Error writing to file',
//                 status: 500,
//                 error: err
//             });
//         } else {
//             console.log('Movie added successfully');
//             res.status(201).json({
//                 message: 'Movie added successfully',
//                 status: 201,
//                 data: {
//                     movie: newMovie
//                 }
//             });
//         }
//     });
// };

// //PATCH update movie by ID
// exports.updateMovieById = (req, res) => {
//     let movieId = parseInt(req.params.id);
//     let movie = movies.find(m => m.id === movieId);
//     if (req.body.name) movie.name = req.body.name;
//     if (req.body.year) movie.year = req.body.year;
//     if (req.body.genre) movie.genre = req.body.genre;
//     if (req.body.rating) movie.rating = req.body.rating;

//     fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
//         if (err) {
//             return res.status(500).json({
//                 message: 'Error writing to file',
//                 status: 500,
//                 error: err
//             });
//         } else {
//             console.log('Movie updated successfully');
//             res.status(200).json({
//                 message: 'Movie updated successfully',
//                 status: 200,
//                 data: {
//                     movie: movie
//                 }
//             });
//         }
//     });
// };

// //PUT update movie by ID
// exports.replaceMovieById = (req, res) => {
//     let movieId = parseInt(req.params.id);
//     let movieIndex = movies.findIndex(m => m.id === movieId);
//     movies[movieIndex] = {
//         id: movieId,
//         name: req.body.name,
//         year: req.body.year,
//         genre: req.body.genre,
//         rating: req.body.rating
//     };

//     fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
//         if (err) {
//             return res.status(500).json({
//                 message: 'Error writing to file',
//                 status: 500,
//                 error: err
//             });
//         } else {
//             console.log('Movie replaced successfully');
//             res.status(200).json({
//                 message: 'Movie replaced successfully',
//                 status: 200,
//                 data: {
//                     movie: movies[movieIndex]
//                 }
//             });
//         }
//     });
// };

// //DELETE movie by ID
// exports.deleteMovieById = (req, res) => {
//     let movieId = parseInt(req.params.id);
//     let movieIndex = movies.findIndex(m => m.id === movieId);
//     let deletedMovie = movies.splice(movieIndex, 1)[0];
//     fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
//         if (err) {
//             return res.status(500).json({
//                 message: 'Error writing to file',
//                 status: 500,
//                 error: err
//             });
//         } else {
//             console.log('Movie deleted successfully');
//             res.status(200).json({
//                 message: 'Movie deleted successfully',
//                 status: 200,
//                 data: {
//                     movie: deletedMovie
//                 }
//             });
//         }
//     });
// };