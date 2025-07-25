//create,update,delte,show,
const createError = require('http-errors');
const { Pharmacy } = require('../modal');
const { returnJson } = require('../my_modules/json_response')
// addPharmacy
const createPharmacy = (req, res, next) => {
  const data = { ...req.body };
  const validation = Pharmacy.validate(data);
  if (validation.error) {
    return next(createError(400, validation.error.message))
  }
  const pharmacy = new Pharmacy(data);
  pharmacy.isExist()
    .then(result => {
      if (result.check) {

        return next(createError(409, result.message))
      }
      pharmacy.save(res, (status) => {
        if (status.status) {
          return returnJson(res, 200, true, 'Pharmacy created successfully', status._id);
        } else {
          return next(createError(500, status.message));
        }
      });


    })
    .catch(err => next(createError(500, err.message)));
}
// getAllPharmacy
const getAllPharmacy = (req, res, next) => {
  Pharmacy.findAll()
    .then(pharmacies => res.json(pharmacies))
    .catch(err => next(createError(500, err.message)));
}
// updatePharmacay
const updatePharmacay = (req, res, next) => {
  const { ObjectId } = require('mongodb');
  if (!ObjectId.isValid(id)) {
    return next(createError(400, 'Invalid ID'));
  }

  Pharmacy.update(req.params.id, req.body)
    .then(() => res.json({ message: 'Pharmacy updated Successfully' }))
    .catch(err => next(createError(500, err.message)));
}
//
const removePharmacay = (req, res, next) => {
  const { ObjectId } = require('mongodb');
  const id = req.query.id;

  if (!ObjectId.isValid(id)) {
       return next(createError(400, 'Invalid ID format'));
  }
  Pharmacy.remove(req.query.id)
    .then(result => {
      if (result.status) {
        res.json({ message: 'Pharmacy deleted Successfully' });
      } else {
        next(createError(404, 'Pharmacy not found'));
      }
    })
    .catch(err => next(createError(500, err.message)));
};

module.exports = {
  createPharmacy,
  getAllPharmacy,
  updatePharmacay,
  removePharmacay
}