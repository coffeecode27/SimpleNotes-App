require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts'); //  helper for Ejs template engine
const methodOverride = require('method-override'); // manipulasi form method
// const connectDB = require('./server/config/db'); // DB File
const mongoose = require('mongoose');
const session = require('express-session'); // For login session
const passport = require('passport') // Metode autentikasi login
const mongoStore = require('connect-mongo');
const app = express();

const port = 3000 || process.env.PORT; // bisa menggunakan nilai port dari dalam file .env
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

app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true,
    store: mongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    // cookie: {maxAge: new Date (Date.now() + (3600000))} // 7 hari expired 604800000
    // Date.now() - 30 * 24 * 60 * 60 * 1000  // untuk 30 hari
}));

app.use(passport.initialize()); // Menginisialisasi Passport
app.use(passport.session()); // persistent login session

/* SETUP MIDDLEWARE */
app.use(express.urlencoded({extended: true})); // menangani permintaan HTTP dengan enkode URL
app.use(express.json()); // menangani data yang diterima dalam format JSON dari permintaan HTTP
app.use(methodOverride("_method")); // manipulasi form method



/* STATIC FILES */
app.use(express.static('public')); // konfigurasi untuk menggunakan folder "public" sebagai folder statis.

/* TEMPLATING ENGINE */
app.use(expressLayouts);
app.set('layout', './layouts/main') // default layout to rendering page
app.set('view engine', 'ejs')

/* ROUTES MIDDLEWARE (require dari folder routes) */
/* Akan menghandle route apapun dengan awalan '/' untuk tahap pertama */
app.use('/', require('./server/routes/auth')); // ambil router yg diekports dari file auth
app.use('/', require('./server/routes/index')); // ambil router yg diekports dari file index
app.use('/', require('./server/routes/dashboard')); // ambil router yg diekports dari file dashboard


/* HANDLE 404 NOT FOUND */
app.get('*', (req, res) => {
    res.status(404).render('404',{
        layout:'./layouts/404Page'
    })
})

/* CONNECT TO DATABASE */
connectDB().then(() => {
    console.log("db connected");
    app.listen(port, () => {
         console.log(`App listening on port ${port}`);
    })
})
// app.listen(port, () => {
//     console.log(`App listening on port ${port}`);
// });
