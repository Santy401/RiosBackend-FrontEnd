import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Credenciales incorrectas" });

  
    // eslint-disable-next-line no-undef
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

 
    res.status(200).json({ token, role: user.role });
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};
