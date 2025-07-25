const Joi = require('@hapi/joi')

const schema = Joi.object({
    name: Joi.string().required(), 
    phone: Joi.string().required(),
    location: Joi.string().required() 
})
module.exports=schema;