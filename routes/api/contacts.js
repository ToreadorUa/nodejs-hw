const express = require("express");
const ctrl = require('../../controllers/contacts');
const isValidId = require("../../middlewares/isValidId");
const isValidateBody = require("../../middlewares/isValidateBody");
const { schema, favoriteSchema } = require("../../models/contacts");

const router = express.Router(); // create object of webserver (створюємо сторінку записної книжки)

router.get("/", ctrl.getAll );

router.get("/:id", isValidId, ctrl.getContactById);

router.post("/", isValidateBody(schema), ctrl.add );

router.delete("/:id", isValidId, ctrl.removeContact);

router.put("/:id", isValidId, isValidateBody(schema), ctrl.update);

router.patch("/:id/favorite", isValidId, isValidateBody(favoriteSchema), ctrl.updateFavorite);

module.exports = router;
