const { Router } = require('express'); 
const router = Router(); 
const {MedicinController} = require('../controller');
 
const {auth}=require('../middlewares');

 router
.get('/getAllMedicin',auth,MedicinController.getAllMedicin)
.post("/createMedicin",auth,MedicinController.createMedicin)
.put("/updateMedicin",auth,MedicinController.updateMedicin)
.delete("/removeMedicin",auth,MedicinController.removeMedicin);
module.exports=router;