const express = require('express');

function routes(Book) {
    const bookRouter = express.Router();

    // Retrun all the list of books - http://localhost:4000/api/books
    // Return the specfic query items - http://localhost:4000/api/books?genre=Fantasy
    // Also post data request
    bookRouter.route('/books')
        .post((req, res) => {
            const book = new Book(req.body);
            book.save();
            return res.status(201).json(book);
        })
        .get((req, res) => {
            const { query } = req;
            Book.find(query, (err, books) => {
                if (err) {
                    return res.send(err);
                }
                return res.json(books);
            })
        });

    // Middlewhere - a call is shared by multiple sources
    bookRouter.use('/books/:bookId', (req, res, next) => {
        Book.findById(req.params.bookId, (err, book) => {
            if (err) {
                return res.send(err);
            }

            if (book) {
                req.book = book;
                return next();
            }

            return res.sendStatus(404);
        });
    });

    // Return a single item - http://localhost:4000/api/books/bookId
    bookRouter.route('/books/:bookId')
        .get((req, res) => res.json(req.book))
        .put((req, res) => {
            const { book } = req;
            book.title = req.body.title;
            book.author = req.body.author;
            book.genre = req.body.genre;
            book.read = req.body.read;

            return req.book.save((err) => {
                if (err) {
                    return res.send(err);
                }
                return res.json(book);
            });
        })
        .patch((req, res) => {
            const { book } = req;

            // Don't update the id
            if (req.body._id) {
                delete req.body._id;
            }

            for (const [key, value] of Object.entries(req.body)) {
                book[key] = value;
            }

            return req.book.save((err) => {
                if (err) {
                    return res.send(err);
                }
                return res.json(book);
            });
        })
        .delete((req, res) => {
            req.book.remove((err) => {
                if (err) {
                    return res.send(err);
                }
                return res.sendStatus(204);
            });
        });

    return bookRouter;
}

module.exports = routes;
