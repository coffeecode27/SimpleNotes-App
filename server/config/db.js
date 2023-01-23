const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

/* DB CONFIG*/
const connectDB = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database Connected: ${connect.connection.host}`);
    }catch(error) {
        console.log(error);
    }
}

module.exports = connectDB;