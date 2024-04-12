const express = require("express");
const book = require("../controllers/book.controller");

const router = express.Router();

router.route("/")
    .get(book.findAll)
    .post(book.create)
    .delete(book.deleteAll);

router.route("/:id")
    .get(book.findOne)
    .put(book.update)
    .delete(book.delete);

router.get("/masach/:MASACH", book.findByMASACH);
router.put("/masach/:MASACH", book.updateByMASACH);
module.exports = router;