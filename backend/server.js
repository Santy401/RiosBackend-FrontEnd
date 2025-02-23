import express from "express";
import { DataTypes } from "sequelize";
import sequelize from "./config/database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import process from "process";
import { Op } from "sequelize";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import sqlite3 from "sqlite3";

const db = new sqlite3.Database(
  "database.sqlite",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error("No se pudo conectar a la base de datos:", err.message);
    } else {
      console.log("Conexión establecida con la base de datos.");
    }
  }
);


db.exec("PRAGMA journal_mode=WAL;", (err) => {
  if (err) {
    console.error("Error al habilitar WAL:", err.message);
  } else {
    console.log("Modo WAL habilitado");
  }
});


db.configure("busyTimeout", 10000);


db.close((err) => {
  if (err) {
    console.error("Error al cerrar la base de datos:", err.message);
  } else {
    console.log("Conexión cerrada correctamente.");
  }
});


const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  credentials: true,
  maxAge: 86400, // 24 horas en segundos
};

app.use(cors(corsOptions));

// Middleware para manejar preflight requests
app.options("*", cors(corsOptions));

// Middleware para errores CORS específicos
app.use((err, req, res, next) => {
  if (err.name === "CORSError") {
    console.error("Error CORS:", err);
    return res.status(403).json({
      message: "Error de CORS: Origen no permitido",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
  next(err);
});

// Middleware de errores
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Error en middleware:", err);
  res.status(500).json({
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Mover la definición de modelos al principio
const users = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

const tasks = sequelize.define(
  "tasks",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observation: {
      type: DataTypes.TEXT,
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "createdAt", // Mapea el nombre del modelo a la columna en la DB
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "companies",
        key: "id",
      },
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Areas",
        key: "id_area",
      },
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        const dueDate = this.getDataValue("dueDate");
        // Formatear la fecha a "yyyy-MM-ddThh:mm"
        return dueDate ? dueDate.toISOString().slice(0, 16) : null;
      },
      set(value) {
        this.setDataValue("dueDate", new Date(value));
      },
    },

    status: {
      type: DataTypes.ENUM("in_progress", "completed"),
      defaultValue: "in_progress",
    },
    updatedAt: {
      type: DataTypes.DATE, // Corrected this line
      field: "updatedAt",
    },
  },
  {
    tableName: "tasks",
    timestamps: true,
  }
);

const Areas = sequelize.define(
  "Areas",
  {
    id_area: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_empresa: {
      type: DataTypes.INTEGER,
      references: {
        model: "companies",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  },
  {
    tableName: "Areas",
    timestamps: true,
  }
);

const companies = sequelize.define(
  "companies",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nit: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    cellphone: DataTypes.STRING,
    dian: DataTypes.STRING,
    legalSignature: DataTypes.STRING,
    accountingSoftware: DataTypes.STRING,
    user: DataTypes.STRING,
    password: DataTypes.STRING,
    mailServer: DataTypes.STRING,
    companyType: {
      type: DataTypes.ENUM("A", "B", "C"),
      defaultValue: "B",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
  },
  {
    tableName: "companies",
    timestamps: true,
    hooks: {
      beforeDestroy: async (company) => {
        // Verificar relaciones antes de eliminar
        const [hasAreas, hasClients] = await Promise.all([
          Areas.findOne({ where: { id_empresa: company.id } }),
          clients.findOne({ where: { company_id: company.id } }),
        ]);

        if (hasAreas || hasClients) {
          throw new Error(
            "No se puede eliminar la empresa porque tiene registros asociados"
          );
        }
      },
    },
  }
);

// Modelo de Clientes
const clients = sequelize.define(
  "clients",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nit: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    cedula: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dianKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    electronicSignature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountingSoftware: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailServer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailServerUser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    claveUser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    claveCC: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    claveSS: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    claveMas: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tipoEmpresa: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "clients",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["nit"],
      },
    ],
  }
);

// Definición de relaciones
tasks.belongsTo(users, { as: "assignedUser", foreignKey: "assigned_to" });
tasks.belongsTo(companies, { as: "company", foreignKey: "company_id" });
tasks.belongsTo(Areas, { as: "area", foreignKey: "area_id" });

// Relaciones de Areas con companies
Areas.belongsTo(companies, {
  foreignKey: "id_empresa",
  as: "companyInfo",
});

companies.hasMany(Areas, {
  foreignKey: "id_empresa",
  as: "areas",
});

// Relaciones de clients con companies
companies.hasMany(clients, {
  foreignKey: "company_id",
  as: "clients",
});

clients.belongsTo(companies, {
  foreignKey: "company_id",
  as: "companyData",
});

// Middleware de autenticación
const authenticateJWT = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    console.log("Auth header:", authHeader);

    const token = authHeader?.replace("Bearer ", "");
    console.log("Token extraído:", token);

    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret_key"
    );
    console.log("Token decodificado:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error de autenticación:", err);
    return res.status(403).json({ message: "Token inválido" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Acceso denegado - Se requieren privilegios de administrador",
    });
  }
  next();
};

// Rutas de usuarios
app.get("/users", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const allUsers = await users.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(allUsers);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// Rutas de tareas
app.get("/tasks", authenticateJWT, async (req, res) => {
  try {
    const query =
      req.user.role === "admin"
        ? {} // Admin ve todas las tareas
        : { where: { assigned_to: req.user.id } }; // Usuario ve solo sus tareas

    const allTasks = await tasks.findAll({
      ...query,
      include: [
        {
          model: users,
          as: "assignedUser",
          attributes: ["id", "name", "email"],
        },
        {
          model: companies,
          as: "company",
          attributes: ["id", "name", "nit"],
        },
        {
          model: Areas,
          as: "area",
          attributes: ["id_area", "nombre_area", "departamento"],
        },
      ],
      order: [["dueDate", "ASC"]],
      attributes: {
        include: [
          "id",
          "title",
          "observation",
          "status",
          "dueDate",
          "createdAt",
          "updatedAt",
        ],
      },
    });

    res.json(allTasks);
  } catch (error) {
    console.error("Error al obtener tareas:", error); // Mostrará el error completo
    res.status(500).json({ message: "Error al obtener tareas", error: error.message });
  }
});

app.post("/tasks", authenticateJWT, async (req, res) => {
  console.log("Datos recibidos en /tasks:", req.body); // Log de datos entrantes
  try {
    const {
      title,
      observation,
      assigned_to,
      company_id,
      area_id,
      dueDate,
      status,
    } = req.body;

    // Verificación de campos obligatorios

    // Validación para asegurarse de que company_id y area_id sean números válidos
    if (isNaN(company_id) || isNaN(area_id)) {
      console.log("Error: company_id o area_id no son números válidos");
      return res
        .status(400)
        .json({ message: "company_id y area_id deben ser números válidos" });
    }

    // Datos de la tarea
    const taskData = {
      title,
      observation,
      assigned_to,
      company_id,
      area_id,
      dueDate,
      status: status || "in_progress", // Si no se proporciona status, se asigna "in_progress"
    };
    console.log("Datos para crear la tarea:", taskData);

    // Crear la tarea en la base de datos
    const task = await tasks.create(taskData);
    console.log("Tarea creada:", task);

    // Obtener la tarea creada con las relaciones
    const taskWithRelations = await tasks.findByPk(task.id, {
      include: [
        {
          model: users,
          as: "assignedUser",
          attributes: ["id", "name", "email"],
        },
        {
          model: companies,
          as: "company",
          attributes: ["id", "name", "nit"],
        },
        {
          model: Areas,
          as: "area",
          attributes: ["id_area", "nombre_area", "departamento"],
        },
      ],
    });
    console.log("Tarea con relaciones obtenida:", taskWithRelations);

    // Responder con la tarea creada y sus relaciones
    res.status(201).json({
      message: "Tarea creada exitosamente",
      task: taskWithRelations,
    });
  } catch (error) {
    console.error("Error al crear tarea:", error.message); // Log de errores
    res.status(500).json({
      message: "Error al procesar la tarea",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.put("/tasks/:id", authenticateJWT, async (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);

    // Verificar si el ID es un número válido
    if (isNaN(taskId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const task = await tasks.findByPk(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Tarea no encontrada",
      });
    }

    // Actualizar solo el estado si es lo único que se envía
    if (req.body.status) {
      await task.update({ status: req.body.status });
    } else {
      await task.update(req.body);
    }

    console.log("Datos recibidos:", req.body);
    console.log("Tarea encontrada:", task);

    await task.update(req.body);
    console.log("Tarea actualizada:", task);

    const updatedTask = await tasks.findByPk(task.id, {
      include: [
        { model: users, as: "assignedUser" },
        { model: companies, as: "company" },
        { model: Areas, as: "area" },
      ],
    });

    console.log("Tarea actualizada con relaciones:", updatedTask);
    console.log("Respuesta de la tarea actualizada:", updatedTask);
    res.json({
      message: "Tarea actualizada exitosamente",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    res.status(500).json({
      message: "Error al actualizar tarea",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.delete("/tasks/:id", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const task = await tasks.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Tarea no encontrada",
        taskId: req.params.id,
      });
    }

    await task.destroy();

    res.json({
      message: "Tarea eliminada exitosamente",
      taskId: req.params.id,
    });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    res.status(500).json({
      message: "Error al eliminar tarea",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Rutas de áreas
app.get("/areas", authenticateJWT, async (req, res) => {
  try {
    console.log("Obteniendo áreas...");
    const allAreas = await Areas.findAll({
      where: { status: "active" },
      attributes: [
        "id_area",
        "nombre_area",
        "departamento",
        "descripcion",
        "status",
      ],
    });

    console.log("Áreas encontradas:", allAreas.length);
    res.json(allAreas);
  } catch (error) {
    console.error("Error al obtener áreas:", error);
    res.status(500).json({ message: "Error al obtener áreas" });
  }
});

app.post("/areas", authenticateJWT, isAdmin, async (req, res) => {
  try {
    console.log("Creando área:", req.body);
    const newArea = await Areas.create({
      ...req.body,
      status: "active",
    });

    // Obtener el área recién creada con todos sus datos
    const areaWithRelations = await Areas.findByPk(newArea.id_area, {
      include: [
        {
          model: companies,
          as: "companyInfo",
          attributes: ["id", "name"],
        },
      ],
    });

    console.log("Área creada:", areaWithRelations);
    res.status(201).json({
      message: "Área creada exitosamente",
      area: areaWithRelations,
    });
  } catch (error) {
    console.error("Error al crear área:", error);
    res.status(500).json({ message: "Error al crear área" });
  }
});

app.put("/areas/:id", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const area = await Areas.findByPk(req.params.id);
    if (!area) {
      return res.status(404).json({
        message: "Área no encontrada",
      });
    }

    await area.update(req.body);

    // Obtener el área actualizada con todos sus datos
    const updatedArea = await Areas.findByPk(req.params.id, {
      include: [
        {
          model: companies,
          as: "companyInfo",
          attributes: ["id", "name"],
        },
      ],
    });

    res.json({
      message: "Área actualizada exitosamente",
      area: updatedArea,
    });
  } catch (error) {
    console.error("Error al actualizar área:", error);
    res.status(500).json({
      message: "Error al actualizar área",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.delete("/areas/:id", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const area = await Areas.findByPk(req.params.id);
    if (!area) {
      return res.status(404).json({ message: "Área no encontrada" });
    }

    await area.destroy();
    res.json({ message: "Área eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar área:", error);
    res.status(500).json({ message: "Error al eliminar área" });
  }
});

// Rutas de empresas
app.get("/companies", authenticateJWT, async (req, res) => {
  try {
    const allCompanies = await companies.findAll({
      attributes: {
        exclude: ["password", "ccPassword", "ssPassword", "anotherPassword"],
      },
    });
    res.json(allCompanies);
  } catch (error) {
    console.error("Error al obtener empresas:", error);
    res.status(500).json({ message: "Error al obtener empresas" });
  }
});

app.post("/companies", authenticateJWT, isAdmin, async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);

    // Validar datos requeridos
    const { name, nit } = req.body;
    if (!name || !nit) {
      return res.status(400).json({
        message: "Nombre y NIT son campos requeridos",
      });
    }

    // Verificar si ya existe una empresa con el mismo NIT
    const existingCompany = await companies.findOne({
      where: { nit: req.body.nit },
    });

    if (existingCompany) {
      return res.status(400).json({
        message: "Ya existe una empresa con este NIT",
      });
    }

    // Crear la empresa
    const newCompany = await companies.create({
      ...req.body,
      status: req.body.status || "active",
      companyType: req.body.companyType || "B",
    });

    console.log("Empresa creada:", newCompany);

    res.status(201).json({
      message: "Empresa creada exitosamente",
      company: newCompany,
    });
  } catch (error) {
    console.error("Error al crear empresa:", error);
    res.status(500).json({
      message: "Error al crear empresa",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.put("/companies/:id", authenticateJWT, isAdmin, async (req, res) => {
  try {
    console.log("Actualizando empresa:", req.params.id, req.body);

    const company = await companies.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({
        message: "Empresa no encontrada",
      });
    }

    // Verificar NIT duplicado solo si se está cambiando
    if (req.body.nit !== company.nit) {
      const existingCompany = await companies.findOne({
        where: {
          nit: req.body.nit,
          id: { [Op.ne]: req.params.id }, // Excluir la empresa actual
        },
      });

      if (existingCompany) {
        return res.status(400).json({
          message: "Ya existe una empresa con este NIT",
        });
      }
    }

    // Actualizar la empresa
    await company.update(req.body);

    console.log("Empresa actualizada:", company);

    res.json({
      message: "Empresa actualizada exitosamente",
      company,
    });
  } catch (error) {
    console.error("Error al actualizar empresa:", error);
    res.status(500).json({
      message: "Error al actualizar empresa",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.delete("/companies/:id", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const company = await companies.findByPk(req.params.id, {
      include: [
        {
          model: Areas,
          as: "areas",
          required: false,
        },
        {
          model: clients,
          as: "clients",
          required: false,
        },
      ],
    });

    if (!company) {
      return res.status(404).json({
        message: "Empresa no encontrada",
      });
    }

    // Verificar si hay áreas o clientes asociados
    if (company.areas && company.areas.length > 0) {
      return res.status(400).json({
        message: "No se puede eliminar la empresa porque tiene áreas asociadas",
        details: `${company.areas.length} área(s) asociada(s)`,
      });
    }

    if (company.clients && company.clients.length > 0) {
      return res.status(400).json({
        message:
          "No se puede eliminar la empresa porque tiene clientes asociados",
        details: `${company.clients.length} cliente(s) asociado(s)`,
      });
    }

    // Si no hay dependencias, eliminar la empresa
    await company.destroy();

    res.json({
      message: "Empresa eliminada exitosamente",
      company_id: req.params.id,
    });
  } catch (error) {
    console.error("Error detallado al eliminar empresa:", error);

    // Manejar errores específicos
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        message:
          "No se puede eliminar la empresa porque tiene registros asociados",
        details: error.message,
      });
    }

    res.status(500).json({
      message: "Error al eliminar la empresa",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Ruta de registro
app.post("/register", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validar datos requeridos
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Nombre, email, contraseña y rol son requeridos",
      });
    }

    // Verificar que el rol sea válido
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({
        message: "Rol inválido. Debe ser 'admin' o 'user'",
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "El email ya está registrado",
      });
    }

    // Crear el usuario
    const newUser = await users.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({
      message: "Error al crear usuario",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Ruta para actualizar usuario
app.put("/users/:id", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const user = await users.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.update(req.body);
    res.json({
      message: "Usuario actualizado",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
});

// Ruta para eliminar usuario
app.delete("/users/:id", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe
    const user = await users.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    // Verificar que no sea el usuario administrador por defecto
    if (user.email === "dev@admin.com") {
      return res.status(403).json({
        message: "No se puede eliminar el usuario administrador por defecto",
      });
    }

    // Verificar si el usuario tiene tareas asignadas
    const userTasks = await tasks.findOne({
      where: { assigned_to: id },
    });

    if (userTasks) {
      return res.status(400).json({
        message:
          "No se puede eliminar el usuario porque tiene tareas asignadas",
      });
    }

    // Eliminar el usuario
    await user.destroy();

    res.json({
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({
      message: "Error al eliminar usuario",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Ruta de login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Intento de login con:", { email });

    if (!email || !password) {
      return res.status(400).json({
        message: "Por favor proporcione email y contraseña",
      });
    }

    const user = await users.findOne({
      where: { email },
      raw: true,
    });

    console.log("Usuario encontrado:", user ? "Sí" : "No");

    if (!user) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    if (password !== user.password) {
      return res.status(401).json({
        message: "Credenciales inválidas",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "24h" }
    );

    const responseData = {
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    console.log("Login exitoso para:", email, "con rol:", user.role);
    res.json(responseData);
  } catch (error) {
    console.error("Error detallado en login:", error);
    console.error(error.stack);
    res.status(500).json({
      message: "Error al procesar el login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Ruta para obtener todos los datos necesarios para crear una tarea
app.get("/task-form-data", authenticateJWT, async (req, res) => {
  try {
    const [allUsers, allCompanies, allAreas] = await Promise.all([
      users.findAll({
        attributes: ["id", "name", "email", "role"],
        where: { role: "user" },
      }),
      companies.findAll({
        attributes: ["id", "name"],
        where: { status: "active" },
      }),
      Areas.findAll({
        include: [
          {
            model: companies,
            as: "company",
            attributes: ["id", "name"],
            required: true,
          },
        ],
        where: { status: "active" },
        attributes: [
          "id_area",
          "nombre_area",
          "departamento",
          "id_empresa",
          "status",
        ],
        raw: false,
        nest: true,
      }),
    ]);

    // Log para depuración
    console.log("Áreas encontradas:", JSON.stringify(allAreas, null, 2));

    res.json({
      users: allUsers,
      companies: allCompanies,
      areas: allAreas.map((area) => ({
        id_area: area.id_area,
        nombre_area: area.nombre_area,
        departamento: area.departamento,
        id_empresa: area.id_empresa,
        status: area.status,
        company: area.company
          ? {
              id: area.company.id,
              name: area.company.name,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("Error detallado al obtener datos:", error);
    res.status(500).json({
      message: "Error al obtener datos del formulario",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Rutas para clientes
app.get("/clients", authenticateJWT, async (req, res) => {
  try {
    const allClients = await clients.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(allClients);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({
      message: "Error al obtener clientes",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.post("/clients", authenticateJWT, isAdmin, async (req, res) => {
  try {
    // Validaciones...

    const newClient = await clients.create(req.body);

    // Obtener el cliente con todas sus relaciones
    const clientWithRelations = await clients.findByPk(newClient.id, {
      include: [
        {
          model: companies,
          as: "companyData",
          attributes: ["id", "name"],
        },
      ],
      attributes: {
        exclude: ["password"],
      },
    });

    res.status(201).json({
      message: "Cliente creado exitosamente",
      client: clientWithRelations,
    });
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // Manejo de errores...
  }
});

app.put("/clients/:id", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const client = await clients.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    await client.update(req.body);
    const clientResponse = client.toJSON();
    delete clientResponse.password;
    res.json(clientResponse);
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar cliente" });
  }
});

app.delete("/clients/:id", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const client = await clients.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    await client.destroy();
    res.json({
      message: "Cliente eliminado exitosamente",
      clientId: req.params.id,
    });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ message: "Error al eliminar cliente" });
  }
});

// Probar la conexión y sincronizar
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión con la base de datos SQLite establecida.");

    // Verificar el archivo de la base de datos
    const dbPath = sequelize.options.storage;
    console.log("Ruta de la base de datos:", dbPath);

    // Sincronizar los modelos de forma segura
    await sequelize
      .sync({
        alter: {
          drop: false,
        },
      })
      .catch((error) => {
        console.error("Error al sincronizar modelos:", error);
        throw error;
      });

    console.log("Modelos sincronizados correctamente");
  } catch (error) {
    console.error("Error de conexión/sincronización:", error);
    console.error("Detalles del error:", error.original || error);
    throw error;
  }
};

// Crear usuario desarrollador por defecto (solo si no existe)
// eslint-disable-next-line no-unused-vars
const createDefaultAdmin = async () => {
  try {
    const devExists = await users.findOne({
      where: { email: "dev@admin.com" },
    });

    if (!devExists) {
      await users.create({
        name: "Desarrollador",
        email: "dev@admin.com",
        password: "dev123",
        role: "admin",
      });
      console.log("Usuario desarrollador inicial creado exitosamente");
    } else {
      console.log("Usuario desarrollador ya existe, no es necesario crearlo");
    }
  } catch (error) {
    console.error("Error al verificar/crear usuario desarrollador:", error);
  }
};

// Iniciar servidor
const startServer = async () => {
  try {
    // Probar la conexión y sincronizar la base de datos
    await testConnection();

    // Iniciar el servidor
    const PORT = process.env.PORT || 6005;
    const server = app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

    // Manejar errores del servidor
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Puerto ${PORT} está en uso. Intentando con otro puerto...`
        );
        setTimeout(() => {
          server.close();
          server.listen(PORT + 1);
        }, 5000);
      } else {
        console.error("Error al iniciar el servidor:", error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    console.error("Detalles del error:", error.original || error);
    process.exit(1);
  }
};

// Agregar manejo de errores no capturados
process.on("uncaughtException", (error) => {
  console.error("Error no capturado:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("Promesa rechazada no manejada:", error);
  process.exit(1);
});

// Ejecutar el servidor
startServer().catch((error) => {
  console.error("Error fatal:", error);
  process.exit(1);
});
