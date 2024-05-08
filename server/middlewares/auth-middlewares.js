import { db } from "../db/index.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userQuery  = await db.query("select id, name, username, email from profile where id=$1", [decodedToken?.id]);

    if (userQuery.rows.length === 0) {
     
      throw new ApiError(401, "Invalid access token");
    }
    const user = userQuery.rows[0];
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, err?.message || "Invalid access token");
  }
});

export const getLoggedInUserOrIgnore = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userQuery  = await db.query("select id, name, username, email from profile where id=$1", [decodedToken?.id]);
    const user = userQuery.rows[0];
    req.user = user;
    next();
  } catch (err) {
    next();
  }
});


// export const verifyPermission = (roles = []) =>
//   asyncHandler(async (req, res, next) => {
//     if (!req.user?.id) {
//       throw new ApiError(401, "Unauthorized request");
//     }
//     if (roles.includes(req.user?.role)) {
//       next();
//     } else {
//       throw new ApiError(403, "You are not allowed to perform this action");
//     }
//   });

export const avoidInProduction = asyncHandler(async (req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    next();
  } else {
    throw new ApiError(
      403,
      "This service is only available in the local environment."
    );
  }
});
