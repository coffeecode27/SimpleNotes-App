const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware/checkAuth') // middleware for login
const dashboardController = require('../controllers/dashboardController');


/* HANDLE DASHBOARD ROUTES */
router.get('/dashboard', isLoggedIn, dashboardController.dashboard);
router.get('/dashboard/item/:id', isLoggedIn, dashboardController.dashboardViewNote);
router.put('/dashboard/item/:id', isLoggedIn, dashboardController.dashboardUpdateNote);
router.delete('/dashboard/item-delete/:id', isLoggedIn, dashboardController.dashboardDeleteNote);
router.get('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNote); // untuk nampilin halaman
router.post('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNoteSubmitData); // untuk kelola data yg dikirim dari form
router.get('/dashboard/search', isLoggedIn, dashboardController.dashboardSearch);
router.post('/dashboard/search', isLoggedIn, dashboardController.dashboardSearchSubmit); // untuk kelola data yg dikirim dari form


/* EXPORT MODULE  */ 
module.exports = router;