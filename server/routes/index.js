const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController.js');


/* HANDLE MAIN PAGE ROUTES */
router.get('/', mainController.homepage);
router.get('/about', mainController.about);


/* EXPORT MODULE  */ 
module.exports = router;
