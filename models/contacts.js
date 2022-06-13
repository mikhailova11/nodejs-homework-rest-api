const {Schema,  model} = require('mongoose');
const Joi = require('joi');

const schemaForPost= Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  phone: Joi.string().min(9).max(30).required(),
  favorite: Joi.bool()
    
})

const schemaForPatch = Joi.object({
  favorite: Joi.bool().required()   
})


const schema = new Schema(  {
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
})



const Contacts = model('contacts', schema)
module.exports = {Contacts, 
  schemaForPost, 
  schemaForPatch, 
  };
