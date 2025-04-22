import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import "../styles/stylesLogin.css";
import { motion } from "framer-motion";


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(formData.email, formData.password);
      console.log("Login exitoso:", user);
      if (user.role === "admin") {
        navigate("/dashboard-admin", { replace: true });
      } else {
        navigate("/dashboard-user", { replace: true });
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message || "Error al iniciar sesión");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="containerLogin">
      <motion.form
      initial={{ opacity: 0, scale: .7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: .4, ease: "easeInOut" }}
      onSubmit={handleSubmit}
       className="formLogin">

        <h2>Inicia Sesión</h2>
        <div className="inputs-login">
          <input
            type="email"
            autoComplete="off"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            autoComplete="off"
            onChange={handleChange}
            placeholder="Contraseña"
            required
          />
          <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
          whileTap={{ scale: 0.7 }}
          transition={{ duration: 0.1, ease: "easeInOut" }}
          type="submit"
          >Entrar</motion.button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </motion.form>
    </div>
  );
};

export default Login;
