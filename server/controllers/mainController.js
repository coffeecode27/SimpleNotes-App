/*  METHOD GET  (HOMEPAGE) */
exports.homepage = async (req, res) => {
    const locals = {
        title: "SimpleNotes App",
        description: "NodeJS Notes App"
    }
    res.render('index', {
        locals:locals,
        layout: '../views/layouts/frontPage'
    })
}

/*  METHOD GET  (ABOUT) */
exports.about = async (req, res) => {
    const locals = {
        title: "About",
        description: "NodeJS Notes App"
    }
    res.render('about', locals)
}