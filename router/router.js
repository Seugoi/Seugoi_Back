/* .routes/index.js */
const express = require("express");
const user = require("../controller/UserController");
const router = express.Router();

router.get("/", user.index);
router.post("/join", user.post_user);

router.get("/login", user.login);
router.post("/login", user.post_login);

router.delete("/delete", user.delete_user);

module.exports = router; 