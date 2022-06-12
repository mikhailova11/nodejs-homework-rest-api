const validate = (schema) =>{
    return (req, res, next) => {
      const {error } = schema.validate(req.body)
      if(error){
        const er = new Error();
        er.status = 400;
        er.message = error.message;
        throw er;
      }
      next() 
    }
  }
  
  

  module.exports = {validate};