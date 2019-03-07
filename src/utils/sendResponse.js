const sendResponse = (res, status, message) => {
  res.status(status).send({
    status,
    message
  });
};

module.exports = {
  sendResponse
};
