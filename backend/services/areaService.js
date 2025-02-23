import Area from '../models/areaModel.js';

const getAllAreas = async () => {
  return await Area.findAll({
    where: { status: 'active' },
    attributes: ['id_area', 'nombre_area', 'departamento', 'descripcion', 'status'],
  });
};

const createArea = async (areaData) => {
  return await Area.create({
    ...areaData,
    status: 'active',
  });
};

const updateArea = async (id, areaData) => {
  const area = await Area.findByPk(id);
  if (!area) {
    throw new Error('Área no encontrada');
  }
  return await area.update(areaData);
};

const deleteArea = async (id) => {
  const area = await Area.findByPk(id);
  if (!area) {
    throw new Error('Área no encontrada');
  }
  return await area.destroy();
};

export default {
  getAllAreas,
  createArea,
  updateArea,
  deleteArea,
};
