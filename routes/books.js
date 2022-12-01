var express = require('express');
var router = express.Router();
var dbConn  = require('../connection/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM books ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('books',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('books',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('books/add', {
        name: '',
        author: '',
        ISBN: ''        
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let name = req.body.name;
    let author = req.body.author;
    let ISBN = req.body.ISBN;
    let errors = false;

    if(name.length === 0 || author.length === 0 || ISBN.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name, author and ISBN");
        // render to add.ejs with flash message
        res.render('books/add', {
            name: name,
            author: author,
            ISBN: ISBN,
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            author: author,
            ISBN: ISBN
        }
        
        // insert query
        dbConn.query('INSERT INTO books SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('books/add', {
                    name: form_data.name,
                    author: form_data.author,
                    ISBN: form_data.ISBN               
                })
            } else {                
                req.flash('success', 'Book successfully added');
                res.redirect('/books');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM books WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Book not found with id = ' + id)
            res.redirect('/books')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('books/edit', {
                title: 'Edit Book', 
                id: rows[0].id,
                name: rows[0].name,
                author: rows[0].author,
                ISBN: rows[0].ISBN
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let author = req.body.author;
    let ISBN = req.body.ISBN;
    let errors = false;

    if(name.length === 0 || author.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('books/edit', {
            id: req.params.id,
            name: name,
            author: author,
            ISBN: ISBN
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            name: name,
            author: author,
            ISBN: ISBN
        }
        // update query
        dbConn.query('UPDATE books SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('books/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    author: form_data.author,
                    ISBN: form_data.ISBN
                })
            } else {
                req.flash('success', 'Book successfully updated');
                res.redirect('/books');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM books WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/books')
        } else {
            // set flash message
            req.flash('success', 'Book successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/books')
        }
    })
})

module.exports = router;