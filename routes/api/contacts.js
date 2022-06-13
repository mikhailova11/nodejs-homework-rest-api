const express = require('express')
const {Contacts, schemaForPost, schemaForPatch} = require('../../models/contacts')
const {validate} = require('../../middlewares/validate')
const { auth } = require('../../middlewares/auth')

const router = express.Router()

router.get('/', auth, async (req, res, next) => {
  try {
    const {page, limit} = req.query
    const skiped = (page-1)*limit
    const skip = skiped < 0? 0:skiped

    res.json(await Contacts.find({},{},{skip, limit: +limit}))
    
  } catch (error) {
    next(error)
  }
})

router.get('/:contactId', auth, async (req, res, next) => {
  try {
    const {contactId} = req.params
    const contactInfo = await Contacts.findOne({_id : contactId})
      if(!contactInfo){
      return res.status(404).json({"message": "Not found"})
    }
    res.json(contactInfo);
  } catch (error) {
    next(error)
  }
})

router.post('/', auth,  validate(schemaForPost), async (req, res, next) => {
  try {
    const {name, email, phone} = req.body

    res.status(201).json(await Contacts.create({name, email, phone}))
  } catch (error) {
    next(error)
  }
 
})

router.delete('/:contactId', auth, async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const contactInfo = await Contacts.remove({_id : contactId});
  
    if(!contactInfo){
     res.status(404).json({"message": "Not found"}) 
    } else {
      res.status(204).json({"message": "contact deleted"})  
    }  
  } catch (error) {
    next(error)
  }
})

router.put('/:contactId', auth, async (req, res, next) => {
  try {
    const {contactId} = req.params

    const putContact = await Contacts.findByIdAndUpdate({_id : contactId}, req.body, { new: true })
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

router.patch('/:contactId/favorite', auth, validate(schemaForPatch),  async (req, res, next) => {
  try {
    const {contactId} = req.params

    const contactInfo = await Contacts.findByIdAndUpdate({_id : contactId}, req.body, { new: true })
    if(!contactInfo){
      res.status(404).json({"message": "Not found"})
    } 
    return res.json(contactInfo)
    
} catch (error) {
  next(error)
}
})

module.exports = router
