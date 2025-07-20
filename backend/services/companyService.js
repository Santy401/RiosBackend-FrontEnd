import { Op } from 'sequelize';

import area from '../models/areaModel.js';
import Client from '../models/client.js';
import Company from '../models/company.js';

const getAllCompanies = async () => {
  try {
    const companies = await Company.findAll({
      attributes: {
        exclude: ['ccPassword', 'ssPassword', 'anotherPassword'],
      },
      include: [
        { model: area, as: 'areas' },
        { model: Client, as: 'clients' },
      ],
    });
    console.log(companies);
    return companies;
  } catch (error) {
    console.error('❌ Error al obtener las empresas:', error);
    throw new Error('No se pudieron obtener las empresas');
  }
};


const createCompany = async (companyData) => {
  try {
    const { name, nit } = companyData;
    console.log("🔍 Validando datos:", companyData);

    if (!name || !nit) {
      throw new Error("❌ Nombre y NIT son requeridos");
    }

    const existingCompany = await Company.findOne({ where: { nit } });
    if (existingCompany) {
      throw new Error("❌ Ya existe una empresa con este NIT");
    }

    return await Company.create({
      ...companyData,
      status: companyData.status || "active",
      companyType: companyData.companyType || "A",
    });
  } catch (error) {
    console.error("❌ Error al crear una empresa:", error);
    throw error;
  }
};

const updateCompany = async (id, companyData) => {
  const company = await Company.findByPk(id);
  if (!company) {
    throw new Error('Empresa no encontrada');
  }

  if (companyData.nit && companyData.nit !== company.nit) {
    const existingCompany = await Company.findOne({
      where: {
        nit: companyData.nit,
        id: { [Op.ne]: id },
      },
    });
    if (existingCompany) {
      throw new Error('Ya existe una empresa con este NIT');
    }
  }

  const updatedCompany = await company.update(companyData);
  return updatedCompany;
};

const deleteCompany = async (id) => {
  const company = await Company.findByPk(id, {
    include: [
      { model: area, as: 'areas', required: false },
      { model: Client, as: 'clients', required: false },
    ],
  });

  if (!company) {
    throw new Error('Empresa no encontrada');
  }

  if (company.areas.length > 0) {
    throw new Error('No se puede eliminar la empresa porque tiene áreas asociadas');
  }

  if (company.clients.length > 0) {
    throw new Error('No se puede eliminar la empresa porque tiene clientes asociados');
  }

  return await company.destroy();
};

export default {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
};
