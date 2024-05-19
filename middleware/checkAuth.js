import jwt from "jsonwebtoken";
import User from "../db/models/User.js";
import HttpError from "../helpers/HttpError.js";

export const checkAuth = async (req, _, next) => {
  try {
    const authHeader = req.headers.authorization;
    !authHeader && next(HttpError(401));

    const [bearer, token] = authHeader.split(" ");
    bearer !== "Bearer" && next(HttpError(401));

    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (err || !decode) {
        // Проверяем наличие ошибки или отсутствие decode
        next(HttpError(401));
        return; // Выходим из функции, чтобы предотвратить дальнейшие действия
      }

      const user = await User.findById(decode.id);
      !user || user.token !== token ? next(HttpError(401)) : null;

      !user._id || !user.email || !user.subscription
        ? next(HttpError(401))
        : null;

      req.user = {
        id: user._id,
        email: user.email,
        subscription: user.subscription,
      };
      next();
    });
  } catch (error) {
    next(error);
  }
};
