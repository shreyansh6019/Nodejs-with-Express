const mongoose = require('mongoose');
// const validator = require('validator');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Movie name is required'],
        unique: true,
        trim: true,
        // validate: [validator.isAlpha, "Name should be of alphabets"] //third party validator library
    },
    description: {
        type: String,
        required: [true, 'Movie description is required']
    },
    duration: {
        type: Number,
        required: [true, 'Movie duration is required']
    },
    ratings: {
        type: Number,
        required: [true, 'Movie rating is required'],
        default: 2.0,
        //built-in validators
        // min: [0, 'Rating must be at least 0'],
        // max: [10, 'Rating cannot exceed 10'],
        //custom validators. also check library validator.js on google
        validate: {
            validator: function(value){
                return value >= 1 && value <=10;
            },
            message: "Ratings {{VALUE}} should be between 1 and 10"
        }
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    releaseYear: {
        type: Number,
        required: [true, 'Movie year is required'],
        // select: false //excluding this field when sending it in webapi result
    },
    releasedDate: {
        type: Date,
        required: [true, 'Movie released date is required']
    },
    genres: {
        type: [String],
        required: [true, 'Movie genres are required'],
        // enum: {
        //     values:["Action", "Thriller", "Sci-Fi","Adventure", "Drama", "Comedy", "Romance", "Crime", "Suspense", "Biography"],
        //     message: "This genre does not exist"
        // }
    },
    
    directors: {
        type: [String],
        required: [true, 'Movie directors are required']
    },
    actors: {
        type: [String],
        required: [true, 'Movie actors are required']
    },
    
    coverImage: {
        type: String,
        required: [true, 'Movie cover image is required']
    },
    
},{
    toJSON: true,
    toObject: true
});

movieSchema.virtual('durationHours').get(function(){
    return this.duration/60;
})

//.create() & .save() => for these two save event gets triggered
movieSchema.pre('save', async function(){
    //this  represent current document saved
    console.log(this);
    // next();
})

movieSchema.post('save', async function(doc){
    console.log("Document saved successfully", doc)
})

// movieSchema.pre('find', async function(){
//     //this represent current query object given by Movie.find()
// })

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;

// const testMovie = new Movie({
//     name: 'Inception',
//     year: 2010,
//     genre: 'Sci-Fi',
//     rating: 8.8
// });

// testMovie.save().then(doc => {
//     console.log('Movie saved:', doc);
// }).catch(err => {
//     console.error('Error saving movie:', err);
// });