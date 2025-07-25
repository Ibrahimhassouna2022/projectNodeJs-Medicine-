const { response } = require('express');
const authRoutes = require('./auth'); 
const pharmacyRoutes = require('./pharmacy');
const medicinRoutes = require('./medicines');
const alternativeMedicinRoutes = require('./alternativeMedicin');
 
 
module.exports = (app) => {
    app.get('/', (req, res, next) => {
        res.status(200).json({
            status: true,
            message: null
        })
    })
    app.use('/altMedi',alternativeMedicinRoutes)
    app.use('/medicin',medicinRoutes)
    app.use('/pharmacy',pharmacyRoutes)
     app.use('/auth', authRoutes);  
};
