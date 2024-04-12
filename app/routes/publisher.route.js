const express = require("express");
const publisher = require("../controllers/publisher.controller");

const router = express.Router();

router.route("/")
    .get(publisher.findAll)
    .post(publisher.create)
    .delete(publisher.deleteAll);

router.route("/:id")
    .get(publisher.findOne)
    .put(publisher.update)
    .delete(publisher.delete);

router.get("/manxb/:MANXB", publisher.findByMANXB);
module.exports = router;