const express = require("express");
const borrowBook = require("../controllers/borrowBook.controller");

const router = express.Router();

router.route("/")
    .get(borrowBook.findAll)
    .post(borrowBook.create)
    .delete(borrowBook.deleteAll);

router.route("/:id")
    .get(borrowBook.findOne)
    .put(borrowBook.update)
    .delete(borrowBook.delete);

router.get("/masach/:MASACH", borrowBook.findByMASACH);
router.get("/madocgia/:MADOCGIA", borrowBook.findByMADOCGIA);
module.exports = router;