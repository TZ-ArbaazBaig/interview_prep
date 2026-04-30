/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong on the server';

  res.status(statusCode).json({
    error: message,
    status: statusCode
  });
};

module.exports = errorHandler;
