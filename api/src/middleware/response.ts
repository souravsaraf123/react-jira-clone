import { NextFunction, Request, Response } from "express";

export const addRespondToResponse = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.respond = async (data) => {
    console.log("Success Response : ", {
      code: 200,
      ...data,
    });
    await req.dbConnection.close();
    res.status(200).send(data);
  };
  next();
};
