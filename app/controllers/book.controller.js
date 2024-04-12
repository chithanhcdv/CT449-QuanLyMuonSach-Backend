const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if(!req.body?.TENSACH) {
        return next(new ApiError(400, "TENSACH can not be empty"));
    }

    try{
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the book")  
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try{
        const bookService = new BookService(MongoDB.client);
        const { name } = req.query;
        if(name) {
            documents = await bookService.findByName(name);
        } else {
            documents = await bookService.find({});
        }
    } catch (error){
        return next(
            new ApiError(500, "An error occurred while retrieving books")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try{
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Book not found"));
        }
        return res.send(document);
    } catch(error){
        return next(
            new ApiError(
                500,
                `Error retrieving Book with id=${req.params.id}`
            )
        );
    }
};

exports.findByMASACH = async (req, res, next) => {
    try {
        const { MASACH } = req.params;
        const bookService = new BookService(MongoDB.client);
        const documents = await bookService.findByMASACH(MASACH);
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving Books")
        );
    }
};

exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try{
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.update(req.params.id, req.body);
        if(!document){
            return next(new ApiError(404, "Book not found"));
        }
        return res.send({ message: "Book was update successfully"});
    } catch (error){
        return next(
            new ApiError(500, `Error updating book with id =${req.params.id}`)
        );
    }
};

exports.updateByMASACH = async (req, res, next) => {
    if(Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try{
        const { MASACH } = req.params;
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.updateByMASACH(MASACH, req.body);
        if(!document){
            return next(new ApiError(404, "Book not found"));
        }
        return res.send({ message: "Book was update successfully"});
    } catch (error){
        return next(
            new ApiError(500, `Error updating book with MASACH = ${MASACH}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try{
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Book not found"));
        }
        return res.send({ message: "Book was deleted successfully" });
    } catch (error){
        return next(
            new ApiError(500, `Could not delete book with id=${req.params.id}`)
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try{
        const bookService = new BookService(MongoDB.client);
        const deletedCount = await bookService.deleteAll();
        return res.send({
            message: `${deletedCount} Books were deleted successfully`,
        });
    } catch(error) {
        return next(
            new ApiError(500, "An error occurred while removing all books")
        );
    }
};