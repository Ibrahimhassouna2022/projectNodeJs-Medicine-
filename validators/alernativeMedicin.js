const Joi = require('@hapi/joi')
const schema = Joi.object({
    name: Joi.string().required(), 
    description: Joi.string().required(),
    id_baseMedicin:Joi.array().items(Joi.string()).min(1).required(),
    pharamcy_id: Joi.array().items(Joi.string()).min(1).required() 
})
module.exports=schema;