var router = require("express").Router();

router.use("/", require("./login"));
router.use("/", require("./register"));
router.use("/", require("./getSecurityQuestion"));
router.use("/", require("./passwordReset"));
router.use("/", require("./forgotPassword"));

module.exports = router;
