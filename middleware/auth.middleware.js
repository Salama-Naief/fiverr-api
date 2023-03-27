import jwt from "jsonwebtoken";
import UnauthenticatedError from "../error/unauthenticated.error.js";
/*const auth = async (req, res, next) => {
  let token = "";
  const cookeToken = req.cookies.token;
  const authHeader = req.headers.authorization;

  //check header
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  //check cookie
  else if (cookeToken) {
    token = cookeToken;
  }

  if (!token) throw new UnauthenticatedError("Authentication invalid");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new UnauthenticatedError("token invalid");
    }
    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthenticatedError("token invalid");
  }
};
*/
const auth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    throw new UnauthenticatedError("token invalid");
  }
};
export default auth;
