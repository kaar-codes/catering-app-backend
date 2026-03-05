class ErrorHandler {
  catchAsync(req, res) {
    try {
    } catch (error) {
      res
        .status(401)
        .json({ statusCode: error.statusCode, message: error.message });
    }
  }
}

export default new ErrorHandler();
