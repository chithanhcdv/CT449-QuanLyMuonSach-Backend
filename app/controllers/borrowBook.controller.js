const BorrowBookService = require("../services/borrowBook.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    try{
        const borrowBookService = new BorrowBookService(MongoDB.client);
        const document = await borrowBookService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the borrowBook")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try{
        const borrowBookService = new BorrowBookService(MongoDB.client);
        documents = await borrowBookService.find({});     
    } catch (error){
        return next(
            new ApiError(500, "An error occurred while retrieving borrowBooks")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try{
        const borrowBookService = new BorrowBookService(MongoDB.client);
        const document = await borrowBookService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(404, "BorrowBook not found"));
        }
        return res.send(document);
    } catch(error){
        return next(
            new ApiError(
                500,
                `Error retrieving borrowBook with id=${req.params.id}`
            )
        );
    }
};

exports.findByMADOCGIA = async (req, res, next) => {
    try {
        const { MADOCGIA } = req.params;
        const borrowBookService = new BorrowBookService(MongoDB.client);
        const documents = await borrowBookService.findByMADOCGIA(MADOCGIA);
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving borrowBooks")
        );
    }
};

exports.findByMASACH = async (req, res, next) => {
    try {
        const { MASACH } = req.params;
        const borrowBookService = new BorrowBookService(MongoDB.client);
        const documents = await borrowBookService.findByMASACH(MASACH);
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving borrowBooks")
        );
    }
};

exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try{
        const borrowBookService = new BorrowBookService(MongoDB.client);
        const document = await borrowBookService.update(req.params.id, req.body);
        if(!document){
            return next(new ApiError(404, "BorrowBook not found"));
        }
        return res.send({ message: "BorrowBook was update successfully"});
    } catch (error){
        return next(
            new ApiError(500, `Error updating borrowBook with id =${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try{
        const borrowBookService = new BorrowBookService(MongoDB.client);
        const document = await borrowBookService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "BorrowBook not found"));
        }
        return res.send({ message: "BorrowBook was deleted successfully" });
    } catch (error){
        return next(
            new ApiError(500, `Could not delete borrowBook with id=${req.params.id}`)
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try{
        const borrowBookService = new BorrowBookService(MongoDB.client);
        const deletedCount = await borrowBookService.deleteAll();
        return res.send({
            message: `${deletedCount} BorrowBooks were deleted successfully`,
        });
    } catch(error) {
        return next(
            new ApiError(500, "An error occurred while removing all borrowBooks")
        );
    }
};
