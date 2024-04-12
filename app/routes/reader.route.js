const express = require("express");
const reader = require("../controllers/reader.controller");

const router = express.Router();

router.route("/")
    .get(reader.findAll)
    .delete(reader.deleteAll);

router.route("/:id")
    .get(reader.findOne)
    .put(reader.update)
    .delete(reader.delete);

router.route("/register")
    .post(reader.register)

router.route("/login")
    .post(reader.login)

router.get("/madocgia/:MADOCGIA", reader.findByMADOCGIA);
module.exports = router;