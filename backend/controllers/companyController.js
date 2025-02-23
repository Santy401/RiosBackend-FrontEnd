import CompanyService from '../services/companyService.js';

const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await CompanyService.getAllCompanies();
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

const createCompany = async (req, res, next) => {
  try {
    const company = await CompanyService.createCompany(req.body);
    res.status(201).json(company);
  } catch (error) {
    next(error);
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
    res.json({ message: 'Empresa eliminada correctamente' });
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
