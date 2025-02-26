import CompanyService from "../services/companyService.js";

const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await CompanyService.getAllCompanies();
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

const createCompany = async (req, res) => {
  try {
    console.log("📩 Datos recibidos en backend:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({
          error: "❌ No se recibieron datos en el cuerpo de la petición",
        });
    }

    const { nombre, NIT } = req.body;

    if (!nombre || !NIT) {
      return res
        .status(400)
        .json({ error: "❌ Nombre y NIT son campos requeridos" });
    }

    const company = await CompanyService.createCompany(req.body);
    res.status(201).json({ message: "✅ Empresa creada con éxito", company });
  } catch (error) {
    console.error("❌ Error en createCompany:", error);
    res
      .status(500)
      .json({ error: error.message || "Error al crear la empresa" });
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const company = await CompanyService.updateCompany(req.params.id, req.body);
    res.json(company);
  } catch (error) {
    next(error);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    await CompanyService.deleteCompany(req.params.id);
    res.json({ message: "Empresa eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
};
