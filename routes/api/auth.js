const express = require('express')
const {validate} = require('../../middlewares/validate')
const {User, schemaRegister, schemaLogin} = require('../../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../../env')
const { auth } = require('../../middlewares/auth')
const {sendEmail} = require('../../services/email.service')
const { findUser, updateUser } = require('../../services/user.service')

const router = express.Router()

router.get('/verify/:verificationToken', async (req, res, next) => {
  try {
      const {verificationToken} = req.params;
      const user = await findUser({verificationToken});

      if(!user) {
        res.status(404).json({message: "User not found"});
      }

      await updateUser(user._id, {verify: true, verificationToken: null });
      return res.status(200).json({
          code: 200,
          message: "Email was confirmed",
      });
  } catch (e) {
      next(e);
  }
}); 



router.post('/verify', async (req, res, next) => {
  try {
      const {email} = req.body;
      const user = await findUser({email});
      if(!user) {
        res.status(400).json({message: "Missing required field email"});
      } 

      if(user.verify){
        res.status(400).json({message: "Verification has already been passed"});
      }

      await sendEmail(user.email, user.verificationToken);
      return res.status(200).json({
          code: 200,
          message: 'check your email'
      });
  } catch (e) {
      next(e);
  }
});


router.post('/users/signup', validate(schemaRegister),
async (req, res, next) => {
  try {
    const {email, password} = req.body
    const user =  await User.findOne({email: email});

   if(user){
    res.status(409).json({"message":"Email in use"})
   }
   const hashedPassword = await bcrypt.hash(password, 10)
   const registerUser = await User.create({... req.body, password: hashedPassword})
   res.status(201).json(registerUser)

   await sendEmail(registerUser.email, registerUser.verificationToken)
   
  } catch (error) {
    next(error)
  }
})

router.post('/users/login', validate(schemaLogin),
async (req, res, next) => {
  try {
    const {email, password} = req.body
    const user =  await User.findOne({email});
    const isValid = await bcrypt.compare(password, user.password)
    
    if(user && !user.verify){
      res.status(401).json({"message":"Please confirm your email"})
  }

   if(!user || !isValid){
    res.status(401).json({"message":"Email or password is wrong"})
  }

   const payload = {
    _id: user._id,
    subscription: user.subscription,
  }

  const token =  jwt.sign(payload, SECRET_KEY, {expiresIn: "1h"})
  await User.findByIdAndUpdate(user._id, {token})
  res.json({token})

  } catch (error) {
    next(error) 
  }
})

router.get('/users/logout', auth,
async (req, res, next) => {
  try {
    const {_id} = req.user
    
    if(!_id){
      res.status(401).json({message: "Not authorized"})
    }

  await User.findByIdAndUpdate(_id, {token: null});
  res.status(204).json({message:"No Content"})

  } catch (error) {
    next(error)
  }
})

router.get('/users/current', auth,
async (req, res, next) => {
  try {

    const {_id} = req.user
    const user =  await User.findOne({_id});
    if(!user){
      res.status(401).json({message: "Not authorized"})
    }
    res.json({user})

  } catch (error) {
    next(error) 
  }
})







module.exports = router
