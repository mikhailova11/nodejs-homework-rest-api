const express = require('express')
const { auth } = require('../../middlewares/auth')
const { upload } = require('../../middlewares/upload')
const {uploadImage} = require('../../services/image.service')
const {updateUser} = require('../../services/user.service')

const router = express.Router()

router.patch('/avatars', auth, upload.single('avatar'), async (req, res, next) => {

  try {
    const {_id: id} = req.user;
  
    const avatarURL =  await uploadImage(id, req.file);
    const user = await updateUser(id, {avatarURL});

    res.json(user)

  } catch (error) {

    next(error) 
  }
 
}
)





module.exports = router