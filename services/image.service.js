
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs').promises;
const {AVATARS, PUBLIC_DIR} = require('../helpers/consts')




  


const uploadImage =  async(id, file) => {
  const avatarURL = path.join(AVATARS, `${id}${file.originalname}`)

  try {
     const img = await Jimp.read(file.path)  
      img  
     .resize(250, 250) 
     .write(path.join(PUBLIC_DIR, avatarURL)); 
     return avatarURL 

  } catch (error) {
    console.log(error)
    throw error
  } finally{
    await fs.unlink(file.path)
  }
}

module.exports ={
  uploadImage,
}


