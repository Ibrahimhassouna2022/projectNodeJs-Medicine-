const { schema, loginSchema } = require('./user');
const pharamcy = require('./pharamcy');
const medicines = require('./medicines');
const alternativeMedi = require('./alernativeMedicin');
module.exports = {userValidator: schema, loginValidator: loginSchema,
    pharmacyValidator:pharamcy,
    medicinesValidator:medicines,
    alternativeMediValidator:alternativeMedi }
