const router = require("express").Router();
const handleAsyncErrors = require("../utils/errorHandler");
const { sendResponse } = require("./../utils/sendResponse");
const { getSecurityQuestions } = require("../utils/getConfigFile");

router.get(
  "/getSecurityQuestions",
  handleAsyncErrors(async function(req, res) {
    const questionsResponse = await getSecurityQuestions();
    if (!questionsResponse.success) {
      return sendResponse(
        res,
        500,
        "No security question could be parsed from config file"
      );
    } else {
      return res.status(200).send({
        questions: questionsResponse.securityQuestions
      });
    }
  })
);

module.exports = router;
