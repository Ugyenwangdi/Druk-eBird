class AppError extends Error {
  //Inheriting from the parent class Error
  constructor(message, statusCode) {
    //object will take the message and the statusCode
    //call parent constructor using super
    super(message); //message is the parameter that the built-in error accepts
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
