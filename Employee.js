const mongoose = require('mongoose')
  
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    photo: String
})
  
// const EmployeeModel = mongoose.model("employee", UserSchema)
const EmployeeModel = mongoose.model("employees", UserSchema); // nama koleksi jadi 'employees' (lowercase + plural)

  
module.exports = EmployeeModel;
