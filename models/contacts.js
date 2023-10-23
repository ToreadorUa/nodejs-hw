const { Schema, model } = require('mongoose');
const Joi = require("joi");
const handleMongooseError = require('../middlewares/handleMongooseError');

const contactSchema = new Schema(
    {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  }
)

contactSchema.post("save", handleMongooseError) // middleware set error status 400

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(8).required(),
  favorite: Joi.boolean()
});

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
})

const Contact = model('contact', contactSchema);

module.exports = {Contact, schema, favoriteSchema};