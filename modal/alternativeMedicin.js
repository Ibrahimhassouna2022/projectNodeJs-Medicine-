const { ObjectId } = require('mongodb');
const dbConnection  = require('../configurations');
const {  alternativeMediValidator } = require('../validators');
 

class AlternativeMedi{

    constructor(alternativeMedicinesData){
        this.alternativeMedicinesData = alternativeMedicinesData;
    }
   
    isExist() {
        return new Promise((resolve, reject )=> {
            dbConnection('alternativeMedicines', async (collection) => {
                try {
                    
           const altwrMe = await collection.findOne({name: this.alternativeMedicinesData.name})
                    if (!altwrMe) {
                        resolve ({
                            check: false
                        })
                    } else {
                        if (altwrMe.name === this.alternativeMedicinesData.name) {
                            resolve ({ 
                                check: true,
                                message: 'The name is already used'
                            })
                        }  
                    }
                }catch (err){
                    reject(err)
                }
            })
        })
    }

    static validate(alternativeMedicinesData) {
        try {
            const validationResult = alternativeMediValidator.validate(alternativeMedicinesData)
            return validationResult;
        } catch (err) {
            return false
        }
    }
// insert alternativeMediValidator
    save(res,cb) { 
        dbConnection('alternativeMedicines', async (collection) => {
            try { 
                await collection.insertOne(this.alternativeMedicinesData)
                    .then(result => {
                        cb({
                            status: true,
                            _id: result.insertedId
                        })
                    }) 

            } catch (err){
                cb({
                    status: false,
                    message: err.message
                });
            }
        })
    }
// find All alternativeMedicinesData
static findAll(){
    return new Promise((resolve,reject)=>{
        dbConnection('alternativeMedicines',async(collection)=>{
            try{
                const alernativeMedic=await collection.find().toArray();
                resolve(alernativeMedic);
            }catch(err){reject(err.message);}
        });

    });
}
// update alternativeMedicines
static update(id, newData) {
    return new Promise((resolve, reject) => {
        dbConnection('alternativeMedicines', async (collection) => {
            try {
                const result = await collection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: newData }
                );

                if (result.modifiedCount === 0) {
                    resolve({ status: false });
                } else {
                    resolve({ status: true });
                }
            } catch (err) {
                reject(err);
            }
        });
    });
}
static remove(id){
    return new Promise((resolve,reject)=>{
        dbConnection('alternativeMedicines', async (collection) => {
            try{
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
            }catch(err){
                 reject(err);
            }
        });
    });
} 


}
module.exports=AlternativeMedi;