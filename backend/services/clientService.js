import Client from '../models/client.js';

const getAllClients = async () => {
  return await Client.findAll({
    attributes: { exclude: ['password'] },
  });
};

const createClient = async (clientData) => {
  return await Client.create(clientData);
};

const updateClient = async (id, clientData) => {
  const client = await Client.findByPk(id);
  if (!client) {
    throw new Error('Cliente no encontrado');
  }
  return await client.update(clientData);
};

const deleteClient = async (id) => {
  const client = await Client.findByPk(id);
  if (!client) {
    throw new Error('Cliente no encontrado');
  }
  return await client.destroy();
};

export default {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
};
