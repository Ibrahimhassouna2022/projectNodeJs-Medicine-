const { Router } = require('express'); 
const router = Router(); 
const {AlternativeMedicinController } = require('../controller');
 
const {auth}=require('../middlewares');

 router
.get('/getAllAltMedi',auth,AlternativeMedicinController.getAllAltMedi)
.post("/createAltMedi",auth,AlternativeMedicinController.createAltMedi)
.put("/updateAltMedi",auth,AlternativeMedicinController.updateAltMedi)
.delete("/removeAltMedi",auth,AlternativeMedicinController.removeAltMedi);
module.exports=router;