import { DatabaseError, ValidationError } from "./CustomErrors.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof DatabaseError || err instanceof ValidationError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;
