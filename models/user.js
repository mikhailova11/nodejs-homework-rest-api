const {Schema,  model, SchemaTypes} = require('mongoose');
const Joi = require('joi');
const gravatar = require('gravatar');



const schemaRegister = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  subscription: Joi.string(),
  token: Joi.string(),
  owner: Joi.string(),
})

const schemaLogin = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
})

const schema = new Schema(  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: {
      type: String,
      default: null,
    },
    owner: {
        type: SchemaTypes.ObjectId,
        ref: 'user',
      },
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(this.email, {}, true);
      },
    }
      
  }, {timestamps: true})


const User = model('user', schema)
module.exports = {User, 
    schemaRegister,
    schemaLogin,
};
