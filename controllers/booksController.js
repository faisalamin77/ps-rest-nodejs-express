function booksController(Book) {

    function post(req, res) {
        const book = new Book(req.body);
        book.save();
        return res.status(201).json(book);
    }

    function get(req, res) {
        const { query } = req;
        return Book.find(query, (err, books) => {
            if (err) {
                return res.send(err);
            }
            return res.json(books);
        })
    }

    function getById(req, res, next) {
        return Book.findById(req.params.bookId, (err, book) => {
            if (err) {
                return res.send(err);
            }

            if (book) {
                req.book = book;
                return next();
            }

            return res.sendStatus(404);
        });
    }

    function put(req, res) {
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
    }

    function patch(req, res) {
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
    }

    function remove(req, res) {
        return req.book.remove((err) => {
            if (err) {
                return res.send(err);
            }
            return res.sendStatus(204);
        });
    }

    return {post, get, getById, put, patch, remove};
}

module.exports = booksController;