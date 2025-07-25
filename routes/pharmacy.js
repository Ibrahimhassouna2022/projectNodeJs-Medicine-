const { Router } = require('express');
const router =  Router();
const {pharmacyController } = require('../controller'); 
const {auth}=require('../middlewares'); 
router
.get('/getAllPharmacy',auth,pharmacyController.getAllPharmacy)
.post("/createPharmacy",auth,pharmacyController.createPharmacy)
.put("/updatePharmacay",auth,pharmacyController.updatePharmacay)
.delete("/removePharmacay",auth,pharmacyController.removePharmacay);
module.exports=router;