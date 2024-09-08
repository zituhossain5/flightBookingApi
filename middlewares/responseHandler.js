export const responseHandler = (
  res,
  statusCode,
  message,
  success,
  data = {}
) => {
  return res.status(statusCode).json({
    message,
    success,
    ...data,
  });
};

export const errorHandler = (res, error, statusCode = 500) => {
  console.log(error);
  return res.status(statusCode).json({
    message: "Something went wrong",
    success: false,
  });
};
