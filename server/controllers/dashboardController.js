const Note = require('../models/Notes'); // from model Notes
const mongoose = require('mongoose');

/*  METHOD GET  (DASHBOARD) */
exports.dashboard = async (req, res) => {
    
    let perPage = 12; // Jumlah catatan di setiap halaman
    let page = req.query.page || 1; // ambil dari nilai page pada query

    const locals = {
        title: "Dashboard",
        description: "NodeJS Notes App"
    }

    try{
        Note.aggregate([
            {
                $sort:{ // mengurutkan data berdasarkan tanggal pembuatan (createdAt) dari yang terbaru ke yang terlama.
            
                    updatedAt: -1
                }
            },
            {
                $match: { // menyaring dokumen yang sesuai dengan kondisi yang ditentukan.
                    user: mongoose.Types.ObjectId(req.user.id )
                }
            },
            {
                $project:{ // mengubah struktur data dari dokumen yang melewati pipeline sebelumnya
                    title:{$substr: ['$title', 0, 40]},
                    body:{$substr: ['$body', 0, 100]}
                }
            },
        ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(function(err, notes){ //mengeksekusi semua query yang telah ditentukan sebelumnya
            Note.count().exec(function(err, count){
                if(err){
                    return next(err)
                }

                res.render('dashboard/index', {
                    userName: req.user.firstName,
                    locals:locals,
                    notes,
                    layout: '../views/layouts/dashboardPage',
                    current: page, // untuk menampilkan halaman saat ini.
                    pages: Math.ceil(count/perPage) // untuk menghitung jumlah halaman yang dibutuhkan untuk menampilkan semua data dari hasil query
                })
            })
        })

        
    }catch(error) {
        console.log(error);
    }

}


/* METHOD GET (LIHAT SPESIFIK NOTE) */
exports.dashboardViewNote = async (req, res) => {
    const note = await Note.findById({_id: req.params.id})
    .where({user: req.user.id}).lean()

    if(note){
        res.render('dashboard/viewNotes',{
            noteID: req.params.id,
            note,
            layout: '../views/layouts/dashboardPage'
        })
    } else{
        res.send("Something went wrong!.")
    }
}

/* METHOD PUT (UPDATE SPESIFIK NOTE) */
exports.dashboardUpdateNote= async (req, res) => {
    try {
        await Note.findOneAndUpdate(
            { _id:req.params.id },
            {title: req.body.title, body: req.body.body, updatedAt: Date.now()} // judul dan isi yang dikirim dari form
            ).where({user: req.user.id});
            res.redirect('/dashboard');
            // console.log(Note);

    } catch (error) {
        console.log(error);
    }
}

/* METHOD DELETE (HAPUS SPESIFIK NOTE) */
exports.dashboardDeleteNote = async (req,res) => {
    try {    
    await Note.deleteOne({ _id: req.params.id }).where({user: req.user.id})
    res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
    }
}


/* METHOD GET (MENAMPILKAN HALAMAN TAMBAH NOTE) */
exports.dashboardAddNote = async (req,res) => {
    res.render('dashboard/add', {
        layout: '../views/layouts/dashboardPage'
    });
}

/* METHOD POST (HANDLE DATA YANG DIKIRIM DARI HALAMAN TAMBAH NOTE) */
exports.dashboardAddNoteSubmitData = async (req, res) => {
    try {
        req.body.user = req.user.id //  insert id user yang sedang login kedalam "user" didalam req.body.
        await Note.create(req.body);
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
    }
}


/* METHOD GET (UNTUK PENCARIAN CATATAN) */
exports.dashboardSearch = async (req, res) => {
    try {
       res.render('dashboard/search', {
        searchResult: '',
        layout: '../views/layouts/dashboardPage'
       })
    } catch (error) {
        console.log(error);
    }
}

/* METHOD POST (UNTUK HANDLE KEYWORD PENCARIAN CATATAN) */
exports.dashboardSearchSubmit = async (req, res) => {
    try {
        
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, "")
        const searchResult = await Note.find({
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
                {body: {$regex: new RegExp(searchNoSpecialChars, 'i')}},
            ]
        }).where({user: req.user.id})

        res.render('dashboard/search', {
            searchResult,
            layout: '../views/layouts/dashboardPage'
        })

    } catch (error) {
        
    }
}