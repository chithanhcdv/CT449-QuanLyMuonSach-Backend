const express = require("express");
const staff = require("../controllers/staff.controller");

const router = express.Router();

router.route("/")
    .get(staff.findAll)
    .delete(staff.deleteAll)
    .post(staff.create);

router.route("/:id")
    .get(staff.findOne)
    .put(staff.update)
    .delete(staff.delete);

router.route("/register")
    .post(staff.register)

router.route("/login")
    .post(staff.login)

router.get("/manhanvien/:MSNV", staff.findByMSNV);
module.exports = router;