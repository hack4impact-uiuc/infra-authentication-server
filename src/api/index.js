var router = require("express").Router();

router.use("/", require("./login"));
router.use("/", require("./register"));
router.use("/", require("./getSecurityQuestion"));
router.use("/", require("./passwordReset"));
router.use("/", require("./forgotPassword"));
router.use("/", require("./google"));
router.use("/", require("./addSecurityQuestion"));
router.use("/", require("./roles"));
router.use("/", require("./rolesChange"));

module.exports = router;
