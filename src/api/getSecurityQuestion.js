const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const { sendResponse } = require("./../utils/sendResponse");
const { getSecurityQuestions } = require("../utils/getConfigFile");
router.get("/getSecurityQuestions", check("email").isEmail(), async function(
  req,
  res
) {
  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 400, "Invalid request", {
      errors: errors.array({ onlyFirstError: true })
    });
  }
  const questionsResponse = await getSecurityQuestions();
  if (!questionsResponse.success) {
    return sendResponse(res, 500, "something went wrong on our end");
  } else {
    return res.status(200).send({
      questions: questionsResponse.securityQuestions
    });
  }
});

module.exports = router;
