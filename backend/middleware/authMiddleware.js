import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Acceso denegado, no hay token" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Formato de token inválido" });
  }

  try {
    // eslint-disable-next-line no-undef
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.id;
    next();
  } catch (error) {
    console.error("Error al verificar el token:", error.message);
    return res.status(400).json({ message: "Token inválido" });
  }
};

export default authMiddleware;
