import AreaService from '../services/areaService.js';

const getAllAreas = async (req, res, next) => {
  try {
    const areas = await AreaService.getAllAreas();
    res.json(areas);
  } catch (error) {
    next(error);
  }
};

const createArea = async (req, res, next) => {
  try {
    console.log(req.body);
    const area = await AreaService.createArea(req.body);
    res.status(201).json(area);
  } catch (error) {
    next(error);
  }
};

const updateArea = async (req, res, next) => {
  try {
    const area = await AreaService.updateArea(req.params.id, req.body);
    res.json(area);
  } catch (error) {
    next(error);
  }
};

const deleteArea = async (req, res, next) => {
  try {
    await AreaService.deleteArea(req.params.id);
    res.json({ message: 'Área eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllAreas,
  createArea,
  updateArea,
  deleteArea,
};
