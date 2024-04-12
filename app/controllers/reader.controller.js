const ReaderService = require("../services/reader.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.findAll = async (req, res, next) => {
    let documents = [];

    try{
        const readerService = new ReaderService(MongoDB.client);
        documents = await readerService.find({});
    } catch (error){
        return next(
            new ApiError(500, "An error occurred while retrieving readers")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try{
        const readerService = new ReaderService(MongoDB.client);
        const document = await readerService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Reader not found"));
        }
        return res.send(document);
    } catch(error){
        return next(
            new ApiError(
                500,
                `Error retrieving Reader with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try{
        const readerService = new ReaderService(MongoDB.client);
        const document = await readerService.update(req.params.id, req.body);
        if(!document){
            return next(new ApiError(404, "Reader not found"));
        }
        return res.send({ message: "Reader was update successfully"});
    } catch (error){
        return next(
            new ApiError(500, `Error updating reader with id =${req.params.id}`)
        );
    }
};

exports.findByMADOCGIA = async (req, res, next) => {
    try {
        const { MADOCGIA } = req.params;
        const readerService = new ReaderService(MongoDB.client);
        const documents = await readerService.findByMADOCGIA(MADOCGIA);
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving Books")
        );
    }
};

exports.delete = async (req, res, next) => {
    try{
        const readerService = new ReaderService(MongoDB.client);
        const document = await readerService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Reader not found"));
        }
        return res.send({ message: "Reader was deleted successfully" });
    } catch (error){
        return next(
            new ApiError(500, `Could not delete reader with id=${req.params.id}`)
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try{
        const readerService = new ReaderService(MongoDB.client);
        const deletedCount = await readerService.deleteAll();
        return res.send({
            message: `${deletedCount} reader were deleted successfully`,
        });
    } catch(error) {
        return next(
            new ApiError(500, "An error occurred while removing all reader")
        );
    }
};

exports.register = async (req, res, next) => {
    try {
        const readerService = new ReaderService(MongoDB.client);
        const document = await readerService.register(req.body);
         return res.send({ message: "Register Successfully" });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while registering the reader")
        );
    }
};

exports.login = async (req, res, next) => {
    const { USERNAME, PASSWORD } = req.body;

    try {
        const readerService = new ReaderService(MongoDB.client);
        const user = await readerService.login(USERNAME, PASSWORD);
        // Trả về thông tin của người dùng trong phản hồi
        return res.send({ message: "Login Successfully", user });
    } catch (error) {
        return next(
            new ApiError(401, "Invalid credentials")
        );
    }
};
