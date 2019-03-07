const sendResponse = function(res, status, message) {
  res.status(status).send({
    status,
    message
  });
};

module.exports = {
  sendResponse
};
