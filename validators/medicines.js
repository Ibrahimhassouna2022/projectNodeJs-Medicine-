const Joi = require('@hapi/joi')
const schema = Joi.object({
    name: Joi.string().required(), 
    description: Joi.string().required(),
    pharamcy_id: Joi.string().required() 
})
module.exports=schema;