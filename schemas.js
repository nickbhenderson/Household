const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.rentItemSchema = Joi.object({
  rentItem: Joi.object({
    reason: Joi.string().required().escapeHTML(),
    cost: Joi.number().required().min(0),
    desc: Joi.string().required().escapeHTML(),
    date: Joi.string().allow(null, "").escapeHTML(),
  }).required(),
  recurring: Joi.string(),
});
