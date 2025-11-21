const { UserService } = require("../Services/UserService");
const { UserRepository } = require("../Repository/UserRepository");
const UserSchema = require("../Models/UserSchema");

const userRepo = new UserRepository(UserSchema);
const userServe = new UserService(userRepo);

exports.login = async (req, res) => {
  const response = await userServe.Login(req);
  return res.status(response?.statusCode || 500).json(response);
};

exports.registerCustomer = async (req, res) => {
  const response = await userServe.createCustomer(req);
  return res.status(response?.statusCode || 500).json(response);
};

exports.verifyCustomer = async (req, res) => {
  const response = await userServe.activeCustomer(req);
  return res.status(response?.statusCode || 500).json(response);
};

exports.getAllUsers = async (req, res) => {
  const response = await userServe.getAllUsers(req);
  return res.status(response?.statusCode || 500).json(response);
};

exports.getUserById = async (req, res) => {
  console.log(req.params);
  const response = await userServe.getUserById(req);
  return res.status(response?.statusCode || 500).json(response);
};

exports.getProfile = async (req, res) => {
  const response = await userServe.getProfile(req);
  return res.status(response?.statusCode || 500).json(response);
};

exports.updateUser = async (req, res) => {
  const response = await userServe.updateUser(req);
  return res.status(response?.statusCode || 500).json(response);
};

exports.deleteUser = async (req, res) => {
  const response = await userServe.deleteUser(req);
  return res.status(response?.statusCode || 500).json(response);
};
