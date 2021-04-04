const express = require('express');
const booksController = require('../controllers/booksController');

function routes(Book) {
    const bookRouter = express.Router();
    const controller = booksController(Book);

    // Retrun all the list of books - http://localhost:4000/api/books
    // Return the specfic query items - http://localhost:4000/api/books?genre=Fantasy
    // Also post data request
    bookRouter.route('/books')
        .post(controller.post)
        .get(controller.get);

    // Middlewhere - a call is shared by multiple sources
    bookRouter.use('/books/:bookId', (req, res, next) => {
        return controller.getById(req, res, next);
    });

    // Return a single item - http://localhost:4000/api/books/bookId
    bookRouter.route('/books/:bookId')
        .get((req, res) => res.json(req.book))
        .put(controller.put)
        .patch(controller.patch)
        .delete(controller.remove);

    return bookRouter;
}

module.exports = routes;
