const express = require("express");
const ctrl = require('../../controllers/contacts');
const isValidId = require("../../middlewares/isValidId");
const isValidateBody = require("../../middlewares/isValidateBody");
const { schema, favoriteSchema } = require("../../models/contacts");
const authenticate = require("../../middlewares/authenticate");

const router = express.Router(); // create object of webserver (створюємо сторінку записної книжки)

router.get("/", authenticate, ctrl.getAll );

router.get("/:id", authenticate, isValidId, ctrl.getContactById);

router.post("/", authenticate, isValidateBody(schema), ctrl.add );

router.delete("/:id",authenticate, isValidId, ctrl.removeContact);

router.put("/:id", authenticate, isValidId, isValidateBody(schema), ctrl.update);

router.patch("/:id/favorite", authenticate,  isValidId, isValidateBody(favoriteSchema), ctrl.updateFavorite);

module.exports = router;
