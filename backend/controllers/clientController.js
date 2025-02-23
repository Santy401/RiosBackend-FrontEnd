import ClientService from '../services/clientService.js';

const getAllClients = async (req, res, next) => {
  try {
    const clients = await ClientService.getAllClients();
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    const client = await ClientService.createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const client = await ClientService.updateClient(req.params.id, req.body);
    res.json(client);
  } catch (error) {
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    await ClientService.deleteClient(req.params.id);
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
};
