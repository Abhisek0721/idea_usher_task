import { NextFunction, Request, Response } from "express";

export const validateQueryParams = (requiredFields: string[]) => (req:Request, res:Response, next:NextFunction) => {
  const query = req.query;
  const extraFields = Object.keys(query).filter(
    (key) => !requiredFields.includes(key)
  );

  if (extraFields.length > 0) {
    return res.status(400).json({
      status: false,
      message: `Invalid parameters: ${extraFields.join(", ")}`,
    });
  }
  next();
};
