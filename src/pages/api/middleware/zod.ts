import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { AnyZodObject, ZodError, z } from "zod";

export interface NextApiRequestWithData<T> extends NextApiRequest {
  parsed: T;
}

/**
 * Validates the request body, and query against a given schema.
 */
export const validate = (schema: AnyZodObject) => {
  type Type = z.infer<typeof schema>;

  return async (req: NextApiRequestWithData<Type>, res: NextApiResponse, next: NextHandler) => {
    try {
      const data = await schema.parseAsync({
        body: req.body,
        query: req.query,
      });
      req.parsed = data
      return next();
    } catch (error) {
      return res.status(400).json({ errors: convertErrors(error as ZodError) });
    }
  };
}

/**
 * Converts a ZodError object into a nested object that maps the error paths to their corresponding error messages.
 *
 * @param zodError The ZodError object to be converted.
 * @return The nested object that maps the error paths to their corresponding error messages.
 */
function convertErrors(zodError: ZodError) {
  let result: any = {};
  for (let error of zodError.issues) {
    let path = error.path;
    let message = error.message;
    let temp = result;
    for (let i = 0; i < path.length; i++) {
      let key = path[i];
      if (i === path.length - 1) {
        temp[key] = message;
      } else {
        if (!(key in temp)) {
          temp[key] = {};
        }
        temp = temp[key];
      }
    }
  }
  return result;
}