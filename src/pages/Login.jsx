import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import "../styles/stylesLogin.css";
import { motion } from "framer-motion";
import { toast } from 'react-toastify';
import { ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnimating(true);
    try {
      const user = await login(formData.email, formData.password);
      console.log("Login exitoso:", user);
      navigate(user.role === "admin" ? "/dashboard-admin" : "/dashboard-user", { replace: true });
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message || "Error al iniciar sesión");
      toast.error(err.message || "Error al iniciar sesión");
    } finally {
      setIsAnimating(false);
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
        initial={{ opacity: 0 }}
        animate={isAnimating ? {
          scale: 1.2,
          opacity: 0,
          transition: {
            duration: 0.1,
            ease: "easeOut"
          }
        } : {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.1 }
        }}
        exit={{
          scale: 1.2,
          opacity: 0,
          transition: {
            duration: 0.1,
            ease: "easeOut"
          }
        }}
        onSubmit={handleSubmit}
        className="formLogin"
      >
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
            whileHover={{ scale: .9, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            type="submit"
          >
            Iniciar Sesión <ArrowRight />
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};


export default Login;
