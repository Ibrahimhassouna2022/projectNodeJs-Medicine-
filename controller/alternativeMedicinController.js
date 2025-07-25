const createError = require('http-errors');
const { AlternativeMedi } = require('../modal');
const {returnJson}=require('../my_modules/json_response');

// addAltMedi
const createAltMedi=(req,res,next)=>{
    const data={...req.body};
  const validation=  AlternativeMedi.validate(data);
  if(validation.error){
    return next(createError(400,validation.error.message))
  }
  const alternativeMedi=new AlternativeMedi(data);
  alternativeMedi.isExist()
  .then(result=>{
    if(result.cheak){
        return next(createError(409,result.message)) 
    }
    alternativeMedi.save(res,(status)=>{
        if(status.status)
        {
         return  returnJson(res,200,true,'alternativeMedi created Successful',status._id)
        }
        else{
            next(createError(500,status.message))
        }
    })

  })
  .catch(err=>next(createError(500,err.message)));
}
// getAllAltMedi
const getAllAltMedi=(req,res,next)=>{
    AlternativeMedi.findAll()
    .then(alternativeMedi=>res.json(alternativeMedi))
    .catch(err=>next(createError(500,err.message)));
}

// updateAltMedi
const updateAltMedi = (req, res, next) => {
    const { id } = req.query;
    const newData = req.body;
  
     const { ObjectId } = require('mongodb');
    if (!ObjectId.isValid(id)) {
        return next(createError(400, 'Invalid ID'));
    }
// update
    AlternativeMedi.update(id, newData)
        .then(result => {
            if (!result.status) {
                return next(createError(404, 'No documents modified'));
            }
            res.json({ message: 'AlternativeMedi updated successfully' });
        })
        .catch(err => next(createError(500, err.message)));
};

const removeAltMedi=(req,res,next)=>{
    const { ObjectId } = require('mongodb');
    const id = req.query.id;
 
    if (!ObjectId.isValid(id)) {
         return next(createError(400, 'Invalid ID format'));
    }
// remove
    AlternativeMedi.remove(id)
    .then((result)=>{ 
        if(result.status){
            res.json({message:'AlternativeMedi deleted Successfully'});
        }else{
            next(createError(404, result.message));
        }
    })
    .catch(err=>{
         next(createError(500,err.message));
    });
}

////////////
module.exports={
    createAltMedi ,
    getAllAltMedi  ,
    updateAltMedi ,
    removeAltMedi
}