import { Op } from 'sequelize';

import Area from '../models/areaModel.js';
import Client from '../models/client.js';
import Company from '../models/company.js';

const getAllCompanies = async () => {
  return await Company.findAll({
    attributes: {
      exclude: ['password', 'ccPassword', 'ssPassword', 'anotherPassword'],
    },
  });
};

const createCompany = async (companyData) => {
  const { name, nit } = companyData;
  if (!name || !nit) {
    throw new Error('Nombre y NIT son campos requeridos');
  }

  const existingCompany = await Company.findOne({ where: { nit } });
  if (existingCompany) {
    throw new Error('Ya existe una empresa con este NIT');
  }

  return await Company.create({
    ...companyData,
    status: companyData.status || 'active',
    companyType: companyData.companyType || 'B',
  });
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

  return await company.update(companyData);
};

const deleteCompany = async (id) => {
  const company = await Company.findByPk(id, {
    include: [
      { model: Area, as: 'areas', required: false },
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
