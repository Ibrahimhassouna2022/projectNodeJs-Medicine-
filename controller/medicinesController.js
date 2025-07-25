const createError = require('http-errors');
const { Medicines } = require('../modal');
const {returnJson}=require('../my_modules/json_response')
// addMedicin
const createMedicin=(req,res,next)=>{
    const data={...req.body};
  const validation=  Medicines.validate(data);
  if(validation.error){
    return next(createError(400,validation.error.message))
  }
 
  const medicine=new Medicines(data);
//   if Exisit ?
  medicine.isExist()
  .then(result=>{
    if(result.cheak){
        return next(createError(409,result.message)) 
    }
    // save Data
    medicine.save(res,(status)=>{
        if(status.status)
        {
         return  returnJson(res,200,true,'Medicin created Successful',status._id)
        }
        else{
            next(createError(500,status.message))
        }
    })

  })
  .catch(err=>next(createError(500,err.message)));
}
// getAllMedicin
const getAllMedicin=(req,res,next)=>{
    Medicines.findAll()
    .then(medicines=>res.json(medicines))
    .catch(err=>next(createError(500,err.message)));
}

// updateMedicin
const updateMedicin = (req, res, next) => {
    const { id } = req.query;
    const newData = req.body;
 
     const { ObjectId } = require('mongodb');
    if (!ObjectId.isValid(id)) {
        return next(createError(400, 'Invalid ID'));
    }

    Medicines.update(id, newData)
        .then(result => {
            if (!result.status) {
                return next(createError(404, 'No documents modified'));
            }
            res.json({ message: 'Medicin updated successfully' });
        })
        .catch(err => next(createError(500, err.message)));
};

// delteMedicin  
const removeMedicin=(req,res,next)=>{
    const { ObjectId } = require('mongodb');
    const id = req.query.id;
 
    if (!ObjectId.isValid(id)) {
         return next(createError(400, 'Invalid ID format'));
    }
    // remove
    Medicines.remove(req.params.id)
    .then(()=>res.json({message:'Medicin deleted Successfully'}))
    .catch(err=>next(createError(500,err.message)));
}
module.exports={
    createMedicin ,
    getAllMedicin  ,
    updateMedicin ,
    removeMedicin
}