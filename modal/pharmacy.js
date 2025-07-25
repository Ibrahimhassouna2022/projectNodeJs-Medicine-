const { ObjectId } = require('mongodb');
const dbConnection  = require('../configurations');
const { pharmacyValidator } = require('../validators');
const { hashSync, compareSync } = require('bcryptjs');
class Pharmacy{
    constructor(PharmacyData){
        this.PharmacyData = PharmacyData;
    }
   
    isExist() {
        return new Promise((resolve, reject) => {
          dbConnection('pharmacies', async (collection) => {
            try {
              const name = this.PharmacyData.name?.trim().toLowerCase();
              const phone = this.PharmacyData.phone?.trim();
              
              const pharmacy = await collection.findOne({
                '$or': [
                  { name: name },
                  { phone: phone }
                ]
              });
      
              if (!pharmacy) {
                return resolve({ check: false });
              }
      
              if (pharmacy.phone === phone) {
                return resolve({ check: true, message: 'The phone is already used' });
              }
      
              if (pharmacy.name.toLowerCase() === name) {
                return resolve({ check: true, message: 'The name is already used' });
              }
      
              // fallback (shouldn't happen)
              return resolve({ check: true, message: 'Pharmacy already exists' });
      
            } catch (err) {
              return reject(err);
            }
          });
        });
      }
      
    static validate(PharmacyData) {
        try {
            const validationResult = pharmacyValidator.validate(PharmacyData)
            return validationResult;
        } catch (err) {
            return false
        }
    }
// insert pharmacy
save(res, cb) {
    dbConnection('pharmacies', async (collection) => {
      try {
        const result = await collection.insertOne(this.PharmacyData);
        cb({
          status: true,
          _id: result.insertedId
        });
      } catch (err) {
        cb({
          status: false,
          message: err.message
        });
      }
    });
  }
  
// find All
static findAll(){
    return new Promise((resolve,reject)=>{
        dbConnection('pharmacies',async(collection)=>{
            try{
                const pharmacies=await collection.find().toArray();
                resolve(pharmacies);
            }catch(err){reject(err.message);}
        });

    });
}
// update Pharmacy
static update(id,newData){
    return new Promise((resolve,reject)=>{
        dbConnection('pharmacies', async (collection) => {
            try{
              const result = await collection.updateOne  (
                    {'_id':new ObjectId(id)},
                    {$set:newData}
                )
                resolve ({status:true})
            }catch(err){
                reject(err);
            }
        });
    });

}
// 
static remove(id) {
    return new Promise((resolve, reject) => {
        dbConnection('pharmacies', async (collection) => {
            try {
                
              const { ObjectId } = require('mongodb');
              const objectId = new ObjectId(id);

              const result = await collection.deleteOne({ _id: objectId });

              if (result.deletedCount === 1) {
                  resolve({ status: true });
              } else {
                  resolve({
                      status: false,
                      message: 'No document found to delete'
                  });
              }
                
            } catch (err) {
                reject(err);
            }
        });
    });
}


}
module.exports=Pharmacy;//