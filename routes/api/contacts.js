const express = require('express')
const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  phone: Joi.string().min(9).max(30).required()
})

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../models/contacts')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    res.json(await listContacts())
  } catch (error) {
    next(error)
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const {contactId} = req.params
    const contactInfo = await getContactById(contactId)
      if(!contactInfo){
      return res.status(404).json({"message": "Not found"})
    }
    res.json(contactInfo);
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {error} = schema.validate(req.body)
    if(error){
      const er = new Error();
      er.status = 400;
      er.message = error.message;
      throw er;
    }

    const {name, email, phone} = req.body
    
    res.status(201).json(await addContact({name, email, phone}))
  } catch (error) {
    next(error)
  }
 
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const contactInfo = await removeContact(contactId);
  
    if(!contactInfo){
     res.status(404).json({"message": "Not found"}) 
    } else {
      res.status(204).json({"message": "contact deleted"})  
    }  
  } catch (error) {
    next(error)
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const {error} = schema.validate(req.body)

    if(error){
      const er = new Error();
      er.status = 400;
      er.message = {"message": "missing fields"};
      throw er;
    } 
    const {contactId} = req.params
    const putContact = await updateContact(contactId, req.body)
    if(!putContact){
      res.status(400).json({"message": "missing fields"})
    } else {

    return res.json(putContact)
    }
    res.status(404).json({"message": "Not found"})

  } catch (error) {
    next(error)
  }
})

module.exports = router
