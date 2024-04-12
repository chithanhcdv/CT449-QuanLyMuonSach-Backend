const StaffService = require("../services/staff.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    try{
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.create(req.body);       
        return res.send({ message: "Create staff was successfully" });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the staff")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try{
        const staffService = new StaffService(MongoDB.client);
        documents = await staffService.find({});
    } catch (error){
        return next(
            new ApiError(500, "An error occurred while retrieving staff")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try{
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Staff not found"));
        }
        return res.send(document);
    } catch(error){
        return next(
            new ApiError(
                500,
                `Error retrieving Staff with id=${req.params.id}`
            )
        );
    }
};

exports.findByMSNV = async (req, res, next) => {
    try {
        const { MSNV } = req.params;
        const staffService = new StaffService(MongoDB.client);
        const documents = await staffService.findByMSNV(MSNV);
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
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.update(req.params.id, req.body);
        if(!document){
            return next(new ApiError(404, "Staff not found"));
        }
        return res.send({ message: "Staff was update successfully"});
    } catch (error){
        return next(
            new ApiError(500, `Error updating Staff with id =${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try{
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Staff not found"));
        }
        return res.send({ message: "Staff was deleted successfully" });
    } catch (error){
        return next(
            new ApiError(500, `Could not delete Staff with id=${req.params.id}`)
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try{
        const staffService = new StaffService(MongoDB.client);
        const deletedCount = await staffService.deleteAll();
        return res.send({
            message: `${deletedCount} Staff were deleted successfully`,
        });
    } catch(error) {
        return next(
            new ApiError(500, "An error occurred while removing all staff")
        );
    }
};

exports.register = async (req, res, next) => {
    try {
        const staffService = new StaffService(MongoDB.client);
        const document = await staffService.register(req.body);
         return res.send({ message: "Register Successfully" });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while registering the staff")
        );
    }
};

exports.login = async (req, res, next) => {
    const { USERNAME, PASSWORD } = req.body;

    try {
        const staffService = new StaffService(MongoDB.client);
        const user = await staffService.login(USERNAME, PASSWORD);
        return res.send({ message: "Login Successfully" });
    } catch (error) {
        return next(
            new ApiError(401, "Invalid credentials")
        );
    }
};