class MatriculaError extends Error {
  constructor(message, statusCode = 400, body = {}) {
    super(message);
    this.body = body;
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = MatriculaError;
