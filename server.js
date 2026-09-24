const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (error)=>{
    console.log(error.name, error.message);
    console.log("Uncaught exception occurred! Shutting Down...");

    process.exit(1);
})
const app = require('./app');

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.CONN_STR, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then((conn) => {
    console.log(conn.connections);
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('unhandleRejection', (error)=>{
    console.log(error.name, error.message);
    console.log("Unhandled rejection occurred! Shutting Down...");

    server.close(() => {
        process.exit(1);
    });
})