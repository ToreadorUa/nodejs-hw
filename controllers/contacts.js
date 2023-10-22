const contacts = require("../models/contacts.js");
const HttpError = require("../helpers/HttpError");
const { schema, favoriteSchema } = require("../models/contacts.js");
const { Contact } = require("../models/contacts.js");

const getAll = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { page = 1, limit = 5, favorite = 0 } = req.query;
    console.log(req.query);
    const skip = (page - 1) * limit;
    let result;
    if (favorite) {
      result = await Contact.find({owner:_id, favorite: "true" }, "", { skip, limit });
    } else {
      result = await Contact.find({owner:_id}, "", { skip, limit });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params; // get id  value from request
    const result = await Contact.findById(id);
    if (!result) throw HttpError(404, "Contact Not Found!");
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;

    console.log(req.user);
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndRemove(id);
    if (!result) throw HttpError(404, "Contact Not Found");
    res.json({ message: "Delete Successful" });
  } catch (error) {
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    console.log(result);
    if (!result) throw HttpError(404, "Contact Not Found");
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) throw HttpError(404, "Contact Not Found");
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getContactById,
  add,
  removeContact,
  update,
  updateFavorite,
};
