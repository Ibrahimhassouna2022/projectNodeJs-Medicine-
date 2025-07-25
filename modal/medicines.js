const { ObjectId } = require('mongodb');
const dbConnection = require('../configurations');
const { medicinesValidator } = require('../validators');
const { hashSync, compareSync } = require('bcryptjs');
class Medicines {
    constructor(medicinesData) {
        this.medicinesData = medicinesData;
    }

    isExist() {
        return new Promise((resolve, reject) => {
            dbConnection('medicines', async (collection) => {
                try {
                    const medicine = await collection.findOne({ name: this.medicinesData.name })
                    if (!medicine) {
                        resolve({
                            check: false
                        })
                    } else {
                        if (medicine.name === this.medicinesData.name) {
                            resolve({
                                check: true,
                                message: 'The name is already used'
                            })
                        }
                    }
                } catch (err) {
                    reject(err)
                }
            })
        })
    }
    static validate(medicinesData) {
        try {
            const validationResult = medicinesValidator.validate(medicinesData)
            return validationResult;
        } catch (err) {
            return false
        }
    }
    // insert pharmacy
    save(res, cb) {
        dbConnection('medicines', async (collection) => {
            try {
                await collection.insertOne(this.medicinesData)
                    .then(result => {
                        cb({
                            status: true,
                            _id: result.insertedId
                        })
                    })

            } catch (err) {
                cb({
                    status: false,
                    message: err.message
                });
            }
        })
    }
    // find All
    static findAll() {
        return new Promise((resolve, reject) => {
            dbConnection('medicines', async (collection) => {
                try {
                    const medicin = await collection.find().toArray();
                    resolve(medicin);
                } catch (err) { reject(err.message); }
            });

        });
    }
    // update Pharmacy
    static update(id, newData) {
        return new Promise((resolve, reject) => {
            dbConnection('medicines', async (collection) => {
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

    // remove Pharmacy
    static remove(id) {
        return new Promise((resolve, reject) => {
            dbConnection('medicines', async (collection) => {
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
module.exports = Medicines;