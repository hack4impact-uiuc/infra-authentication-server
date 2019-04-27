const router = require("express").Router();
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator/check");
const { sendResponse } = require("../utils/sendResponse");
const { sendPasswordChangeEmail } = require("../utils/sendMail");
const handleAsyncErrors = require("../utils/errorHandler");
const { signAuthJWT, verifyAuthJWT } = require("../utils/jwtHelpers");
const { verifyUser } = require("./../utils/userVerification");
const { isGmailEnabled } = require("../utils/getConfigFile");

router.post(
  "/changePassword",
  [
    check("currentPassword")
      .isString()
      .isLength({ min: 1 }),
    check("newPassword")
      .isString()
      .isLength({ min: 1 })
  ],
  handleAsyncErrors(async function(req, res) {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, 400, "Invalid request", {
        errors: errors.array({ onlyFirstError: true })
      });
    }

    const user = await verifyUser(req.headers.token);
    if (user.errorMessage != null) {
      return sendResponse(res, 400, user.errorMessage);
    }

    const userId = user._id;
    if (
      userId === null ||
      !(await verifyAuthJWT(req.headers.token, userId, user.password))
    ) {
      sendResponse(res, 400, "Invalid JWT token");
    } else if (user) {
      const oldPasswordMatches = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (oldPasswordMatches) {
        user.password = await bcrypt.hash(req.body.newPassword, 10);
        await user.save();
        var new_token = await signAuthJWT(userId, user.password);
        const usingGmail = await isGmailEnabled();
        if (usingGmail) {
          try {
            await sendPasswordChangeEmail(user.email);
            return sendResponse(res, 200, "Successful change of password!");
          } catch (e) {
            console.log(e);
            return sendResponse(
              res,
              500,
              "Confirm email could not be sent despite Gmail being enabled. This is likely due to incorrect Gmail keys set as environment variables. Password still reset."
            );
          }
        } else {
          sendResponse(res, 200, "Successful change of password!", {
            token: new_token
          });
        }
      } else {
        sendResponse(res, 400, "Current password is incorrect");
      }
    } else {
      sendResponse(res, 400, "User does not exist.");
    }
  })
);

module.exports = router;
