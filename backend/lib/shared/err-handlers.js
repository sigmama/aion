const errStatusCodes = [400, 401, 403, 404, 409, 500, 501, 502, 503, 504, 509];

const errHandlers = {
  throwError: (code, errorMessage) => error => {
    let e;
    if (!error) {
      e = new Error();
    } else {
      e = { ...error };
    }

    e.code = code;
    e.errorMessage = e.errorMessage || errorMessage || "Default Error";
    throw e;
  },

  throwIf: (fn, code, errorMessage) => result => {
    if (fn(result)) {
      return errHandlers.throwError(code, errorMessage)();
    }
    return result;
  },

  sendSuccess: (res, message) => data => {
    res.status(200).json({ message, data });
  },

  sendError: (res, code, message) => error => {
    const errCode =
      error.code && errStatusCodes.includes(error.code) ? error.code : code;
    res.status(errCode).json({
      message: error.errorMessage || message
    });
  }
};

module.exports = errHandlers;
