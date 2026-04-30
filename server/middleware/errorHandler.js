/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong on the server';

  // If it's a validation error from AI or our logic, use 400
  if (message.includes('job description') || message.includes('repetitive')) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    error: message,
    status: statusCode
  });
};

module.exports = errorHandler;
