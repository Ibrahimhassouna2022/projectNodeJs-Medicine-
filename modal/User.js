const dbConnection  = require('../configurations');
const { userValidator, loginValidator } = require('../validators');
const { hashSync, compareSync } = require('bcryptjs');
 
class User
{
    constructor(userData){
        this.userData = userData;
    }

    save(cb) { 
        dbConnection('users', async (collection) => {
            try {
                const hashedPassword = hashSync(this.userData.password);
                this.userData.password = hashedPassword;
                await collection.insertOne(this.userData)
                    .then(result => {
                        cb({
                            status: true,
                            _user_id: result.insertedId
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

    isExist() {
        return new Promise((resolve, reject )=> {
            dbConnection('users', async (collection) => {
                try {
                    const user = await collection.findOne({
                        '$or': [
                            {username: this.userData.username},
                            {email: this.userData.email}
                        ]
                    })
                    if (!user) {
                        resolve ({
                            check: false
                        })
                    } else {
                        if (user.email === this.userData.email) {
                            resolve ({ 
                                check: true,
                                message: 'The emali is already used'
                            })
                        } else if (user.username === this.userData.username) {
                            resolve ({
                                check: true,
                                message: 'The username is already used'
                            })
                        }
                    }
                }catch (err){
                    reject(err)
                }
            })
        })
    }
    static validate(userData) {
        try {
            const validationResult = userValidator.validate(userData)
            return validationResult;
        } catch (err) {
            return false
        }
    }

    static login(loginData) {
        return new Promise((resolve, reject) => {
          dbConnection('users', async (collection) => {
            try {
              const user = await collection.findOne({ username: loginData.username });
      
              if (user) {
                if (compareSync(loginData.password, user.password)) {
                  resolve({
                    status: true,
                    data: user
                  });
                } else {
                  resolve({
                    status: false,
                    code: 401,
                    message:"password is inCorrect"
                  });
                }
              } else {
                resolve({
                  status: false,
                  code: 401,
                  message:"userName not Found"
                });
              }
            } catch (err) {
              reject(err);
            }
          });
        });
      }
      static logout(token) {
        return new Promise((resolve, reject) => {
            dbConnection('blacklist', async (collection) => {
                try {
                    await collection.insertOne({ token, createdAt: new Date() });
                    resolve({ status: true });
                } catch (err) {
                    reject(err);
                }
            });
        });
    }
    
      
      
}

module.exports = { User };
 