const jwt = require("jsonwebtoken");
const { errorObject } = require("../utils/errors.utils");
const UserService = require("../modules/users/services/user.service");

const config = process.env;
const userService = new UserService();

const verifyTokenMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    const error = errorObject(403, "Token requerido para autenticación");
    next(error);
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const today = Date.now() / 1000; //trae fecha en timestamp: ms
    const expirationDate = decoded.exp;
    if (expirationDate < today) {
      const error = errorObject(401, "Token expirado");
      next(error);
    }
    res.locals.user = decoded;
  } catch (err) {
    const error = errorObject(401, "Token invalido");
    next(error);
  }
  return next();
};

const isAdminMiddleware = async (req, res, next) => {
  const tokenDecoded = res.locals.user;
  const user = await userService.getUserById(tokenDecoded.user_id);

  if (!user.admin) {
    const error = errorObject(
      403,
      "No tienes acceso autorizado a este recurso"
    );
    next(error);
  }
  next();
};

const hasAdminRegisterKeyMiddleware = async (req, res, next) => {
  const { ADMIN_REGISTER_KEY } = process.env;
  const { adminregisterkey } = req.headers;
  if (adminregisterkey !== ADMIN_REGISTER_KEY) {
    const error = errorObject(403, "Llave de administrador invalida");
    next(error);
  }
  next();
};

module.exports = {
  verifyTokenMiddleware,
  isAdminMiddleware,
  hasAdminRegisterKeyMiddleware,
};
